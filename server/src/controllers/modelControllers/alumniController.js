import { Alumni, AlumniCollection } from '../../models/User.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';

export const alumniController = {
    ...createCRUDController(Alumni),
}

export async function getAllAlumni(req, res) {
    try {
        const alumni = await Alumni.find();
        res.status(200).json(alumni);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

// Controller function to search for alumni based on query parameters
export const alumniSearch = async (req, res) => {
    try {
        // Destructure query parameters from the request
        const {
            name = '',
            degree = '',
            graduation_year,
            current_job_title = '',
            company = '',
            skills = ''
        } = req.query;

        // Initialize the MongoDB match stage with a filter to only show visible profiles
        const matchStage = {
            profile_visibility: true
        };

        // Add regex-based matching for various fields if provided
        if (name) matchStage.name = { $regex: name, $options: 'i' }; // case-insensitive name search
        if (degree) matchStage.degree = { $regex: degree, $options: 'i' }; // case-insensitive degree search
        if (current_job_title) matchStage.current_job_title = { $regex: current_job_title, $options: 'i' }; // job title match
        if (company) matchStage.company = { $regex: company, $options: 'i' }; // company name match
        if (skills) matchStage.skills = { $in: [new RegExp(skills, 'i')] }; // case-insensitive skill match using RegExp
        if (graduation_year) matchStage.graduation_year = parseInt(graduation_year); // convert grad year to int for exact match

        // Perform an aggregation query on the Alumni collection
        const alumni = await Alumni.aggregate([
            { $match: matchStage }, // filter documents based on matchStage

            // Add a temporary field `lastname` extracted from the full `name` for sorting
            {
                $addFields: {
                    lastname: {
                        $arrayElemAt: [
                            { $split: ["$name", " "] }, // split the name string by space
                            -1 // get the last element (assumed to be last name)
                        ]
                    }
                }
            },

            // Sort the results by lastname in ascending order
            { $sort: { lastname: 1 } }
        ]);

        // If no results found, return a 404 with a message
        if (alumni.length === 0) {
            return res.status(404).json({ message: 'No alumni match the search criteria.' });
        }

        // Return the matching alumni with a 200 OK response
        res.status(200).json(alumni);
    } catch (error) {
        // Log any errors and return a 500 Internal Server Error
        console.error('Alumni Search Error:', error);
        res.status(500).json({ message: 'Server error while searching alumni.' });
    }
};
