import { Alumni, AlumniCollection } from '../../models/User.js';
import { createCRUDController } from '../middlewareControllers/createCRUDController/index.js';

export const alumniController = {
    ...createCRUDController(Alumni),

    async deleteByEmail(req, res) {
        try {
            const { email } = req.params;
            const deleted = await Alumni.findOneAndDelete({ email });
        
            if (!deleted) return res.status(404).json({ message: 'User not found' });
        
            res.status(200).json({ message: 'User deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
      }
}

// Controller function to search for alumni based on query parameters
export const alumniSearch = async (req, res) => {
    try {
      const {
        name = '',
        degree = '',
        startYear,
        endYear,
        current_job_title = '',
        company = '',
        skills = ''
      } = req.query;
  
      // Initialize the match stage with profile visibility
      const matchStage = {
        profile_visibility: true,
      };
  
      // Add filters only if they are non-empty
      if (name) matchStage.name = { $regex: name, $options: 'i' }; // Case-insensitive name search
      if (degree) matchStage.degree = { $regex: degree, $options: 'i' }; // Case-insensitive degree search
      if (current_job_title) matchStage.current_job_title = { $regex: current_job_title, $options: 'i' }; // Job title match
      if (company) matchStage.company = { $regex: company, $options: 'i' }; // Company name match
  
      // Handle skills: Use $in to match any skill in the array
      if (skills) {
        const skillsArray = skills.split(',').map(skill => skill.trim()); // Convert skills string to array
        matchStage.skills = { $in: skillsArray }; // Match any skill in the array
      }
  
      // Handle graduation year range
      if (startYear && endYear) {
        matchStage.graduation_year = { $gte: parseInt(startYear), $lte: parseInt(endYear) };
      }
  
      console.log("Match Stage:", matchStage); // Debug match stage
  
      // Perform the aggregation query
      const alumni = await Alumni.aggregate([
        { $match: matchStage },
        {
          $addFields: {
            lastname: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    { $split: ["$name", " "] },
                    -1,
                  ],
                },
                "",
              ],
            },
          },
        },
        { $sort: { lastname: 1 } },
      ]);
  
      console.log("Aggregation Results:", alumni); // Debug aggregation results
  
      if (alumni.length === 0) {
        return res.status(404).json({ message: 'No alumni match the search criteria.' });
      }
  
      res.status(200).json(alumni);
    } catch (error) {
      console.error("Alumni Search Error:", error.message, error.stack);
      res.status(500).json({ message: "Server error while searching alumni.", error: error.message });
    }
  };