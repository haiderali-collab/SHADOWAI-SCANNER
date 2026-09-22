import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required. Please log in.' });
  }

  const jwtSecret = process.env.JWT_SECRET || 'super_secret_shadow_ai_jwt_key_2026_change_in_production';

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired session token.' });
    }
    req.user = user;
    next();
  });
}
