import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { eventList, announcementList, jobList } from "../../utils/models";
import Navbar from "../header";
import Footer from "../footer";
import BookEventButton from "../buttons/BookEvent";
import SearchAlumniButton from "../buttons/SearchAlumni";
import Error_Message from "../error_message";
export default function MainPage() {
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [oddNoticeIndex, setOddNoticeIndex] = useState(0);
    const [evenNoticeIndex, setEvenNoticeIndex] = useState(1);
    const [Error_MessageBool, setError_MessageBool]= useState(false)
    useEffect(() => {
        const eventInterval = setInterval(() => {
            setCurrentEventIndex((prevIndex) => (prevIndex + 1) % eventList.length);
        }, 20000);

        const noticeInterval = setInterval(() => {
            setOddNoticeIndex((prev) => (prev + 2) % announcementList.length);
            setEvenNoticeIndex((prev) => (prev + 2) % announcementList.length);
        }, 30000);

        return () => {
            clearInterval(eventInterval);
            clearInterval(noticeInterval);
        };
    }, []);

    return (
        <>
            {/* For testing purposes */}
            {/* {Error_MessageBool &&(
                <Error_Message message={"Testing testing"} setVisible={setError_MessageBool}></Error_Message>
            )} */} 
            <div className="fixed top-0 w-full z-50">
                <Navbar />
            </div>
            
            <div className="w-screen pt-12">
                <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-0 min-h-[600px]">
                    {/* Events */}
                    {eventList.length > 0 && (
                        <div
                            className="col-span-1 sm:col-span-2 bg-cover bg-center text-white flex flex-col justify-center items-start px-8 py-16 sm:px-16 sm:py-32 w-full transition-all duration-1000 relative group"
                            style={{ backgroundImage: `url(${eventList[currentEventIndex].image})` }}
                        >
                            <div className="relative z-10 group/title">
                                <Link
                                    to={`/event-details/${currentEventIndex}`}
                                    state={{ event: eventList[currentEventIndex] }}
                                    className="!text-white !text-3xl sm:!text-4xl md:!text-7xl !font-bold !mb-4 !text-left cursor-pointer block w-full relative z-10 hover:!underline"
                                >
                                    {eventList[currentEventIndex].event_name}
                                </Link>
                                
                            </div>
                            <p className="!text-md sm:!text-lg !max-w-2xl !text-left">
                                {eventList[currentEventIndex].event_description}
                            </p>
                        </div>
                    )}

                    {/* Announcements */}
                    <div className="grid grid-rows-2 w-full">
                        {[oddNoticeIndex, evenNoticeIndex].map((index, i) => (
                            <div
                                key={i}
                                className="bg-cover bg-center !text-white flex flex-col justify-center items-end text-right px-8 sm:px-10 py-8 sm:py-10 w-full transition-all duration-1000"
                                style={{ backgroundImage: `url(${announcementList[index].image})` }}
                            >
                                <Link
                                    to={`/announcement-details/${index}`}
                                    state={{ announcement: announcementList[index] }}
                                    className="!text-white !text-2xl sm:!text-3xl md:!text-4xl !font-bold !mb-4 hover:!underline"
                                >
                                    {announcementList[index].title}
                                </Link>
                                <p className="text-sm sm:text-base max-w-md">
                                    {announcementList[index].context}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Job Postings */}
                <div className="bg-white px-6 sm:px-12 py-15">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <div className="lg:w-1/3 flex flex-col justify-center">
                            <h2 className="text-4xl sm:text-5xl font-bold text-[#891839] text-left mb-6 leading-12">
                                Explore<br />Recent Job<br />Opportunities
                            </h2>
                            <div className="flex justify-end mt-4 pr-10">
                                <Link to="/jobs">
                                    <button className="focus:!outline-none text-[#891839] border-3 border-[#891839] px-6 py-2 rounded-full font-semibold transition-all duration-300 hover:bg-[#891839] hover:text-white">
                                        View more &gt;
                                    </button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:w-2/3">
                            {jobList.length > 0 ? (
                                jobList.filter((job) => job.status === "approved").slice(0, 2).map((job, index) => (
                                    <Link
                                        key={index}
                                        to={`/job-details/${index}`}
                                        state={{ job }}
                                        className="transform transition-transform duration-300 hover:scale-105"
                                    >
                                        <div className="bg-[#891839] p-3 rounded-3xl flex justify-center h-70 w-full shadow-lg hover:shadow-xl">
                                            <div className="bg-[#891839] text-white px-10 rounded-3xl border-2 border-white w-full flex flex-col items-start justify-center text-left">
                                                <h3 className="text-4xl font-semibold mb-3 pb-5">{job.job_title}</h3>
                                                <p>Company: {job.company}</p>
                                                {/* <p>Date Posted: {new Date(job.date_posted).toLocaleDateString()}</p> */}
                                                <p>
                                                    Date Posted: {new Date(job.date_posted).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                                <p>Location: {job.location}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p>No job listings found.</p>
                            )}
                        </div>
                    </div>
                    <div className="w-full h-0.5 mt-15 bg-[#891839]"></div>
                </div>

                {/* <div className="w-full h-110 grid grid-cols-2 gap-0"> */}
                <div className="w-full min-h-[440px] grid grid-cols-1 sm:grid-cols-2">
                    <Link to="/book-event">
                        <BookEventButton />
                    </Link>
                    <Link to="/search-alumni">
                        <SearchAlumniButton />
                    </Link>
                </div>
            </div>
            
            <div className="w-full z-50">
                <Footer />
            </div>
        </>
    );
};