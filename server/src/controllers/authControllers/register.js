import { User, Admin, Alumni } from '../../models/User.js';
import { alumniController } from '../modelControllers/alumniController.js';
import { adminController } from '../modelControllers/adminController.js';
import bcrypt from 'bcrypt';
import dotenv from "dotenv";
dotenv.config({path: "../server/.env"})
import {
    uploadFilesForModel,
    getFilesForModel,
    deleteFileFromModel,
    downloadFile
} from "../fileController/fileController.js";

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
            await adminController.create(req, res);
        } else {
            await alumniController.create(req, res);
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Registration failed' });
    }
};

export const uploadProfilePicture = async (req, res) => {
    req.params.modelName = "User";
    req.params.id = req.params.event_id;
    return uploadFilesForModel(req, res);
};
        
    
export const getProfilePicture = async (req, res) => {
    req.params.modelName = "User";
    req.params.id = req.params.event_id; 
    return getFilesForModel(req, res);
};

export const deleteProfilePicture = async (req, res)  => {
    req.params.modelName = "User";
    req.params.id = req.params.event_id; 
    return deleteFileFromModel(req, res);
};
