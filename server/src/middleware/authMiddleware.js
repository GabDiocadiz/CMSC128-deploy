import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach decoded token payload to the request
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token.' });
    }
}

export function authorizeRoles(allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.user_type)) {
            return res.status(403).json({ message: 'Forbidden. You do not have access to this resource.' });
        }
        next();
    };
}
