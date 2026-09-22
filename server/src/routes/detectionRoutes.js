import express from 'express';
import db from '../db/database.js';
import { calculateRiskScore } from '../services/riskEngine.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
export const detectionLogRouter = express.Router();

/**
 * POST /api/detections
 * Receives automated domain detections from Chrome Browser Extension.
 * Unauthenticated endpoint (called from employee client extensions).
 *
 * Payload: { domain: string, toolName: string, detectedAt: string, employeeName: string, employeeEmail: string }
 */
router.post('/', (req, res) => {
  try {
    const { domain, toolName, detectedAt, employeeName, employeeEmail } = req.body;

    if (!domain || !toolName) {
      return res.status(400).json({ message: 'Domain and toolName are required for detection reporting.' });
    }

    const cleanDomain = String(domain).trim().toLowerCase();
    const cleanToolName = String(toolName).trim();
    const timestampStr = detectedAt ? String(detectedAt).trim() : new Date().toISOString();
    const cleanEmpName = employeeName ? String(employeeName).trim() : 'Unknown Employee';
    const cleanEmpEmail = employeeEmail ? String(employeeEmail).trim() : 'N/A';

    // Check if vendor already exists in SQLite database (case-insensitive)
    let vendor = db.prepare('SELECT * FROM vendors WHERE LOWER(name) = LOWER(?) OR LOWER(name) LIKE LOWER(?)')
      .get(cleanToolName, `%${cleanToolName}%`);

    let isNewVendor = false;

    if (!vendor) {
      // Assemble new Shadow AI Vendor payload
      const vendorPayload = {
        name: cleanToolName,
        category: 'AI Tool',
        data_sensitivity: 'Medium',
        has_compliance: 0,
        has_breach_history: 0,
        approved_by_it: 0, // Default to unapproved (Shadow AI)
        description: `Auto-detected via browser extension on domain: ${cleanDomain} at ${timestampStr}`,
        owner_department: 'Unknown / Shadow'
      };

      const scoreResult = calculateRiskScore(vendorPayload);
      const risk_score = scoreResult.risk_score ?? 60;
      const risk_level = scoreResult.risk_level ?? 'Medium';
      const is_shadow = 1; // Always 1 for auto-detected unapproved tools

      const result = db.prepare(`
        INSERT INTO vendors (
          name, category, data_sensitivity, has_compliance,
          has_breach_history, approved_by_it, risk_score,
          risk_level, is_shadow, description, owner_department
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        vendorPayload.name,
        vendorPayload.category,
        vendorPayload.data_sensitivity,
        vendorPayload.has_compliance,
        vendorPayload.has_breach_history,
        vendorPayload.approved_by_it,
        risk_score,
        risk_level,
        is_shadow,
        vendorPayload.description,
        vendorPayload.owner_department
      );

      vendor = db.prepare('SELECT * FROM vendors WHERE id = ?').get(result.lastInsertRowid);
      isNewVendor = true;
      console.log(`🔍 [SHADOW AI DETECTED] Auto-registered "${cleanToolName}" (${cleanDomain}) as Shadow Tool ID #${result.lastInsertRowid}`);
    }

    // ALWAYS insert a new row into detection_logs recording this specific usage event
    db.prepare(`
      INSERT INTO detection_logs (vendor_id, vendor_name, employee_name, employee_email, detected_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      vendor.id,
      vendor.name,
      cleanEmpName,
      cleanEmpEmail,
      timestampStr
    );

    console.log(`📊 [DETECTION LOG RECORDED] ${cleanEmpName} (${cleanEmpEmail}) accessed ${vendor.name} at ${timestampStr}`);

    return res.status(isNewVendor ? 201 : 200).json({
      tracked: !isNewVendor,
      message: isNewVendor
        ? `New Shadow AI tool "${cleanToolName}" auto-detected and registered!`
        : `Detection logged for existing vendor "${vendor.name}".`,
      vendor
    });
  } catch (err) {
    console.error('Error processing extension detection:', err);
    return res.status(500).json({ message: 'Failed to process domain detection.' });
  }
});

/**
 * GET /api/detection-logs
 * Protected (admin-only). Returns most recent detection logs with vendor risk details.
 */
detectionLogRouter.get('/', authenticateToken, (req, res) => {
  try {
    const logs = db.prepare(`
      SELECT 
        dl.id,
        dl.vendor_id,
        dl.vendor_name,
        dl.employee_name,
        dl.employee_email,
        dl.detected_at,
        COALESCE(v.risk_level, 'Medium') as risk_level,
        COALESCE(v.risk_score, 60) as risk_score,
        COALESCE(v.category, 'AI Tool') as category,
        COALESCE(v.approved_by_it, 0) as approved_by_it
      FROM detection_logs dl
      LEFT JOIN vendors v ON dl.vendor_id = v.id
      ORDER BY dl.detected_at DESC
      LIMIT 100
    `).all();

    return res.json({ logs });
  } catch (err) {
    console.error('Error fetching detection logs:', err);
    return res.status(500).json({ message: 'Failed to retrieve detection logs.' });
  }
});

export default router;

