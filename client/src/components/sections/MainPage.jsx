import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ScrollToTop } from "../../utils/helper";
import Navbar from "../header";
import Footer from "../footer";
import BookEventButton from "../buttons/BookEvent";
import SearchAlumniButton from "../buttons/SearchAlumni";
import notice1 from "../../assets/notice1.png"  // default bg for announcement
import notice2 from "../../assets/notice2.png"  // default bg for announcement
import { useParams } from 'react-router-dom';
import { useAuth } from "../../auth/AuthContext";
import Sidebar from "../Sidebar";
import event_placeholder from "../../assets/event_placeholder.png"

export default function MainPage() {
    const {authAxios, user} = useAuth();

    const [jobs, setJobs] = useState([]);
    const [events, setEvents] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // for events and announcements slideshow
    const [currentEventIndex, setCurrentEventIndex] = useState(() => {
        const saved = parseInt(sessionStorage.getItem("currentEventIndex"));
        return isNaN(saved) ? 0 : saved;
    });
    const [oddNoticeIndex, setOddNoticeIndex] = useState(() => {
        const saved = parseInt(sessionStorage.getItem("oddNoticeIndex"));
        return isNaN(saved) ? 0 : saved;
    });
    const [evenNoticeIndex, setEvenNoticeIndex] = useState(() => {
        const saved = parseInt(sessionStorage.getItem("evenNoticeIndex"));
        return isNaN(saved) ? 1 : saved;
    });
    const [Error_MessageBool, setError_MessageBool]= useState(false);

    const eventIntervalRef = useRef(null);
    const noticeIntervalRef = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false); // Sidebar toggle state
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    // fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                console.log("Fetching data...");
                
                // Fetch jobs
                const jobsResponse = await authAxios.get('/jobs/job-results');
                setJobs(jobsResponse.data);
                
                // Fetch events
                const eventsResponse = await authAxios.get('/events/all');
                console.log("Events data:", eventsResponse.data);
                
                const announcementsResponse = await authAxios.get('/announcement/read-announcements');
                console.log("Announcements data:", announcementsResponse.data);
                setAnnouncements(announcementsResponse.data);

                if (Array.isArray(eventsResponse.data) && eventsResponse.data.length > 0) {
                    setEvents(eventsResponse.data);
                    
                    // Reset currentEventIndex if it's out of bounds
                    if (currentEventIndex >= eventsResponse.data.length) {
                        setCurrentEventIndex(0);
                        sessionStorage.setItem("currentEventIndex", "0");
                    }
                } else {
                    console.log("No events data or empty array");
                    setEvents([]);
                }
                
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setIsLoading(false);
                setError_MessageBool(true);
            }
        };
        
        fetchData();
        ScrollToTop();
    }, [authAxios]);

    useEffect(() => {
        // Only start intervals if we have data
        if (events.length > 0) {
            startEventInterval();
        }
        
        if (announcements.length > 0) {
            startNoticeInterval();
        }

        // filter and display only approved jobs
        const approvedJobs = jobs.filter((job) => job.status === "approved");
        setJobs(approvedJobs);
        // ScrollToTop();

        return () => {
            clearInterval(eventIntervalRef.current);
            clearInterval(noticeIntervalRef.current);
        };
    }, [events.length, announcements.length]);

    const startEventInterval = () => {
        clearInterval(eventIntervalRef.current);
        eventIntervalRef.current = setInterval(() => {
            setCurrentEventIndex((prev) => {
                const next = (prev + 1) % events.length;
                sessionStorage.setItem("currentEventIndex", next.toString());
                return next;
            });
        }, 30000);   // 30sec interval for each event
    };

    const startNoticeInterval = () => {
        clearInterval(noticeIntervalRef.current);
        noticeIntervalRef.current = setInterval(() => {
            setOddNoticeIndex((prev) => {
                const next = (prev + 2) % announcements.length;
                sessionStorage.setItem("oddNoticeIndex", next.toString());
                return next;
            });
            setEvenNoticeIndex((prev) => {
                const next = (prev + 2) % announcements.length;
                sessionStorage.setItem("evenNoticeIndex", next.toString());
                return next;
            });
        }, 20000);   // 20sec interval per two announcements
    };

    const handlePrevEvent = () => {
        if (events.length === 0) return;
        
        setCurrentEventIndex((prev) => {
            const newIndex = (prev - 1 + events.length) % events.length;
            sessionStorage.setItem("currentEventIndex", newIndex.toString());
            return newIndex;
        });
        startEventInterval();
    };

    const handleNextEvent = () => {
        if (events.length === 0) return;
        
        setCurrentEventIndex((prev) => {
            const newIndex = (prev + 1) % events.length;
            sessionStorage.setItem("currentEventIndex", newIndex.toString());
            return newIndex;
        });
        startEventInterval();
    };
    
    // Check if current event is valid before rendering it
    const currentEvent = events.length > 0 ? events[currentEventIndex] : null;
    
    return (
        <>
            {/* For testing purposes */}
            {/* {Error_MessageBool &&(
                <Error_Message message={"Testing testing"} setVisible={setError_MessageBool}></Error_Message>
            )} */} 
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
                 {isLoading ? (
                <div className="min-w-screen min-h-screen bg-gray-200 flex justify-center items-center">
                    <div className="w-16 h-16 border-4 border-[#145C44] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="w-full min-w-screen min-h-screen pt-12">
                    <div
                        className={`w-full grid gap-0 ${
                            events.length === 0 && announcements.length === 1
                            ? 'min-h-[400px] grid-cols-1'
                            : 'min-h-[600px] grid-cols-1 sm:grid-cols-3'
                        }`}
                    >
                    {/* Events */}
                    {events.length > 0 ? (
                        <div className={`${announcements.length === 0 ? 'col-span-1 sm:col-span-3' : 'col-span-1 sm:col-span-2'}
                        bg-cover bg-center text-white flex flex-col justify-center items-start px-8 py-16 sm:px-16 sm:py-32 w-full transition-all duration-1000 relative group`}
                        style={{
                            backgroundImage: `url(${
                            events[currentEventIndex]?.files?.[0]?.serverFilename
                                ? `/uploads/${events[currentEventIndex].files[0].serverFilename}`
                                : event_placeholder
                            })`,
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
                
                        <div className="relative z-10 group/title">
                            <Link
                                to={`/event-details/${events[currentEventIndex]._id}`}
                                state={{ event: events[currentEventIndex] }}
                                className="!text-white !text-3xl sm:!text-4xl md:!text-7xl !font-bold !mb-4 !text-left cursor-pointer block w-full hover:!underline"
                            >
                                {events[currentEventIndex].event_name}
                            </Link>

                            <div className="!text-white !text-md sm:!text-lg !max-w-2xl !text-left line-clamp-2">
                                {events[currentEventIndex].event_description}
                            </div>
                        </div>

                        {events.length > 1 && (
                            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
                                <button
                                    onClick={handlePrevEvent}
                                    disabled={currentEventIndex === 0}
                                    className={`${
                                        currentEventIndex === 0 ? 'opacity-50' : 'opacity-100 cursor-pointer'
                                    }`}
                                >
                                    <IoIosArrowBack size={15}/>
                                </button>
                                <span className="text-sm font-normal select-none">
                                    {`${currentEventIndex + 1} of ${events.length}`}
                                </span>
                                <button
                                    onClick={handleNextEvent}
                                    disabled={currentEventIndex === events.length - 1}
                                    className={`${
                                        currentEventIndex === events.length - 1 ? 'opacity-50' : 'opacity-100 cursor-pointer'
                                    }`}
                                >
                                    <IoIosArrowForward size={15} />
                                </button>
                            </div>
                        )}
                        </div>
                    ) : null}

                    {/* Announcements */}
                    {announcements.length > 0 ? (
                    <div
                        className={`grid grid-rows-2 w-full ${
                        events.length === 0 ? 'col-span-1 sm:col-span-3' : 'col-span-1'
                        }`}
                    >
                        {announcements.length === 1 ? (
                        <div className={`row-span-2 bg-cover bg-center !text-white flex flex-col justify-center 
                            ${events.length === 0 ? 'items-start text-left' : 'items-end text-right'} 
                            px-8 sm:px-10 py-8 sm:py-10 w-full transition-all duration-1000`}
                            style={{
                                backgroundImage: `url(${announcements[0]?.image || notice1})`,
                                height: events.length === 0 ? '400px' : '600px',
                            }}
                        >
                            <div>
                            <Link
                                to={`/announcement-details/${announcements[0]._id}`}
                                className="!text-white !text-2xl sm:!text-3xl md:!text-4xl !font-bold !mb-4 hover:!underline line-clamp-3"
                            >
                                {announcements[0].title}
                            </Link>
                            </div>
                            <p className="text-sm sm:text-base max-w-md line-clamp-2">{announcements[0].content}</p>
                        </div>
                        ) : (
                        <>
                            <div className="row-span-1 relative overflow-hidden">
                            {announcements[oddNoticeIndex] && (
                                <div
                                    key={announcements[oddNoticeIndex]._id}
                                    className={`absolute inset-0 bg-cover bg-center !text-white flex flex-col justify-center 
                                        ${events.length === 0 ? 'items-start text-left' : 'items-end text-right'} 
                                        px-8 sm:px-10 py-8 sm:py-10 transition-all duration-1000`}
                                    style={{
                                        backgroundImage: `url(${announcements[oddNoticeIndex]?.image || notice1})`
                                    }}
                                >
                                <div>
                                    <Link
                                        to={`/announcement-details/${announcements[oddNoticeIndex]._id}`}
                                        className="!text-white !text-2xl sm:!text-3xl md:!text-4xl !font-bold !mb-4 hover:!underline line-clamp-1 pr-5"
                                    >
                                    {announcements[oddNoticeIndex].title}
                                    </Link>
                                </div>
                                <p className="text-sm sm:text-base max-w-md line-clamp-2 pr-5">
                                    {announcements[oddNoticeIndex].content}
                                </p>
                                </div>
                            )}
                            </div>

                            <div className="row-span-1 relative overflow-hidden">
                            {announcements[evenNoticeIndex] && (
                                <div
                                    key={announcements[evenNoticeIndex]._id}
                                    className={`absolute inset-0 bg-cover bg-center !text-white flex flex-col justify-center 
                                        ${events.length === 0 ? 'items-start text-left' : 'items-end text-right'} 
                                        px-8 sm:px-10 py-8 sm:py-10 transition-all duration-1000`}
                                    style={{
                                        backgroundImage: `url(${announcements[evenNoticeIndex]?.image || notice2})`
                                    }}
                                >
                                <div>
                                    <Link
                                        to={`/announcement-details/${announcements[evenNoticeIndex]._id}`}
                                        className="!text-white !text-2xl sm:!text-3xl md:!text-4xl !font-bold !mb-4 hover:!underline line-clamp-2 pr-5"
                                    >
                                    {announcements[evenNoticeIndex].title}
                                    </Link>
                                </div>
                                <p className="text-sm sm:text-base max-w-md line-clamp-2 pr-5">
                                    {announcements[evenNoticeIndex].content}
                                </p>
                                </div>
                            )}
                            </div>
                        </>
                        )}
                    </div>
                    ) : events.length === 0 ? (
                        <div className="col-span-1 sm:col-span-3 flex flex-col items-center justify-center text-center px-8 py-16 text-white"
                        style={{
                            backgroundImage: `url(${notice1})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                        >
                        <p className="text-4xl sm:text-5xl font-bold mb-3">Events & Announcements</p>
                        <p className="text-md sm:text-lg">Stay tuned for latest events and announcements!</p>
                        </div>
                    ) : null}
                    </div>

                    {/* Job Postings */}
                    <div className="bg-white px-10 pr-12 sm:pr-14 sm:px-12 lg:pr-17 py-20">
                        <div className={`flex ${jobs.length > 0 ? 'flex-col lg:flex-row gap-12' : 'flex-col items-center justify-center'}`}>
                            {jobs.length > 0 ? (
                                <>
                                    <div className="lg:w-1/3 flex flex-col justify-center">
                                        <h2 className="text-4xl sm:text-5xl font-bold text-[#891839] text-left mb-6 leading-12">
                                            Explore<br />Recent Job<br />Opportunities
                                        </h2>
                                        <div className="flex justify-end mt-4 pr-10">
                                            <Link to={`/jobs`}>
                                                <button className="focus:!outline-none text-[#891839] border-3 border-[#891839] px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:bg-[#891839] hover:text-white cursor-pointer">
                                                    View more &gt;
                                                </button>
                                            </Link>
                                        </div>
                                    </div>

                                    <div className={`grid grid-cols-1 ${jobs.length === 1 ? 'sm:grid-cols-1' : 'sm:grid-cols-2'} gap-6 ${jobs.length === 1 ? 'lg:w-[50%]' : 'lg:w-[2/3]'} mx-auto`}>
                                        {jobs.slice(0, 2).map((job, index) => (
                                            <Link
                                                key={index}
                                                 to={`/job-details/${job._id}`}
                                                className="transform transition-transform duration-300 hover:scale-105"
                                            >
                                                <div className="bg-[#891839] p-3 rounded-3xl flex justify-center h-70 w-full shadow-lg hover:shadow-xl">
                                                    <div className="bg-[#891839] text-white px-10 rounded-3xl border-2 border-white w-full flex flex-col items-start justify-center text-left">
                                                        <h3 className="text-4xl font-semibold mb-7 line-clamp-2">{job.job_title}</h3>
                                                        <p>Company: {job.company}</p>
                                                        <p className="line-clamp-1">
                                                            Date Posted: {new Date(job.date_posted).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                            })}
                                                        </p>
                                                        <p className="line-clamp-1">Location: {job.location}</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full py-15">
                                    <div className="text-center pr-20">
                                        <h2 className="!text-4xl sm:!text-5xl !font-bold !text-[#891839] !leading-12">
                                            Explore Job Opportunities
                                        </h2>
                                    </div>
                                    <div className="mt-4 w-full flex justify-end px-80">
                                        <Link to="/jobs">
                                            <button className="focus:!outline-none text-[#891839] border-3 border-[#891839] px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:bg-[#891839] hover:text-white cursor-pointer">
                                                View jobs &gt;
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="w-full h-0.5 mt-15 bg-[#891839]"></div>
                    </div>

                    {/* <div className="w-full h-110 grid grid-cols-2 gap-0"> */}
                    <div className="w-full min-h-[440px] grid grid-cols-1 sm:grid-cols-2">
                        <Link to={`/events`}>
                            <BookEventButton />
                        </Link>
                        <Link to={'/search-alumni'}>
                            <SearchAlumniButton />
                        </Link>
                    </div>
                    <div className="w-full z-50">
                        <Footer />
                    </div>
                </div>
            )}
           
            </div>
            
        </>
    );
};