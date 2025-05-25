import Navbar_admin from "../header_admin";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import Request_Confirmation from "../request_confirmation";
import { useAuth } from "../../auth/AuthContext.jsx";
import Sidebar from "../Sidebar.jsx";
import { TrashIcon,CheckIcon,XMarkIcon} from '@heroicons/react/24/solid';

export const Admin_main = () => {
    const navigate = useNavigate()
    const { authAxios, user} = useAuth();

    const request = []
    const event=[]
    const job=[]
    const [activeTab, setActiveTab] = useState("Events");
    const [search, setSearch] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const categories = ["Events", "Jobs", "Job Requests"];
    const fetchData = async () => {
        
      try {
        console.log("Fetching data...");
  
        const eventResponse = await authAxios.get(`events/admin-page-events`);
        const jobResponse = await authAxios.get(`jobs/admin-page-jobs`);
        const requestResponse = await authAxios.get(`jobs/admin-page-job-requests`);
  
        const formattedEvents = eventResponse.data.map(event => ({
          id: event._id,
          name: event.event_name,
          date: new Date(event.event_date).toISOString().split('T')[0],
          createdBy: event.created_by || "N/A"
        }));
  
        const formattedJobs = jobResponse.data.map(job => ({
          id:job._id,
          name: job.job_title,
          company: job.company
        }));
  
        const formattedJobRequests = requestResponse.data.map(req => ({
          id: req._id,
          name: req.job_title,
          from: req.posted_by?.email || "Unknown"
        }));
  
        setEvents(formattedEvents);
        setJobs(formattedJobs);
        setRequests(formattedJobRequests);
      } catch (err) {
        console.error("Failed to fetch data: ", err);
      }
    };

    const [requests, setRequests] = useState(request);
    const [events,setEvents]= useState(event);
    const [jobs,setJobs]= useState(job);
    const [req_modalOpen, setreq_modalOpen] =useState(false); 
    const [message_modal, setmessage_modal] =useState(0);
    const [request_id, setrequestID]= useState(0);

    useEffect(() => {
        fetchData();
    }, []);
    const getCategoryData = () => {
      if (activeTab === "Events") {
        return events.filter(item => 
            (item.name.toLowerCase().includes(search.toLowerCase())|| false) ||
            (item.id?.toLowerCase().includes(search.toLowerCase()) || false)
        );
        
      }
      if (activeTab === "Jobs") {
        return jobs.filter(item => 
            (item.id?.toLowerCase().includes(search.toLowerCase()) || false) ||
            (item.name?.toLowerCase().includes(search.toLowerCase()) || false) ||
            (item.company?.toLowerCase().includes(search.toLowerCase()) || false)
          );
      }
      if (activeTab === "Job Requests") {
        return requests.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
      }
      return [];
    };
    const handleDeleteEvent =({id})=>{
      setreq_modalOpen(true)
    }
    const handleRejectReq =({id})=>{
      setreq_modalOpen(true)
    }
    const handleAcceptReq =({id})=>{
      setreq_modalOpen(true)
    }
    const filteredData = getCategoryData();
    return(
        
        <>
        <div className="w-screen">
            <Navbar_admin toggleSidebar={toggleSidebar}>
                
            </Navbar_admin>
        </div>
        
        <div
          className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>
            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
          <div className="p-6 bg-white min-h-screen">
            <div className="text-2xl  font-semibold mb-4">List of {activeTab}</div>
  
            {/* Tabs */}
            <div className="flex space-x-6 border-b mb-4" >
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`transition-all rounded-t-lg p-2 px-5  font-extrabold text-xl focus:outline-none focus:ring-0 ${
                    activeTab === cat
                      ? " text-white bg-emerald-800 font-medium"
                      : "text-emerald-800 "
                  }`}
                >
                  {cat}
                </button>
              ))}
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
                        <th className="px-4 py-3">Created By</th>
                        <th className="px-4 py-3 ">Action</th>
                      </>
                    )}
                    {activeTab === "Jobs" && (
                      <>
                        <th className="px-4 py-3">ID</th>
                        <th className="px-4 py-3">Job Title</th>
                        <th className="px-4 py-3">Company</th>
                        <th className="px-4 py-3 ">Action</th>
                      </>
                    )}
                    {activeTab === "Job Requests" && (
                      <>
                        <th className="px-4 py-3">Job Title</th>
                        <th className="px-4 py-3">Requested By</th>
                        <th className="px-4 py-3">Action</th>
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
                            <td className="px-4 py-4">{item.createdBy}</td>
                            <td className="px-4 py-4 pl-6">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteEvent(item.id);}}
                                className="bg-[#891839] hover:bg-red-600 text-white p-2 rounded-lg transition duration-200 flex items-center justify-center"
                                aria-label="Delete"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </td>
                          </>
                      )}
                      {activeTab === "Jobs" && (
                        <>
                          <td className="px-4 py-4 font-medium text-gray-900">{item.id}</td>
                          <td className="px-4 py-4 font-medium text-gray-900">{item.name}</td>
                          <td className="px-4 py-4">{item.company}</td>
                          <td className="px-4 py-4 pl-6">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteEvent(item.id);}}
                                className="bg-[#891839] hover:bg-red-600 text-white p-2 rounded-lg transition duration-200 flex items-center justify-center"
                                aria-label="Delete"
                              >
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </td>
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
                                handleAcceptReq(item.id);}}

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
                                handleRejectReq(item.id);}}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition duration-200"
                              aria-label="Reject"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </td>
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
                    <div>
                        <Request_Confirmation request_response={message_modal} setVisible={setreq_modalOpen} id={request_id} refetch={fetchData}></Request_Confirmation>
                    </div>
            )}
        
        </>
    );
};
