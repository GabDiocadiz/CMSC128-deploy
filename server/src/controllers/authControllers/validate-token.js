/*
accept token in req.header
validate with jwt
if valid, return with status 200
else return error with status 401

note: keys should be in .env file
*/

import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

let router = express.Router();
let secretKey = process.env.SECRET_KEY;  // Retrieve the secret key from .env file

// Middleware to validate token
router.post('/validate-token', (req, res) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Assuming token is in the format "Bearer <token>"
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        // If the token is valid, return the decoded payload (which contains user info)
        res.status(200).json({ message: 'Token is valid', decoded });
    });
});

export { router };
