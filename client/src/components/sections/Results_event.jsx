import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BookmarkIcon } from '@heroicons/react/24/solid';
import { TbMoodEmpty } from "react-icons/tb";
import { TbCalendarStar } from "react-icons/tb";
import { FaLocationDot } from "react-icons/fa6";
import { useAuth } from "../../auth/AuthContext";
import default_eventbg from "../../assets/event_placeholder.png";
import axios from "axios";
import Navbar from "../header";
import Footer from "../footer";
import Loading from "../loading";
import Sidebar from "../Sidebar";

export const Results_page_events = ( ) => {
    const navigate = useNavigate();
    const {authAxios, user} = useAuth();

    const [sortBy, setSortBy] = useState("");
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const [events, setEvents] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle state
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

      const toggleBookmark = async (eventId) => {
        try {
        if (bookmarkedIds.includes(eventId)) {
            await authAxios.post('/events/unbookmark', { userId: user._id, eventId }, { withCredentials: true });
            setBookmarkedIds(bookmarkedIds.filter((id) => id !== eventId));
        } else {
            await authAxios.post('/events/bookmark', { userId: user._id, eventId }, { withCredentials: true });
            setBookmarkedIds([...bookmarkedIds, eventId]);
        }
        } catch (error) {
        console.error("Bookmark toggle failed:", error);
        }
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await authAxios.get(`/events/read-sort?sortBy=${sortBy}`);

                setEvents(response.data);
                setIsLoading(false);

            } catch (error) {
                if (error.response?.status === 401 || error.response?.status === 403) {
                    console.log("Token invalid/expired. Attempting refresh...");

                    try {
                        const refreshResponse = await axios.get(`/auth/refresh`, { withCredentials: true });

                        if (refreshResponse.data.accessToken) {
                            const newToken = refreshResponse.data.accessToken;
                            localStorage.setItem("accessToken", newToken);

                            console.log("Retrying event fetch with new token...");
                            const retryResponse = await axios.get(`/events?sortBy=${sortBy}`, {
                                headers: { Authorization: `Bearer ${newToken}` },
                                withCredentials: true
                            });

                            setEvents(retryResponse.data);
                            setIsLoading(false); 

                        } else {
                            navigate("/login");
                        }
                    } catch (refreshError) {
                        console.error("Token refresh failed:", refreshError);
                        navigate("/login");
                    }
                } else {
                    console.error("Error fetching events:", error);
                }
            }
        };

        fetchEvents();
        window.scrollTo(0, 0);
    }, [sortBy, navigate]);

      useEffect(() => {
        const fetchBookmarkedEvents = async () => {
          try {
            const res = await authAxios.get(`/events/event-bookmarked?userId=${user._id}`);
            const ids = res.data.map(event => event._id);
            setBookmarkedIds(ids);
          } catch (err) {
            console.error("Error fetching bookmarked events:", err);
          }
        };
    
        if (user?._id) fetchBookmarkedEvents();
      }, [user?._id]);

    return (
        <>
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
            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"} bg-gray-200`}>

            {isLoading ? (
                <Loading />
            ) : (
                <div className="w-full min-w-screen min-h-screen bg-gray-200 px-15 lg:px-25 pt-30 flex flex-col items-center">
                    <div className="container flex flex-col items-start space-y-8 text-black text-left ">
                        <div className="flex flex-col justify-between items-start w-full">
                            <div className="flex items-center space-x-3 pb-12">
                                <TbCalendarStar className="text-5xl lg:text-6xl text-[#145C44]" />
                                <h2 className="text-5xl lg:text-6xl text-[#145C44] font-semibold">Events</h2>
                            </div>

                            {/* Sort dropdown */}
                            <div className="flex flex-row space-x-4 items-center px-2">
                                <h2>Sort by:</h2>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="border border-gray-400 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                >
                                    <option value="">Select</option>
                                    <option value="date">Date</option>
                                    <option value="title">Title</option>
                                </select>
                            </div>

                            {/* Display events */}
                            <div className="flex justify-center w-full overflow-x-hidden mb-35 mt-7 px-2">
                                {events.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {events.map(event => (
                                            <div key={event._id} className="flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden">
                                                <Link to={`/event-details/${event._id}`}>
                                                    <img
                                                        src={
                                                        event?.files?.[0]?.serverFilename
                                                            ? `/uploads/${event.files[0].serverFilename}`
                                                            : default_eventbg
                                                        }
                                                        alt={event.event_name}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                </Link>

                                                <div className="p-4 flex flex-col h-full">
                                                    {/* Bookmark button */}
                                                    <div className="flex justify-end mb-2">
                                                        <button
                                                            onClick={() => toggleBookmark(event._id)}
                                                            title={bookmarkedIds.includes(event._id) ? "Remove Bookmark" : "Bookmark"}
                                                            className="p-2 rounded-full transition duration-300 hover:bg-emerald-100 hover:text-emerald-600 cursor-pointer"
                                                        >
                                                            <BookmarkIcon className={`w-6 h-6 ${bookmarkedIds.includes(event._id) ? "text-emerald-600" : "opacity-50"}`} /> 
                                                        </button>
                                                    </div>
                                                    <h2 className="text-xl font-semibold mb-1">{event.event_name}</h2>
                                                    <p className="text-sm text-gray-500 mb-2 flex items-center space-x-1">
                                                        <FaLocationDot className="text-gray-500" />
                                                        <span>{event.venue}</span>
                                                    </p>
                                                    <p className="text-gray-700 flex-grow mb-3 line-clamp-2">{event.event_description}</p>
                                                    <p className="text-sm text-right text-gray-500">
                                                        {new Date(event.event_date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric',
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex h-full min-h-[450px] w-full min-w-screen flex-col items-center justify-center text-center pt-45 pb-80">
                                        <TbMoodEmpty className="w-40 h-40 text-[#145C44] mb-5" />
                                        <p className="text-md text-[#145C44] font-regular">No events available at the moment.</p>
                                        <p className="text-sm text-[#145C44]">Please check back later.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    
                </div>
            )}
            </div>
            {sidebarOpen ?(
            <div className="ml-64 w-full z-10">
                <Footer />
            </div>
            
            ):(
            <div className="w-full z-50">
                <Footer />
            </div>
            )}
            
        </>
    );
};