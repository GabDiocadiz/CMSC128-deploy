import { JobPosting } from "../../models/Job_Posting.js";
import { User } from "../../models/User.js";
import Communication from "../../models/Communication.js";
import Notification from "../../models/Notification.js";
import { createCRUDController } from "../middlewareControllers/createCRUDController/index.js";
import {
    uploadFilesForModel,
    getFilesForModel,
    deleteFileFromModel,
    downloadFile
  } from "../fileController/fileController.js";
export const jobPostingController = {
    ...createCRUDController(JobPosting),
    
    async create(req, res) {
        try {
            const jobDataFromRequest = { ...req.body };

            if (jobDataFromRequest.requirements && typeof jobDataFromRequest.requirements === 'string') {
                jobDataFromRequest.requirements = [jobDataFromRequest.requirements];
            } else if (jobDataFromRequest.requirements && !Array.isArray(jobDataFromRequest.requirements)) {
                jobDataFromRequest.requirements = Object.values(jobDataFromRequest.requirements);
            }

            const jobDocument = {
                posted_by: jobDataFromRequest.posted_by,
                job_title: jobDataFromRequest.job_title,
                company: jobDataFromRequest.company,
                location: jobDataFromRequest.location,
                job_description: jobDataFromRequest.job_description,
                requirements: jobDataFromRequest.requirements || [],
                application_link: jobDataFromRequest.application_link,
                start_date: jobDataFromRequest.start_date,
                end_date: jobDataFromRequest.end_date,
                status: jobDataFromRequest.status || 'pending',
                files: [],
            };

            if (jobDataFromRequest.status === 'approved') {
                jobDocument.approved_by = jobDataFromRequest.approved_by;
                jobDocument.approval_date = jobDataFromRequest.approval_date || new Date();
            }

            const filesForDb = [];
            if (req.files && req.files.length > 0) {
                req.files.forEach(file => {
                const fileMetadataObject = {
                    name: file.originalname,
                    serverFilename: file.filename, 
                    type: file.mimetype,
                    size: file.size,
                };
                filesForDb.push(fileMetadataObject);
                });
            }
            jobDocument.files = filesForDb;

            const newJobPosting = new JobPosting(jobDocument);
            const savedJobPosting = await newJobPosting.save();

            if (savedJobPosting.status === 'approved') {
                try {
                    const communicationContent = `A new job opportunity has been posted: "${savedJobPosting.job_title}" at ${savedJobPosting.company}. Apply now! ${savedJobPosting.application_link}`;
                    const newCommunication = new Communication({
                        type: "job_posting",
                        title: `New Job: ${savedJobPosting.job_title} at ${savedJobPosting.company}`,
                        content: communicationContent,
                        posted_by: savedJobPosting.approved_by || savedJobPosting.posted_by,
                    });
                    const savedCommunication = await newCommunication.save();

                    const alumniUsers = await User.find({ user_type: "Alumni" }).select('_id');
                    if (alumniUsers.length > 0) {
                        const notifications = alumniUsers.map(alumnus => ({
                            user: alumnus._id,
                            announcement: savedCommunication._id,
                            status: "unread",
                        }));
                        await Notification.insertMany(notifications);
                        console.log(`Notifications created for ${alumniUsers.length} alumni for job: ${savedJobPosting.job_title}`);
                    }
                } catch (notificationError) {
                    console.error("Error creating notifications for approved job posting:", notificationError);
                }
            }

            res.status(201).json(savedJobPosting);

        } catch (error) {
            console.error("Error in createJobPostingWithFiles:", error);

            if (req.files && req.files.length > 0) {
                console.log("Attempting to clean up uploaded files due to an error...");
                for (const file of req.files) {
                    try {
                        await fs.unlink(file.path);
                        console.log(`Deleted orphaned file: ${file.path}`);
                    } catch (cleanupError) {
                        console.error(`Failed to delete orphaned file ${file.path}:`, cleanupError);
                    }
                }
            }

            if (error.name === 'ValidationError') {
                return res.status(400).json({ message: "Validation Error", errors: error.errors });
            }
            res.status(500).json({ message: "Server error while creating job posting" });
        }
    },

    async adminPageJobs(req, res) {
        try {
            const items = await JobPosting.find({status: 'approved'})
                .select('job_title company');
            res.status(200).json(items);
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    },

    async adminPageJobRequests(req, res) {
        try {
            const items = await JobPosting.find({status: 'pending'})
                .select('_id job_title posted_by')
                .populate('posted_by');
            console.log(items);
            res.status(200).json(items);
        } catch (err) {
            res.status(400).json({ error: err.message})
        }
    },

    async jobResults (req, res) {
        try {
            const { sortBy } = req.query;
            let jobs;
    
            if (sortBy === "date") {
                jobs = await JobPosting.find({ status: 'approved' }).sort({ date_posted: 1 }); // Oldest first
            } else if (sortBy === "title") {
                jobs = await JobPosting.find({ status: 'approved' }).sort({ job_title: 1 }); // A → Z
            } else {
                jobs = await JobPosting.find({ status: 'approved' }); // Default: no sorting
            }
    
            console.log("Fetched Jobs:", jobs.length);
            res.status(200).json(jobs);
        } catch (e) {
            console.error("Error in jobPostingController.jobResults:", e);
            res.status(500).json({ message: e.message });
        }
    },

    async approveJob(req, res){
        try {
            const {userId, jobId} = req.body;
            const user = await User.findById(userId);
            if (user.user_type != "Admin") return res.status(401).json({ message: "Unauthorized" });

            const job = await JobPosting.findById(jobId);
            if(!job) return res.status(404).json({ message: "Job not found" });
            
            if(job.status == "approved") return res.status(400).json({ message: "Job already approved" }); 
            else if(job.status == "rejected") return res.status(400).json({ message: "Job already rejected" }); 
            job.approval_date = new Date();
            job.status = "approved";
            await job.save();

            try {
                if (!updatedJobPosting.approved_by) {
                    updatedJobPosting.approved_by = req.user?.id;
                    updatedJobPosting.approval_date = new Date();
                    await updatedJobPosting.save();
                }

                const communicationContent = `A new job opportunity has been posted: "${updatedJobPosting.job_title}" at ${updatedJobPosting.company}. Apply now! ${updatedJobPosting.application_link}`;
                const newCommunication = new Communication({
                    type: "job_posting",
                    title: `Job Approved: ${updatedJobPosting.job_title} at ${updatedJobPosting.company}`,
                    content: communicationContent,
                    posted_by: updatedJobPosting.approved_by || updatedJobPosting.posted_by,
                });
                const savedCommunication = await newCommunication.save();

                const alumniUsers = await User.find({ user_type: "Alumni" }).select('_id');
                if (alumniUsers.length > 0) {
                    const notifications = alumniUsers.map(alumnus => ({
                        user: alumnus._id,
                        announcement: savedCommunication._id,
                        status: "unread",
                    }));
                    await Notification.insertMany(notifications);
                    console.log(`Notifications created for ${alumniUsers.length} alumni for newly approved job: ${updatedJobPosting.job_title}`);
                }
            } catch (notificationError) {
                console.error("Error creating notifications for approved job posting (on update):", notificationError);
            }

            res.status(200).json({message: "Job approved successfully"});
        }
        catch(e){
            console.error("Error approving job:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    async disapproveJob(req, res){
        try {
            const {userId, jobId} = req.body;
            const user = await User.findById(userId);
            if (user.user_type != "Admin") return res.status(401).json({ message: "Unauthorized" });

            const job = await JobPosting.   findById(jobId);
            if(!job) return res.status(404).json({ message: "Job not found" });
            
            if(job.status == "rejected") return res.status(400).json({ message: "Job already rejected" }); 
            if(job.status == "approved") return res.status(400).json({ message: "Job already approved" }); 
            
            job.status = "rejected";
            await job.save();

            res.status(200).json({message: "Job rejected successfully"});
        }
        catch(e){
            console.error("Error rejecting job:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

     //  Add Bookmark
    async bookmarkJob(req, res) {
        try {
            const { userId, jobId } = req.body;

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            if (user.bookmarked_jobs.includes(jobId)) {
                return res.status(400).json({ message: "Job already bookmarked" });
            }

            user.bookmarked_jobs.push(jobId);
            await user.save();

            res.status(200).json({ message: "Job bookmarked successfully" });
        } catch (error) {
            console.error("Error bookmarking job:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    //  Unbookmark
    async unbookmarkJob(req, res) {
        try {
            const { userId, jobId } = req.body;

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            user.bookmarked_jobs = user.bookmarked_jobs.filter(id => id.toString() !== jobId);
            await user.save();

            res.status(200).json({ message: "Job unbookmarked successfully" });
        } catch (error) {
            console.error("Error unbookmarking job:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    //  Get all bookmarked jobs for a user
    async getbookmarked_jobs(req, res) {
        try {
            const { userId } = req.query;

            const user = await User.findById(userId).populate('bookmarked_jobs');
            if (!user) return res.status(404).json({ message: "User not found" });

            res.status(200).json(user.bookmarked_jobs);
        } catch (error) {
            console.error("Error fetching bookmarked jobs:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    },

    async uploadJobFiles (req, res){
        req.params.modelName = "JobPosting";
        req.params.id = req.params._id;
        return uploadFilesForModel(req, res);
    },
      
    
    async getJobFiles(req, res) {
        req.params.modelName = "JobPosting";
        return getFilesForModel(req, res);
    },

    async findJobById(req, res) {
        try {
            const { id } = req.params;
            const job = await JobPosting.findById(id);
            if (!job) {
                return res.status(404).json({ message: "Job not found" });
            }
            res.status(200).json(job);
        } catch (e) {
            console.error("Error in jobController.findJobById:", e);
            res.status(500).json({ message: e.message });
        }
    },

    async getJobsPostedBy(req, res) {
        try {
            const { _id } = req.params; // Assuming the user ID will come from the URL parameter
            // Alternatively, if from query: const { userId } = req.query;
            console.log(_id);
            if (!_id) {
                return res.status(400).json({ message: "User ID is required." });
            }

            // Find all job postings where 'posted_by' matches the userId
            // You might want to populate 'posted_by' or other fields if needed for the frontend
            const jobs = await JobPosting.find({ posted_by: _id })
                                         .sort({ date_posted: -1 }); // Sort by newest first, for example

            if (jobs.length === 0) {
                return res.status(404).json({ message: "No job postings found for this user." });
            }

            res.status(200).json(jobs);
        } catch (error) {
            console.error("Error fetching jobs by posted_by user:", error);
            // Handle CastError if the userId is an invalid ObjectId format
            if (error.name === 'CastError' && error.kind === 'ObjectId') {
                return res.status(400).json({ message: "Invalid User ID format." });
            }
            res.status(500).json({ message: "Internal server error while fetching jobs by user." });
        }
    },
}