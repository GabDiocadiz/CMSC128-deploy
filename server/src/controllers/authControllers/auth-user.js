import { User, Admin, Alumni } from '../../models/User.js';
import { alumniController } from '../modelControllers/alumniController.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
dotenv.config({path: "../server/.env"})

let accessSecretKey = process.env.ACCESS_TOKEN_SECRET__KEY;
let refreshSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;


export const register = async (req, res) => {
    try {
        // check if existing email
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        // check user type      *can probably remove when input middleware is made
        if (!["Admin", "Alumni"].includes(req.body.user_type)) {
            return res.status(400).json({ error: 'Invalid User Type' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        if (req.body.user_type === "Admin") {
            await alumniController.create(req, res);
        } else {
            await alumniController.create(req, res);
        }

        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed' });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email: email});

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        // create access token
        const accessToken = jwt.sign(
            { userId: user._id, user_type: user.user_type },
            accessSecretKey,
            { expiresIn: '10m' }
        );

        // create refresh token
        const refreshToken = jwt.sign(
            { userId: user._id, user_type: user.user_type },
            refreshSecretKey,
            { expiresIn: '1d' }
        )

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None', 
            secure: true,
            maxAge: 24 * 60 * 60 * 1000
        })

        res.status(200).json({ accessToken });
    } catch (e) {
        console.error('Login Error: ', e)
        res.status(500).json({ error: 'Login failed' });
    }
};


export const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.jwt;

        jwt.verify(
            refreshToken, 
            refreshSecretKey,
            async (err, decoded) => {
                if (err) {
                    return res.status(406).json({ message: 'Invalid or expired refresh token' });
                }
                
                const user = await User.findById(decoded.userId)

                if (!user) {
                    return res.status(401).json({ message: 'User not found' });
                }

                const accessToken = jwt.sign(
                    { userId: user._id, user_type: user.user_type },
                    accessSecretKey,
                    { expiresIn: '10m' }
                );

                res.status(200).json({ accessToken });
            }
            
        )
    } catch (e) {
        console.error('Refresh Error: ', e)
        res.status(500).json({ error: 'Failed to access token'});
    }
}