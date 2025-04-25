import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({path: "../server/.env"});

let accessSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;  

// Middleware to validate token
export const validateToken = (req, res) => {
    const authHeader = req.headers.Authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const token = authHeader.split(' ')[1];

    jwt.verify(
        token, 
        accessSecretKey, 
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ error: 'Invalid or expired token' });
            }

            // If the token is valid, return the decoded payload (which contains user info)
            req.user = {
                userId: decoded.userId,
                user_type: decoded.user_type
            };
            
            next();
    });
};
