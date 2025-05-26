import Navbar_admin from "../header_admin";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Request_Confirmation from "../request_confirmation";
import { useAuth } from "../../auth/AuthContext.jsx";
import Sidebar from "../Sidebar.jsx";
import { TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';
import {
  LineChart, BarChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts';

export const Admin_main = () => {
  const navigate = useNavigate();
  const { authAxios } = useAuth();

  const [activeTab, setActiveTab] = useState("Events");
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const categories = ["Events", "Jobs", "Users", "Job Requests"];

  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  // Stats for charts
  const [eventStats, setEventStats] = useState([]);
  const [jobStats, setJobStats] = useState([]);
  const [requestStats, setRequestStats] = useState([]);
  const [userStats, setUserStats] = useState([]);

  const [req_modalOpen, setreq_modalOpen] = useState(false);
  const [message_modal, setmessage_modal] = useState(0);
  const [request_id, setrequestID] = useState(0);
  const [loading, setLoading] = useState(true); // ✅ N
  const fetchData = async () => {
    setLoading(true);
    try {
      const eventResponse = await authAxios.get(`events/admin-page-events`);
      const jobResponse = await authAxios.get(`jobs/admin-page-jobs`);
      const requestResponse = await authAxios.get(`jobs/admin-page-job-requests`);
      const userResponse = await authAxios.get("/alumni/search");
      console.log(userResponse.data);
      const formattedEvents = eventResponse.data.map(event => ({
        id: event._id,
        name: event.event_name,
        date: new Date(event.event_date).toISOString().split('T')[0],

      }));

      const formattedJobs = jobResponse.data.map(job => ({
        id: job._id,
        name: job.job_title,
        company: job.company
      }));

      const formattedJobRequests = requestResponse.data.map(req => ({
        id: req._id,
        name: req.job_title,
        from: req.posted_by?.email || "Unknown"
      }));

      const formattedUsers = userResponse.data.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,

        skills: user.skills,
        jobCount: user.jobCount,
        totalDonationAmount: user.totalDonationAmount,
      }));

      setEvents(formattedEvents);
      setJobs(formattedJobs);
      setRequests(formattedJobRequests);
      setUsers(formattedUsers);

      // Set analytics
      setEventStats(groupByDate(formattedEvents, 'date'));
      setJobStats(groupByKey(formattedJobs, 'company'));
      setRequestStats(groupByKey(formattedJobRequests, 'from'));
      setUserStats(groupBySkills(formattedUsers));
    } catch (err) {
      console.error("Failed to fetch data: ", err);
    } finally {
      setLoading(true)
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const groupByDate = (items, key) => {
    const map = {};
    items.forEach(i => {
      const val = i[key];
      map[val] = (map[val] || 0) + 1;
    });
    return Object.entries(map).map(([date, count]) => ({ date, count }));
  };

  const groupByKey = (items, key) => {
    const map = {};
    items.forEach(i => {
      const val = i[key] || "Unknown";
      map[val] = (map[val] || 0) + 1;
    });
    return Object.entries(map).map(([name, count]) => ({ name, count }));
  };
  const groupBySkills = (users) => {
    const map = {};

    users.forEach(user => {
      if (Array.isArray(user.skills)) {
        user.skills.forEach(skill => {
          map[skill] = (map[skill] || 0) + 1;
        });
      }
    });
    return Object.entries(map).map(([skill, count]) => ({ skill, count }));
  };
  const groupByEmailDomain = (users) => {
    const map = {};
    users.forEach(u => {
      const domain = u.email.split('@')[1] || "Unknown";
      map[domain] = (map[domain] || 0) + 1;
    });
    return Object.entries(map).map(([domain, count]) => ({ domain, count }));
  };

  const getCategoryData = () => {
    if (activeTab === "Events") return events.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.id?.toLowerCase().includes(search.toLowerCase())
    );
    if (activeTab === "Jobs") return jobs.filter(item =>
      item.id?.toLowerCase().includes(search.toLowerCase()) ||
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.company?.toLowerCase().includes(search.toLowerCase())
    );
    if (activeTab === "Job Requests") return requests.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    if (activeTab === "Users") return users.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase())


    );
    return [];
  };
  const CustomTooltip_user = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const { skill, count } = payload[0].payload; // get extra info from the data point
      return (
        <div className="bg-white border border-gray-300 shadow-md p-2 rounded text-sm">
          <p className="font-semibold text-gray-800">Skill: {skill}</p>
          <p className="text-gray-600">Users with this skill: {count}</p>
        </div>
      );
    }

    return null;
  };
  const CustomTooltip_job = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const { company, count } = payload[0].payload; // get extra info from the data point
      return (
        <div className="bg-white border border-gray-300 shadow-md p-2 rounded text-sm">
          <p className="font-semibold text-gray-800">Company: {label}</p>
          <p className="text-gray-600">Number of Posting: {count}</p>
        </div>
      );
    }
    return null;
  };
  const CustomTooltip_event = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      const { date, count } = payload[0].payload; // get extra info from the data point
      return (
        <div className="bg-white border border-gray-300 shadow-md p-2 rounded text-sm">
          <p className="font-semibold text-gray-800">Date: {date}</p>
          <p className="text-gray-600">Number of Event: {count}</p>
        </div>
      );
    }
    return null;
  };
  const handleDeleteEvent = ({ id }) => setreq_modalOpen(true);
  const handleRejectReq = ({ id }) => setreq_modalOpen(true);
  const handleAcceptReq = ({ id }) => setreq_modalOpen(true);

  const filteredData = getCategoryData();

  const renderChart = () => {
    switch (activeTab) {
      case "Events":
        return (
          <>
            <h2 className="text-2xl font-semibold text-emerald-800 mb-4">Event Activity Graph</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={eventStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip_event />} />
                <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </>
        );
      case "Jobs":
        return (
          <>
            <h2 className="text-2xl font-semibold text-emerald-800 mb-4">Job Posts By Company</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={jobStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip_job />} />
                <Bar dataKey="count" fill="#0284c7" />
              </BarChart>
            </ResponsiveContainer>
          </>
        );
      case "Job Requests":
        return (
          <></>
        );
      case "Users":
        const sortedUserStats = [...userStats].sort((a, b) => b.count - a.count);
        return (
          <>
            <h2 className="text-2xl font-semibold text-emerald-800 mb-4">Alumni Skill Diversity Chart</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sortedUserStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" />
                <YAxis allowDecimals={false} />
                <Tooltip content={<CustomTooltip_user />} />
                <Bar dataKey="count" fill="#891839" />
              </BarChart>
            </ResponsiveContainer>
          </>

        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="w-screen">
        <Navbar_admin toggleSidebar={toggleSidebar} />
      </div>
      <div className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar />
      </div>
      <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        <div className="p-6 bg-white min-h-screen pt-8">
          <div className="text-2xl font-semibold mb-4">List of {activeTab}</div>

          {/* Tabs */}
          <div className="flex space-x-6 border-b mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`transition-all rounded-t-lg p-2 px-5 font-extrabold text-xl focus:outline-none focus:ring-0 ${activeTab === cat ? "text-white bg-emerald-800" : "text-emerald-800"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Analytics Chart */}
          <div className="mb-6">
            {renderChart()}
          </div>

          {/* Search */}
          <div className="flex items-center justify-between mb-4 bg-gray-100 p-3 rounded-lg">
            <input
              type="text"
              placeholder={`Search in ${activeTab}`}
              className="px-4 py-2 rounded-lg border border-gray-300 w-full sm:w-1/3"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-sm uppercase bg-emerald-800 rounded-t-lg text-white">
                <tr>
                  {activeTab === "Events" && (
                    <>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Event Name</th>
                      <th className="px-4 py-3">Event Date</th>

                    </>
                  )}
                  {activeTab === "Jobs" && (
                    <>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Job Title</th>
                      <th className="px-4 py-3">Company</th>

                    </>
                  )}
                  {activeTab === "Job Requests" && (
                    <>
                      <th className="px-4 py-3">Job Title</th>
                      <th className="px-4 py-3">Requested By</th>
                      <th className="px-4 py-3">Actions</th>
                    </>
                  )}
                  {activeTab === "Users" && (
                    <>
                      <th className="px-4 py-3">ID</th>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Total Donations</th>
                      <th className="px-4 py-3">Number of Jobs Posted</th>

                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={idx} className="bg-white hover:bg-gray-200 transition-colors duration-200 "
                    onClick={() => {
                      if (activeTab === "Events") {
                        navigate(`/event-details/${item.id}`);
                      } else if (activeTab === "Jobs") {
                        navigate(`/job-details/${item.id}`);
                      } else if (activeTab === "Job Requests") {
                        navigate(`/job-details/${item.id}`);
                      }
                    }}

                  >
                    {activeTab === "Events" && (
                      <>
                        <td className="px-4 py-4 font-medium text-gray-900">{item.id}</td>
                        <td className="px-4 py-4 font-medium text-gray-900">{item.name}</td>
                        <td className="px-4 py-4">{item.date}</td>
       

                      </>
                    )}
                    {activeTab === "Jobs" && (
                      <>
                        <td className="px-4 py-4 font-medium text-gray-900">{item.id}</td>
                        <td className="px-4 py-4 font-medium text-gray-900">{item.name}</td>
                        <td className="px-4 py-4">{item.company}</td>

                      </>
                    )}
                    {activeTab === "Job Requests" && (
                      <>
                        <td className="px-4 py-4 font-medium text-gray-900">{item.name}</td>
                        <td className="px-4 py-4">{item.from}</td>
                        <td className="px-4 py-4 flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setrequestID(item.id);
                              setmessage_modal(1);
                              handleAcceptReq(item.id);
                            }}

                            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition duration-200"
                            aria-label="Approve"
                          >
                            <CheckIcon className="h-5 w-5" />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setrequestID(item.id);
                              setmessage_modal(0);
                              handleRejectReq(item.id);
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition duration-200"
                            aria-label="Reject"
                          >
                            <XMarkIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </>
                    )}
                    {activeTab === "Users" && (
                      <>
                        <td className="px-4 py-4 font-medium text-gray-900">{item.id}</td>
                        <td className="px-4 py-4">{item.name}</td>
                        <td className="px-4 py-4">{item.email}</td>
                        <td className="px-4 py-4 font-bold"> ₱ {item.totalDonationAmount}</td>
                        <td className="px-4 py-4 font-bold">{item.jobCount}</td>


                      </>
                    )}

                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-gray-500">
                      No data found in {activeTab}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {req_modalOpen && (
        <Request_Confirmation
          request_response={message_modal}
          setVisible={setreq_modalOpen}
          id={request_id}
          refetch={fetchData}
        />
      )}
    </>
  );
};
