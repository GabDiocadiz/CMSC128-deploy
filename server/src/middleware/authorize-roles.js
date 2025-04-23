export function authorizeRoles(allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.user_type)) {
            return res.status(403).json({ message: 'Forbidden. You do not have access to this resource.' });
        }
        next();
    };
}
