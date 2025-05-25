import { Alumni, AlumniCollection } from '../../models/User.js';
import { JobPosting } from '../../models/Job_Posting.js';
import  Donation  from '../../models/Donation.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';

export const alumniController = {
    ...createCRUDController(Alumni),

    async findAlumniById(req, res) {
        try {
            const { id } = req.params;
            const event = await Alumni.findById(id);
            if (!event) {
                return res.status(404).json({ message: "User not found" });
            }
            res.status(200).json(event);
        } catch (e) {
            console.error("Error in eventController.findAlumniById:", e);
            res.status(500).json({ message: e.message });
        }
    },

    async deleteByEmail(req, res) {
        try {
            const { email } = req.params;
            const deleted = await Alumni.findOneAndDelete({ email });
        
            if (!deleted) return res.status(404).json({ message: 'User not found' });
        
            res.status(200).json({ message: 'User deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async editProfile(req, res) {
        if (req.params.id !== req.user.userId) {
            return res.status(401)
        }
        
        try {
            const { contact_number, address, current_job_title, company, industry, skills, files } = req.body;
        
            const updatedUser = await Alumni.findByIdAndUpdate(
            req.params.id,
            {
                contact_number,
                address,
                current_job_title,
                company,
                industry,
                skills,
                files,
            },
            { new: true, runValidators: true }
            ).select('-password');
        
            if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
            }
        
            res.json({ message: 'Profile updated successfully!', user: updatedUser });
        } catch (err) {
            console.error(err);
            if (err.name === 'ValidationError') {
            const errors = {};
            for (const field in err.errors) {
                errors[field] = err.errors[field].message;
            }
            return res.status(400).json({ message: 'Validation error', errors });
            }
            res.status(500).json({ message: 'Server error' });
        }
    }
}

export const alumniSearch = async (req, res) => {
    try {
        const {
            name = '',
            degree = '',
            startYear,
            endYear,
            current_job_title = '',
            company = '',
            skills = '',
            files
        } = req.query;

        // Initialize the match stage with profile visibility
        const matchStage = {
            profile_visibility: true,
        };

        // Add filters only if they are non-empty
        if (name) {
            matchStage.$or = [
                { first_name: { $regex: name, $options: 'i' } },
                { last_name: { $regex: name, $options: 'i' } }
            ];
        }
        if (degree) matchStage.degree = { $regex: degree, $options: 'i' };
        if (current_job_title) matchStage.current_job_title = { $regex: current_job_title, $options: 'i' };
        if (company) matchStage.company = { $regex: company, $options: 'i' };

        // Handle skills: Using $in to match any skill in the array
        if (skills) {
            const skillsArray = skills.split(',').map(skill => skill.trim());
            matchStage.skills = { $in: skillsArray };
        }

        // Handle graduation year range
        if (startYear && endYear) {
            matchStage.graduation_year = { $gte: parseInt(startYear), $lte: parseInt(endYear) };
        } else if (startYear) {
            matchStage.graduation_year = { $gte: parseInt(startYear) };
        } else if (endYear) {
            matchStage.graduation_year = { $lte: parseInt(endYear) };
        }

        console.log("Match Stage:", matchStage); // Debug match stage

        const alumni = await Alumni.aggregate([
            { $match: matchStage }, // Apply initial filters

            // --- Job Count Stages (Existing) ---
            {
                $lookup: {
                    from: JobPosting.collection.name,
                    localField: '_id',
                    foreignField: 'posted_by',
                    as: 'postedJobs'
                }
            },
            {
                $addFields: {
                    jobCount: { $size: '$postedJobs' }
                }
            },

            // --- Donation Total Amount Stages (NEW) ---
            {
                $lookup: {
                    from: Donation.collection.name, // Collection name for the Donation model
                    localField: '_id',               // Alumni's _id
                    foreignField: 'donor',           // Field in Donation referencing Alumni
                    as: 'donationsMade'              // Array of donation documents for this alumni
                }
            },
            {
                $addFields: {
                    // Calculate total amount. $sum will correctly handle empty arrays (0 sum)
                    totalDonationAmount: { $sum: '$donationsMade.amount' }
                }
            },

            // --- Project Stage (Clean up output, ensure all desired fields are included) ---
            {
                $project: {
                    // Include basic alumni fields you always want
                    _id: 1,
                    first_name: 1,
                    last_name: 1,
                    name: 1,
                    email: 1,
                    degree: 1,
                    graduation_year: 1,
                    current_job_title: 1,
                    company: 1,
                    industry: 1,
                    skills: 1,
                    profile_visibility: 1,
                    files: 1, // Include files for profile pictures
                    contact_number: 1, // Assuming these are also fields you want
                    address: 1,
                    files: 1, // Include files for profile pictures

                    // Include the computed fields
                    jobCount: 1,
                    totalDonationAmount: 1,

                }
            },

            // Original $addFields for 'lastname' (for sorting)
            {
                $addFields: {
                    lastname: {
                        $ifNull: [
                            {
                                // If 'name' is the full name field (e.g., "John Doe")
                                $arrayElemAt: [
                                    { $split: ["$name", " "] },
                                    -1,
                                ],
                                // If you have separate first_name and last_name fields
                                // $arrayElemAt: [
                                //     { $split: ["$last_name", " "] },
                                //     0, // Take the whole last name as it might be one word
                                // ],
                            },
                            "",
                        ],
                    },
                },
            },
            { $sort: { lastname: 1 } },
        ]);

        if (alumni.length === 0) {
            return res.status(404).json({ message: 'No alumni match the search criteria.' });
        }

        res.status(200).json(alumni);
    } catch (error) {
        console.error("Alumni Search Error:", error.message, error.stack);
        res.status(500).json({ message: "Server error while searching alumni.", error: error.message });
    }
};