import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { eventList, announcementList, jobList } from "../../utils/models";
import Navbar from "../header";
import Footer from "../footer";
import BookEventButton from "../buttons/BookEvent";
import SearchAlumniButton from "../buttons/SearchAlumni";

export default function MainPage() {
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [oddNoticeIndex, setOddNoticeIndex] = useState(0);
    const [evenNoticeIndex, setEvenNoticeIndex] = useState(1);

    useEffect(() => {
        const eventInterval = setInterval(() => {
            setCurrentEventIndex((prevIndex) => (prevIndex+1)%eventList.length);
        }, 20000);
    
        const noticeInterval = setInterval(() => {
            setOddNoticeIndex((prev) => (prev+2)%announcementList.length);
            setEvenNoticeIndex((prev) => (prev+2)%announcementList.length);
        }, 30000);
    
        return () => {
            clearInterval(eventInterval);
            clearInterval(noticeInterval);
        };
    }, []);

    return (
    <>
        <div className="fixed top-0 w-full z-50">
            <Navbar />
        </div>

        <div className="w-screen pt-12">
        <div className="w-full grid grid-cols-3 gap-0 min-h-[600px]">
            {/* Events */}
            {eventList.length > 0 && (
            <div
                className="col-span-2 bg-cover bg-center text-white flex flex-col justify-center items-start px-16 py-32 w-full transition-all duration-1000 relative group"
                style={{ backgroundImage: `url(${eventList[currentEventIndex].image})` }}
            >
            <div className="relative z-10 group/title">
            <Link
                to={`/event-details/${currentEventIndex}`}
                state={{ event: eventList[currentEventIndex] }}
                className="!text-white !text-7xl !font-bold !mb-4 !text-left cursor-pointer block w-full relative z-10"
            >
                {eventList[currentEventIndex].event_name}
            </Link>
            <div
                className="opacity-0 group-hover/title:opacity-100 pointer-events-none transition-opacity duration-300 absolute top-1/2 left-1/2 -translate-x-[20%] -translate-y-1/2 z-50 w-[650px] h-[500px] bg-cover bg-center text-white shadow-2xl backdrop-blur-md flex items-center justify-center"
                style={{ backgroundImage: `url(${eventList[currentEventIndex].image})` }}
            >
            <div className="relative bg-transparent w-[90%] h-[90%] border-2 border-white rounded-2xl px-10 py-6 flex flex-col items-start text-left overflow-y-auto">
                <h2 className="text-5xl font-bold text-center w-full absolute top-10 left-1/2 -translate-x-1/2 px-4">
                    {eventList[currentEventIndex].event_name}
                </h2>
                <div className="pt-45 w-full space-y-3">
                    <p className="text-md">
                        {eventList[currentEventIndex].event_description}
                    </p>
                    <p>
                        <span className="font-semibold">Date:</span>{' '}
                        {new Date(eventList[currentEventIndex].event_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        })}
                    </p>
                    <p>
                        <span className="font-semibold">Venue:</span> {eventList[currentEventIndex].venue}
                    </p>
                </div>     
            </div>
            </div>
            </div>
                <p className="!text-md !max-w-2xl !text-left">
                    {eventList[currentEventIndex].event_description}
                </p>
            </div>
            )}

            {/* Announcements */}
            <div className="grid grid-rows-2 w-full">
                {[oddNoticeIndex, evenNoticeIndex].map((index, i) => (
                <div
                    key={i}
                    className="bg-cover bg-center !text-white flex flex-col justify-center items-end text-right px-10 py-10 w-full transition-all duration-1000"
                    style={{ backgroundImage: `url(${announcementList[index].image})` }}
                >
                <Link
                    to={`/announcement-details/${index}`}
                    state={{ announcement: announcementList[index] }}
                    className="!text-white !text-4xl !font-bold !mb-4 hover:!underline"
                >
                    {announcementList[index].title}
                </Link>
                <p className="text-sm max-w-md">
                    {announcementList[index].context}
                </p>
                </div>
            ))}
            </div>
        </div>

        {/* Job Postings */}
        <div className="bg-white px-15 py-15">
            <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/3 flex flex-col justify-center">
                <h2 className="text-5xl font-bold text-[#891839] text-left mb-6 leading-12">
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
                jobList.filter(job => job.status === "approved").slice(0, 2).map((job, index) => (
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
                            day: 'numeric' })}
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

        <div className="w-full h-110 grid grid-cols-2 gap-0">
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