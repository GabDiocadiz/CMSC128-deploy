import { Alumni } from '../models/user.js';

export async function createAlumni(req, res) {
    try {
        const newAlumni = new Alumni(req.body);
        await newAlumni.save();
        res.status(201).json(newAlumni);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

export async function getAllAlumni(req, res) {
    try {
        const alumni = await Alumni.find();
        res.status(200).json(alumni);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}
