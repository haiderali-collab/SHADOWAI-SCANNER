import express from 'express';
import multer from 'multer';
import db from '../db/database.js';
import { calculateRiskScore } from '../services/riskEngine.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Protect all vendor routes
router.use(authenticateToken);

// GET /api/vendors - Fetch all vendors + dashboard summary statistics
router.get('/', (req, res) => {
  try {
    const vendors = db.prepare('SELECT * FROM vendors ORDER BY risk_score DESC, id DESC').all();

    // Calculate metrics
    const totalCount = vendors.length;
    const shadowCount = vendors.filter(v => v.is_shadow === 1).length;
    const highRiskCount = vendors.filter(v => v.risk_level === 'High').length;
    const mediumRiskCount = vendors.filter(v => v.risk_level === 'Medium').length;
    const lowRiskCount = vendors.filter(v => v.risk_level === 'Low').length;
    const compliantCount = vendors.filter(v => v.has_compliance === 1).length;
    const complianceRate = totalCount > 0 ? Math.round((compliantCount / totalCount) * 100) : 100;

    const summary = {
      totalCount,
      shadowCount,
      highRiskCount,
      mediumRiskCount,
      lowRiskCount,
      complianceRate,
      riskDistribution: [
        { name: 'High Risk', value: highRiskCount, color: '#f43f5e' },
        { name: 'Medium Risk', value: mediumRiskCount, color: '#f59e0b' },
        { name: 'Low Risk', value: lowRiskCount, color: '#10b981' }
      ]
    };

    return res.json({ vendors, summary });
  } catch (err) {
    console.error('Error fetching vendors:', err);
    return res.status(500).json({ message: 'Error retrieving vendors list.' });
  }
});

// POST /api/vendors - Add new vendor/AI tool
router.post('/', (req, res) => {
  try {
    const {
      name,
      category,
      data_sensitivity,
      has_compliance,
      has_breach_history,
      approved_by_it,
      description = '',
      owner_department = ''
    } = req.body;

    if (!name || !category || !data_sensitivity) {
      return res.status(400).json({ message: 'Name, Category, and Data Sensitivity are required.' });
    }

    const vendorPayload = {
      name: name.trim(),
      category: category.trim(),
      data_sensitivity,
      has_compliance: Number(has_compliance) ? 1 : 0,
      has_breach_history: Number(has_breach_history) ? 1 : 0,
      approved_by_it: Number(approved_by_it) ? 1 : 0,
      description: description ? description.trim() : '',
      owner_department: owner_department ? owner_department.trim() : ''
    };

    const { risk_score, risk_level, is_shadow } = calculateRiskScore(vendorPayload);

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

    const newVendor = db.prepare('SELECT * FROM vendors WHERE id = ?').get(result.lastInsertRowid);

    return res.status(201).json({
      message: 'Vendor added successfully!',
      vendor: newVendor
    });
  } catch (err) {
    console.error('Error adding vendor:', err);
    return res.status(500).json({ message: 'Failed to add vendor.' });
  }
});

// PUT /api/vendors/:id - Update existing vendor
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT * FROM vendors WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }

    const {
      name,
      category,
      data_sensitivity,
      has_compliance,
      has_breach_history,
      approved_by_it,
      description,
      owner_department
    } = req.body;

    const vendorPayload = {
      name: name !== undefined ? name.trim() : existing.name,
      category: category !== undefined ? category.trim() : existing.category,
      data_sensitivity: data_sensitivity !== undefined ? data_sensitivity : existing.data_sensitivity,
      has_compliance: has_compliance !== undefined ? (Number(has_compliance) ? 1 : 0) : existing.has_compliance,
      has_breach_history: has_breach_history !== undefined ? (Number(has_breach_history) ? 1 : 0) : existing.has_breach_history,
      approved_by_it: approved_by_it !== undefined ? (Number(approved_by_it) ? 1 : 0) : existing.approved_by_it,
      description: description !== undefined ? description.trim() : existing.description,
      owner_department: owner_department !== undefined ? owner_department.trim() : existing.owner_department
    };

    const { risk_score, risk_level, is_shadow } = calculateRiskScore(vendorPayload);

    db.prepare(`
      UPDATE vendors SET
        name = ?,
        category = ?,
        data_sensitivity = ?,
        has_compliance = ?,
        has_breach_history = ?,
        approved_by_it = ?,
        risk_score = ?,
        risk_level = ?,
        is_shadow = ?,
        description = ?,
        owner_department = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
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
      vendorPayload.owner_department,
      id
    );

    const updatedVendor = db.prepare('SELECT * FROM vendors WHERE id = ?').get(id);

    return res.json({
      message: 'Vendor updated successfully!',
      vendor: updatedVendor
    });
  } catch (err) {
    console.error('Error updating vendor:', err);
    return res.status(500).json({ message: 'Failed to update vendor.' });
  }
});

// DELETE /api/vendors/:id - Delete vendor
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT id FROM vendors WHERE id = ?').get(id);

    if (!existing) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }

    db.prepare('DELETE FROM vendors WHERE id = ?').run(id);

    return res.json({ message: 'Vendor deleted successfully!', id: Number(id) });
  } catch (err) {
    console.error('Error deleting vendor:', err);
    return res.status(500).json({ message: 'Failed to delete vendor.' });
  }
});

// POST /api/vendors/bulk-import - Bulk import vendors from CSV file or JSON array
router.post('/bulk-import', upload.single('file'), (req, res) => {
  try {
    let rowsToImport = [];

    if (req.file) {
      // Process CSV buffer
      const csvString = req.file.buffer.toString('utf-8');
      rowsToImport = parseCSVString(csvString);
    } else if (req.body.csvText) {
      rowsToImport = parseCSVString(req.body.csvText);
    } else if (Array.isArray(req.body.vendors)) {
      rowsToImport = req.body.vendors;
    } else {
      return res.status(400).json({ message: 'No file, csvText, or vendors array provided for bulk import.' });
    }

    if (rowsToImport.length === 0) {
      return res.status(400).json({ message: 'No valid vendor rows found in import data.' });
    }

    const insertStmt = db.prepare(`
      INSERT INTO vendors (
        name, category, data_sensitivity, has_compliance,
        has_breach_history, approved_by_it, risk_score,
        risk_level, is_shadow, description, owner_department
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let importedCount = 0;

    const transaction = db.transaction((items) => {
      for (const item of items) {
        if (!item.name || !item.name.trim()) continue;

        const data_sensitivity = parseSensitivity(
          item['data sensitivity'] || item.data_sensitivity || item.sensitivity
        );
        const has_compliance = parseBool(
          item.compliance || item.has_compliance
        );
        const has_breach_history = parseBool(
          item['breach history'] || item.has_breach_history || item.breach
        );
        const approved_by_it = parseBool(
          item['approved by it'] || item.approved_by_it || item.approved,
          true
        );
        const owner_department = (
          item.department || item.owner_department || ''
        ).trim();

        const vendorPayload = {
          name: item.name.trim(),
          category: (item.category || 'SaaS Vendor').trim(),
          data_sensitivity,
          has_compliance,
          has_breach_history,
          approved_by_it,
          description: (item.description || '').trim(),
          owner_department
        };

        const scoreResult = calculateRiskScore(vendorPayload);
        const risk_score = scoreResult.risk_score ?? 50;
        const risk_level = scoreResult.risk_level ?? 'Medium';
        const is_shadow = scoreResult.is_shadow ?? 0;

        insertStmt.run(
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

        importedCount++;
      }
    });

    transaction(rowsToImport);

    return res.status(201).json({
      message: `Successfully imported ${importedCount} vendors!`,
      importedCount
    });
  } catch (err) {
    console.error('Error bulk importing vendors:', err);
    return res.status(500).json({ message: 'Bulk import failed. Please check CSV format.' });
  }
});

// GET /api/vendors/export/csv - Download CSV report
router.get('/export/csv', (req, res) => {
  try {
    const vendors = db.prepare('SELECT * FROM vendors ORDER BY risk_score DESC').all();

    const headers = [
      'ID',
      'Name',
      'Category',
      'Data Sensitivity',
      'Compliance Cert (SOC2/GDPR)',
      'Known Breach History',
      'Approved by IT',
      'Risk Score (0-100)',
      'Risk Level',
      'Shadow Status',
      'Owner Department',
      'Description',
      'Created At'
    ];

    const csvRows = [headers.join(',')];

    for (const v of vendors) {
      const row = [
        v.id,
        `"${escapeCsv(v.name)}"`,
        `"${escapeCsv(v.category)}"`,
        v.data_sensitivity,
        v.has_compliance === 1 ? 'Yes' : 'No',
        v.has_breach_history === 1 ? 'Yes' : 'No',
        v.approved_by_it === 1 ? 'Yes' : 'No',
        v.risk_score,
        v.risk_level,
        v.is_shadow === 1 ? 'SHADOW / UNAPPROVED' : 'Approved',
        `"${escapeCsv(v.owner_department || '')}"`,
        `"${escapeCsv(v.description || '')}"`,
        v.created_at
      ];
      csvRows.push(row.join(','));
    }

    const csvData = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="shadow_ai_vendor_risk_report.csv"');
    return res.status(200).send(csvData);
  } catch (err) {
    console.error('CSV Export Error:', err);
    return res.status(500).json({ message: 'Failed to export CSV.' });
  }
});

// Helper utilities for CSV parsing
function escapeCsv(str) {
  if (!str) return '';
  return str.replace(/"/g, '""');
}

function parseBool(val, defaultVal = false) {
  if (val === undefined || val === null || val === '') return defaultVal ? 1 : 0;
  const str = String(val).toLowerCase().trim();
  if (['yes', 'y', '1', 'true', 'approved'].includes(str)) return 1;
  if (['no', 'n', '0', 'false', 'unapproved'].includes(str)) return 0;
  return defaultVal ? 1 : 0;
}

function parseSensitivity(val) {
  if (!val) return 'Medium';
  const str = String(val).toLowerCase().trim();
  if (str.includes('high')) return 'High';
  if (str.includes('low')) return 'Low';
  return 'Medium';
}

function parseCSVString(csvText) {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    // Basic CSV splitting respecting quotes
    const currentLine = lines[i];
    const values = [];
    let insideQuote = false;
    let entry = '';

    for (let charIndex = 0; charIndex < currentLine.length; charIndex++) {
      const char = currentLine[charIndex];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        values.push(entry.trim().replace(/^"|"$/g, ''));
        entry = '';
      } else {
        entry += char;
      }
    }
    values.push(entry.trim().replace(/^"|"$/g, ''));

    if (values.length === headers.length || values[0]) {
      const rowObj = {};
      headers.forEach((h, index) => {
        rowObj[h] = values[index] !== undefined ? values[index] : '';
      });
      rows.push(rowObj);
    }
  }

  return rows;
}

export default router;
