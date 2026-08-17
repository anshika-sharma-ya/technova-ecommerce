// Role-Based Access Control (RBAC) Middleware

function checkRole(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User is not authenticated' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: User role '${req.user.role}' does not have required permissions`,
      });
    }

    next();
  };
}

module.exports = checkRole;
