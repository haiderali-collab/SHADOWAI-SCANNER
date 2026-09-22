/**
 * Calculates Risk Score (0-100), Risk Level (Low/Medium/High), and Shadow Status.
 *
 * Scoring Rules:
 * - Data Sensitivity: High = +35, Medium = +20, Low = +5
 * - Has Compliance Certification (SOC2, GDPR, ISO27001): No = +25, Yes = 0
 * - Known Data Breach History: Yes = +25, No = 0
 * - IT Approval: Not Approved = +15, Approved = 0
 * - High Data Sensitivity + Unapproved IT Compound Penalty: +10 extra penalty
 */
export function calculateRiskScore(vendor) {
  const {
    data_sensitivity = 'Medium',
    has_compliance = 0,
    has_breach_history = 0,
    approved_by_it = 1
  } = vendor;

  let score = 0;

  // 1. Data Sensitivity
  const sensitivityMap = {
    High: 35,
    Medium: 20,
    Low: 5
  };
  score += sensitivityMap[data_sensitivity] || 20;

  // 2. Compliance Certification
  const complianceVal = Number(has_compliance);
  if (complianceVal === 0) {
    score += 25;
  }

  // 3. Breach History
  const breachVal = Number(has_breach_history);
  if (breachVal === 1) {
    score += 25;
  }

  // 4. IT Approval / Shadow status
  const approvedVal = Number(approved_by_it);
  if (approvedVal === 0) {
    score += 15;
    // Compound penalty for unapproved tool handling sensitive data
    if (data_sensitivity === 'High') {
      score += 10;
    }
  }

  // Ensure score stays within 0 to 100
  const finalScore = Math.min(100, Math.max(0, score));

  // Determine Risk Level
  let risk_level = 'Low';
  if (finalScore >= 65) {
    risk_level = 'High';
  } else if (finalScore >= 30) {
    risk_level = 'Medium';
  }

  const is_shadow = approvedVal === 0 ? 1 : 0;

  return {
    risk_score: finalScore,
    risk_level,
    is_shadow
  };
}
