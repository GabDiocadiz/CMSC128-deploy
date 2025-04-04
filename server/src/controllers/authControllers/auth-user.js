import express from 'express';
import { User, Admin, Alumni } from '../../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

let secretKey = process.env.SECRET_KEY;

export const register = async (req, res) => {
    try {
        const { name, email, password, user_type, ...otherFields } = req.body;

        if (!["Admin", "Alumni"].includes(user_type)) {
            return res.status(400).json({ error: 'Invalid User Type' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let newUser;

        if (user_type === "Admin") {
            newUser = new Admin({ name, email, password: hashedPassword, ...otherFields });
        } else {
            newUser = new Alumni({ name, email, password: hashedPassword, ...otherFields });
        }

        await newUser.save();
        res.status(200).json({ message: 'User registered successfully' });
    } catch (e) {
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const token = jwt.sign(
            { userId: user._id, user_type: user.user_type },
            secretKey,
            { expiresIn: '1h' }
        );

        res.status(200).json({ token });
    } catch (e) {
        res.status(500).json({ error: 'Login failed' });
    }
};
