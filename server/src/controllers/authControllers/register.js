import { User, Admin, Alumni } from '../../models/User.js';
import { alumniController } from '../modelControllers/alumniController.js';
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
dotenv.config({path: "../server/.env"})

export const register = async (req, res) => {
    try {
        // check if existing email
        const existingEmail = await User.findOne({ email: req.body.email });
        if (existingEmail) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        // check user type
        if (!["Admin", "Alumni"].includes(req.body.user_type)) {
            return res.status(400).json({ error: 'Invalid User Type' });
        }

        // encrypt password
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
