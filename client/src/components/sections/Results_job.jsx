import { useState, useEffect } from "react";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../header";
import Footer from "../footer";
import { BookmarkIcon } from '@heroicons/react/24/solid';
import { jobList } from "../../utils/models";
import { ScrollToTop } from "../../utils/helper";

const dummyJobs = [
  {
    id: 4,
    title: "UI/UX Designer",
    date: "December 28, 2025",
    description: "Design intuitive user interfaces and craft exceptional user experiences.",
    company: "PixelWave Studio",
    location: "Makati City, Metro Manila",
    image: "src/assets/Building.png",
  },
  {
    id: 1,
    title: "Software Engineer",
    date: "April 20, 2025",
    description: "Join our dynamic tech team to build and maintain modern web applications.",
    company: "TechNova Inc.",
    location: "Los Baños, Laguna",
    image: "src/assets/Building.png",
  },
  {
    id: 5,
    title: "Administrative Assistant",
    date: "January 30, 2025",
    description: "Support daily office operations and manage administrative tasks efficiently.",
    company: "Laguna Agritech Solutions",
    location: "Bay, Laguna",
    image: "src/assets/Building.png",
  },
  {
    id: 3,
    title: "Research Assistant",
    date: "February 25, 2025",
    description: "Assist with field and lab research under the College of Agriculture and Food Science.",
    company: "University of the Philippines Los Baños",
    location: "UPLB Campus",
    image: "src/assets/Building.png",
  },
  {
    id: 2,
    title: "Marketing Coordinator",
    date: "May 22, 2025",
    description: "Help execute marketing campaigns and boost brand awareness.",
    company: "GreenGrow Corp.",
    location: "Calamba, Laguna",
    image: "src/assets/Building.png",
  },
];

export const Results_page_jobs = () => {
  const [sortBy, setSortBy] = useState("");
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [jobs, setJobs] = useState(jobList);

  const toggleBookmark = (id) => {
    if (bookmarkedIds.includes(id)) {
      setBookmarkedIds(bookmarkedIds.filter((bid) => bid !== id));
    } else {
      setBookmarkedIds([...bookmarkedIds, id]);
    }
  };

  const sortedJobs = useMemo(() => {
    if (sortBy === "date") {
      return [...jobs].sort((a, b) => new Date(a.date_posted) - new Date(b.date_posted));
    } else if (sortBy === "title") {
      return [...jobs].sort((a, b) => a.job_title.localeCompare(b.job_title));
    }
    return jobs;
  }, [sortBy, jobs]);

  useEffect(() => {
    const approvedJobs = jobList.filter((job) => job.status === "approved");
    setJobs(approvedJobs);
    ScrollToTop();
  }, []);

  return (
    <>
      <div className="w-screen pb-10">
        <Navbar />
      </div>
      
      <div className="w-full h-full bg-gray-200 p-10 flex flex-col justify-center items-center">
        <div className="container flex flex-col items-start space-y-8 text-black text-left ">
          
          {/* Sort by */}
          <div className="flex flex-row space-x-4 items-center">
            <h2>Sort by:</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-400 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select</option>
              <option value="date">Date</option>
              <option value="title">Title</option>
            </select>
          </div>
          {/* Sort by */}

          {/* Jobs Display */}
        <div className="flex justify-center w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedJobs.map((job) => (
            <div key={job.job_id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <Link to={`/job-details/${job.job_id}`}>
                <img src={job.image} alt={job.job_title} className="w-full h-48 object-cover" />
              </Link>
              <div className="p-4">
                
                {/* Moved bookmark icon here */}
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => toggleBookmark(job.job_id)}
                    className="text-white-400 hover:text-white-500 focus:outline-none"
                    title={bookmarkedIds.includes(job.job_id) ? "Remove Bookmark" : "Bookmark"}
                  >
                    {bookmarkedIds.includes(job.job_id) ? (
                      <BookmarkIcon className="w-6 h-6" />
                    ) : (
                      <BookmarkIcon className="w-6 h-6 opacity-50" />
                    )}
                  </button>
                </div>

                {/* Text content */}
                <h2 className="text-xl font-semibold mb-1">{job.job_title}</h2>
                <h3 className="text-lg text-gray-600 mb-1">{job.company}</h3>
                <p className="text-sm text-gray-500 mb-2">{job.location}</p>
                <p className="text-gray-700">{job.job_description}</p>
                <p className="text-sm text-right text-gray-500 mb-2">
                  {new Date(job.date_posted).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                  </p>
              </div>
            </div>
          ))}
        </div>
          </div>
          {/* Jobs Display */}
          {/* Jobs Section */}
          
        </div>
      </div>
      <div className="w-full z-50">
        <Footer />
      </div>
    </>
  );
};

