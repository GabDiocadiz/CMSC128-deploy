import { useState } from "react";
import { Link } from "react-router-dom";
import Notification from "./notification";

import uplbLogo from "../assets/uplblogo.png";
import notifications from "../assets/notifications.png";
import humanIcon from "../assets/Human Icon.png";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"; // Search icon
import { Range } from "react-range"; // Import react-range

const GRADUATION_YEAR_MIN = 2000;
const GRADUATION_YEAR_MAX = 2030;

export default function Navbar_search({ searchTerm, setSearchTerm, user_id }) {
  const [notification_modal, setnotification_modal] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    startYear: GRADUATION_YEAR_MIN,
    endYear: GRADUATION_YEAR_MAX,
    degree: "",
    jobTitle: "",
    location: "",
    skills: "",
  });

  const handleRangeChange = (values) => {
    setFilters({ ...filters, startYear: values[0], endYear: values[1] });
  };


  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      startYear: GRADUATION_YEAR_MIN,
      endYear: GRADUATION_YEAR_MAX,
      degree: "",
      jobTitle: "",
      location: "",
      skills: "",
    });
  };

  return (
    <div>
      {notification_modal && (
        <div>
          <Notification setVisible={setnotification_modal}></Notification>
        </div>
      )}
      <nav className="bg-white w-full py-1 fixed top-0 left-0 z-20 shadow-md">
        {/* Flexbox for proper alignment */}
        <div className="container flex justify-between items-center py-1 px-4">
          {/* Left - Logo */}
          <Link to={user_id ? `/home` : `/login`}> {/* Dynamically navigate based on user_id */}
            <img src={uplbLogo} className="bg-none w-40 h-auto" alt="UPLB Logo" />
          </Link>

          {/* Middle - Search Bar */}
          <div className="flex-1 flex justify-center">
            <form onSubmit={handleSearch} className="relative w-[600px]">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter the name"
                className="w-full pr-10 pl-10 border border-gray-400 rounded-full px-3 py-1 text-left focus:outline-none focus:ring-2 focus:ring-blue-500" // Adjusted padding-left
              />
              <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              {/* Hamburger Icon */}
              <span
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer text-xl"
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              >
                ☰
              </span>
            </form>
          </div>

          {/* Right - Notification & Profile Icons */}
          <div className="absolute top-2 right-4 flex items-center space-x-4">
            {/* Notification Icon */}
            <div
              onClick={() => {
                setnotification_modal(true);
              }}
              className="cursor-pointer"
            >
              <img src={notifications} className="w-10 h-10" alt="Notifications" />
            </div>

            {/* Profile Icon inside Circle */}
            <div className="relative">
              <div
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-10 h-10 bg-none flex items-center justify-center rounded-full cursor-pointer"
              >
                <img src={humanIcon} className="w-10 h-10" alt="Profile" />
              </div>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-1 bg-white shadow-lg rounded-sm w-35 z-50 text-center text-sm border border-gray-400">
                  <Link
                    to={`/`}
                    className="block w-full px-4 py-2 text-gray-700 hover:bg-blue-100 focus:outline-none"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    View Profile
                  </Link>
                  <button
                    className="block w-full px-4 py-2 text-gray-700 hover:bg-[#891839] hover:text-white focus:outline-none"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Filter Popup */}
      {filterMenuOpen && (
        <div
          className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-white shadow-lg rounded-md p-6 z-30"
          style={{ width: "600px" }}
        >
          <h3 className="text-lg font-bold mb-4">Filter Options</h3>
          <div className="space-y-4">
            {/* Dual Thumb Slider for Graduation Year */}
            <div>
              <label className="block text-sm font-medium text-black">Graduation Year</label> {/* Label text color changed to black */}
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{filters.startYear}</span>
                  <span>{filters.endYear}</span>
                </div>
                <Range
                  step={1}
                  min={GRADUATION_YEAR_MIN}
                  max={GRADUATION_YEAR_MAX}
                  values={[filters.startYear, filters.endYear]}
                  onChange={handleRangeChange}
                  renderTrack={({ props, children }) => {
                    const { key, ...restProps } = props;
                    return (
                      <div
                        key={key}
                        {...restProps}
                        className="h-1 bg-gray-300 rounded-md" // Track remains grey
                        style={{
                          ...restProps.style,
                          width: "100%",
                        }}
                      >
                        {children}
                      </div>
                    );
                  }}
                  renderThumb={({ props }) => {
                    const { key, ...restProps } = props;
                    return (
                      <div
                        key={key}
                        {...restProps}
                        className="h-4 w-4 bg-red-900 rounded-full shadow-md" // Thumbs are red
                      />
                    );
                  }}
                />
              </div>
            </div>

            {/* Degree Filter */}
            <div>
              <label className="block text-sm font-medium text-black">Degree</label> {/* Label text color changed to black */}
              <select
                name="degree"
                value={filters.degree}
                onChange={(e) =>
                  setFilters({ ...filters, degree: e.target.value })
                }
                className="w-full border border-gray-400 rounded-md px-2 py-1"
              >
                <option value="">Select Degree</option>
                <option value="BS Computer Science">BS Computer Science</option>
                <option value="BS Information Technology">
                  BS Information Technology
                </option>
                <option value="BS Software Engineering">
                  BS Software Engineering
                </option>
              </select>
            </div>

            {/* Other Filters */}
            <div>
              <label className="block text-sm font-medium text-black">Job Title</label> {/* Label text color changed to black */}
              <input
                type="text"
                name="jobTitle"
                value={filters.jobTitle}
                onChange={(e) =>
                  setFilters({ ...filters, jobTitle: e.target.value })
                }
                placeholder="Enter Job Title"
                className="w-full border border-gray-400 rounded-md px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Location</label> {/* Label text color changed to black */}
              <input
                type="text"
                name="location"
                value={filters.location}
                onChange={(e) =>
                  setFilters({ ...filters, location: e.target.value })
                }
                placeholder="Enter Location"
                className="w-full border border-gray-400 rounded-md px-2 py-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Skills</label> {/* Label text color changed to black */}
              <input
                type="text"
                name="skills"
                value={filters.skills}
                onChange={(e) =>
                  setFilters({ ...filters, skills: e.target.value })
                }
                placeholder="Enter Skills"
                className="w-full border border-gray-400 rounded-md px-2 py-1"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
            >
              Clear Filters
            </button>
            <button
              onClick={() => setFilterMenuOpen(false)}
              className="px-4 py-2 bg-blue-500 text-green-600 rounded-md hover:bg-blue-600" // Button text color changed to green
            >
              Apply Selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}