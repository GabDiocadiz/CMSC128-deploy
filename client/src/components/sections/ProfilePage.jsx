import { useState, useEffect } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Navbar from '../header';
import Footer from '../footer';
import { ScrollToTop } from '../../utils/helper';
import { motion } from 'framer-motion';
import { useAuth } from '../../auth/AuthContext';
import './ProfilePage.css';
import Sidebar from '../Sidebar';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { authAxios, user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [jobApplications, setJobApplications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({});
  const [activeTab, setActiveTab] = useState('pending');
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [isHoveringTile, setIsHoveringTile] = useState(false);
  const [isHoveringPopup, setIsHoveringPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle state
  const [bookmarkedJobs, setBookmarkedJobs] = useState([]);
  const [bookmarkedEvents, setBookmarkedEvents] = useState([]);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    ScrollToTop();
    fetchProfileData();
  }, [authAxios, user?._id]);

  const fetchProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAxios.get(`/alumni/find-alumni/${user?._id}`);

      setProfileData(response.data);
      setUpcomingEvents(response.data.events_attended);
      setJobApplications(response.data.job_postings);

      if (response.data.bookmarked_jobs.length > 0) {
        const jobDetails = await Promise.all(
          response.data.bookmarked_jobs.map(async (jobRef) => {
            const jobId = jobRef?.$oid || jobRef?._id || jobRef;
            const jobRes = await authAxios.get(`/jobs/find-job/${jobId}`);
            return jobRes.data;
          })
        );
        setBookmarkedJobs(jobDetails);
      } else {
        setBookmarkedJobs([]);
      }

      if (response.data.bookmarked_events.length > 0) {
        const eventDetails = await Promise.all(
          response.data.bookmarked_events.map(async (eventRef) => {
            const eventId = eventRef?.$oid || eventRef?._id || eventRef;
            const eventRes = await authAxios.get(`/events/find-event/${eventId}`);
            return eventRes.data;
          })
        );
        setBookmarkedEvents(eventDetails);
      } else {
        setBookmarkedEvents([]);
      }

      setEditableData({
        contact_number: response.data?.contact_number || '',
        address: response.data?.address || '',
        current_job_title: response.data?.current_job_title || '',
        company: response.data?.company || '',
        industry: response.data?.industry || '',
        skills: response.data?.skills || '',
      });
    } catch (err) {
      console.error('Error fetching profile data:', err);
      setError('Failed to load profile information.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => setIsEditing(!isEditing);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "contact_number") {
      // allow only numbers or an empty string
      if (value === "" || /^[0-9]+$/.test(value)) {
        setEditableData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setEditableData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (editableData.contact_number && !/^[0-9]+$/.test(editableData.contact_number)) {
        alert("Invalid phone number.");
        return;
    }

    try {
      await authAxios.put(`/alumni/edit-profile/${user?._id}`, editableData);
      setIsEditing(false);
      fetchProfileData(); 
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const filteredJobs = jobApplications.filter(job => job.status?.toLowerCase() === activeTab);

  return (
    <div className="fixed inset-0 overflow-y-auto bg-[#891839]">
      <div className="fixed top-0 w-full z-50">
        <Navbar toggleSidebar={toggleSidebar} />
      </div>
      <div
          className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      >
          <Sidebar/>
      </div>
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>

      <motion.main
        className="pt-24 px-4 md:px-6 lg:px-8 w-full max-w-5xl mx-auto space-y-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <section className="bg-white rounded-3xl shadow-lg p-8 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6">
            <img 
              src={profileData?.profile_picture} 
              alt="Profile" 
              className="w-28 h-28 rounded-full object-cover border-4 border-[#891839]" 
            />
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold text-[#891839]">{profileData?.name}</h2>
              <p className="text-gray-600">{profileData?.email}</p>
              <p className="text-gray-600">Batch Graduated: {profileData?.graduation_year}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            <ProfileSection title="Contact Info" fields={[
              { label: "Phone", name: "contact_number" },
              { label: "Address", name: "address" }
            ]} editableData={editableData} isEditing={isEditing} handleChange={handleChange} />

            <ProfileSection title="Professional Info" fields={[
              { label: "Current Job Title", name: "current_job_title" },
              { label: "Company", name: "company" },
              { label: "Industry", name: "industry" }
            ]} editableData={editableData} isEditing={isEditing} handleChange={handleChange} />

            <ProfileSection title="Skills" fields={[
              { label: "Skills", name: "skills" }
            ]} editableData={editableData} isEditing={isEditing} handleChange={handleChange} />
          </div>

          <div className="mt-6 flex justify-center">
            {isEditing ? (
              <button className="save-button" onClick={handleSave}>Save</button>
            ) : (
              <button className="force-button" onClick={handleEditToggle}>Edit Profile</button>
            )}
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-lg p-8 relative">
          <h3 className="text-3xl font-bold text-[#891839] mb-6">Upcoming Events</h3>
          <div className="custom-calendar-wrapper">
            <Calendar
              tileContent={({ date }) => {
                const eventsToday = upcomingEvents.filter(e => new Date(e.event_date).toDateString() === date.toDateString());
                return (
                  <div
                    className={`relative w-full h-full flex flex-col items-center justify-center rounded-md ${
                      eventsToday.length > 0 ? 'bg-[#0E4221] text-white' : ''
                    }`}
                    onMouseEnter={(e) => {
                      if (eventsToday.length > 0) {
                        setHoveredEvent(eventsToday);
                        setHoverPosition({ x: e.clientX, y: e.clientY });
                        setIsHoveringTile(true);
                      }
                    }}
                    onMouseLeave={() => setIsHoveringTile(false)}
                  >
                    {eventsToday.length > 0 && (
                      <div className="flex justify-center items-center gap-1 mt-1">
                        {eventsToday.map((_, idx) => (
                          <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white"></div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }}
              className="custom-calendar"
            />

            {(hoveredEvent && (isHoveringTile || isHoveringPopup)) && (
              <div
                className="popup-events"
                onMouseEnter={() => setIsHoveringPopup(true)}
                onMouseLeave={() => {
                  setIsHoveringPopup(false);
                  setHoveredEvent(null);
                }}
                style={{
                  position: 'fixed',
                  top: hoverPosition.y + 10,
                  left: hoverPosition.x + 10,
                  background: 'white',
                  padding: '8px',
                  borderRadius: '8px',
                  boxShadow: '0px 2px 10px rgba(0,0,0,0.15)',
                  zIndex: 1000,
                }}
              >
                {hoveredEvent.map((event) => (
                  <div
                    key={event.event_id}
                    className="popup-event-item cursor-pointer"
                    onClick={() => {
                      navigate(`/events/${event.event_id}`);
                      setHoveredEvent(null);
                    }}
                  >
                    {event.event_name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

      <section className="bg-white rounded-3xl shadow-lg p-8">
        <h3 className="text-3xl font-bold text-[#891839] mb-6 text-center">Bookmarked Jobs</h3>
        {bookmarkedJobs.length === 0 ? (
          <p className="text-gray-300 text-center">No bookmarked jobs.</p>
        ) : (
          <ul className="space-y-4">
            {bookmarkedJobs.map((job, index) => (
            <Link
              key={index}
              to={`/job-details/${job._id}`}
              className="transform transition-transform duration-300 hover:scale-105 block"
            >
              <div className="bg-[#891839] p-3 rounded-3xl flex justify-center h-50 w-full shadow-lg hover:shadow-xl">
                <div className="bg-[#891839] text-white px-10 rounded-3xl border-2 border-white w-full flex flex-col items-start justify-center text-left">
                  <h3 className="text-4xl font-semibold mb-3 pb-5">{job.job_title || 'No title'}</h3>
                  <p>Company: {job.company || 'No company'}</p>
                  <p>
                    Date Posted: {job.date_posted ? new Date(job.date_posted).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) : 'Unknown date'}
                  </p>
                  <p>Location: {job.location || 'No location'}</p>
                </div>
              </div>
            </Link>
          ))}
          </ul>
        )}
      </section>

            <section className="bg-white rounded-3xl shadow-lg p-8">
        <h3 className="text-3xl font-bold text-[#891839] mb-6 text-center">Bookmarked Events</h3>
        {bookmarkedEvents.length === 0 ? (
          <p className="text-gray-300 text-center">No bookmarked events.</p>
        ) : (
          <ul className="space-y-4">
            {bookmarkedEvents.map((event, index) => (
            <Link
              key={index}
              to={`/event-details/${event._id}`}
              className="transform transition-transform duration-300 hover:scale-105 block"
            >
              <div className="bg-[#891839] p-3 rounded-3xl flex justify-center h-50 w-full shadow-lg hover:shadow-xl">
                <div className="bg-[#891839] text-white px-10 rounded-3xl border-2 border-white w-full flex flex-col items-start justify-center text-left">
                  <h3 className="text-4xl font-semibold mb-3 pb-5">{event.event_name || 'No title'}</h3>
                  <p>Venue: {event.venue || 'No company'}</p>
                  <p>
                    Date: {event.date? new Date(event.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }) : 'Unknown date'}
                  </p>
                  <p>Location: {event.location || 'No location'}</p>
                </div>
              </div>
            </Link>
          ))}
          </ul>
        )}
      </section>

        <section className="bg-white rounded-3xl shadow-lg p-8 mb-16">
          <h3 className="text-3xl font-bold text-[#891839] mb-6 text-center">Job Postings Application</h3>
          <div className="flex justify-center space-x-4 mb-6">
            {['pending', 'approved', 'rejected'].map((status) => (
              <button 
                key={status}
                className={`force-button ${activeTab === status ? 'active-tab' : ''}`}
                onClick={() => setActiveTab(status)}
              >
                {status}
              </button>
            ))}
          </div>
          {/* <JobList jobs={filteredJobs} /> */}
        </section>
      </motion.main>
      </div>
      <Footer />
    </div>
  );
}

function ProfileSection({ title, fields, editableData, isEditing, handleChange }) {
  return (
    <div>
      <h3 className="text-xl font-bold text-[#891839] mb-4 text-center">{title}</h3>
      <div className="space-y-3">
        {fields.map((field) => (
          <div key={field.name}>
            <span className="text-gray-500 font-medium uppercase tracking-wide text-xs mb-1 block">
              {field.label}
            </span>
            {isEditing ? (
              <input
                type="text"
                name={field.name}
                value={editableData[field.name] || ''}
                onChange={handleChange}
                className="border-2 rounded-xl p-2 text-gray-800 focus:border-[#891839] w-full"
              />
            ) : (
              (editableData[field.name] != null && editableData[field.name] != '') ? (
                <p className="text-gray-700 font-semibold">{editableData[field.name]}</p>
              ) : (
                <p className="text-gray-400"> No Data </p>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function JobList({ jobs }) {
  if (jobs.length === 0) return <p className="text-gray-300 text-center">No jobs found.</p>;

  return (
    <ul className="space-y-4">
      {jobs.map((job) => (
        <li key={job.job_id} className="border-2 border-[#891839] rounded-2xl p-6 hover:bg-[#891839] hover:text-white transition">
          <h4 className="font-bold text-2xl mb-1">{job.job_title}</h4>
          <p className="text-md">{job.company} - {job.location}</p>
          <p className="text-sm text-gray-400">Posted on {new Date(job.date_posted).toLocaleDateString()}</p>
        </li>
      ))}
    </ul>
  );
}
