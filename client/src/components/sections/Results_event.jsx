import { useState, useEffect, useMemo, useParams } from "react";
import { Link } from "react-router-dom";
import { BookmarkIcon } from '@heroicons/react/24/solid';
import { eventList } from "../../utils/models";
import Navbar from "../header";
import Footer from "../footer";

export const Results_page_events = ( { user_id } ) => {
    const [sortBy, setSortBy] = useState("");
    const [bookmarkedIds, setBookmarkedIds] = useState([]);
    const [events, setEvents] = useState(eventList);

    const toggleBookmark = (id) => {
        if (bookmarkedIds.includes(id)) {
            setBookmarkedIds(bookmarkedIds.filter((bid) => bid !== id));
        } else {
            setBookmarkedIds([...bookmarkedIds, id]);
        }
    };

    const sortedEvents = useMemo(() => {
        if (sortBy === "date") {
            return [...events].sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
        } else if (sortBy === "title") {
            return [...events].sort((a, b) => a.event_name.localeCompare(b.event_name));
        }
        return events;
    }, [sortBy, events]);

    useEffect(() => {
        setEvents(eventList);
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
        <div className="fixed top-0 w-full z-50">
            <Navbar />
        </div>
        
        <div className="w-full h-full bg-gray-200 mt-10 p-10 flex flex-col justify-center items-center">
            <div className="container flex flex-col items-start space-y-8 text-black text-left ">
            
            {/* Sort dropdown */}
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

            {/* Display events */}
            <div className="flex justify-center w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedEvents.map((event) => (
                    <div key={event.event_id} className="flex flex-col h-full bg-white rounded-xl shadow-md overflow-hidden">
                    <Link to={`/event-details/${event.event_id}/${user_id}`}>
                        <img src={event.image} alt={event.event_name} className="w-full h-48 object-cover" />
                    </Link>
                    
                    <div className="p-4 flex flex-col h-full">
                        {/* Bookmark button */}
                        <div className="flex justify-end mb-2">
                            <button
                                onClick={() => toggleBookmark(event.event_id)}  // toggle bookmark on click
                                className="text-white-400 hover:text-white-500 focus:outline-none"
                                title={bookmarkedIds.includes(event.event_id) ? "Remove Bookmark" : "Bookmark"}
                            >
                                {/* show filled or empty bookmark icon based on bookmark status */}
                                {bookmarkedIds.includes(event.event_id) ? (
                                    <BookmarkIcon className="w-6 h-6" />
                                ) : (
                                    <BookmarkIcon className="w-6 h-6 opacity-50" />
                                )}
                            </button>
                        </div>
                        <h2 className="text-xl font-semibold mb-1">{event.event_name}</h2>
                        <p className="text-sm text-gray-500 mb-2">{event.venue}</p>
                        <p className="text-gray-700 flex-grow">{event.event_description}</p>
                        <div className="mt-auto">
                            <p className="text-sm text-right text-gray-500">
                                {new Date(event.event_date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </div>
        </div>

        <div className="w-full z-50">
            <Footer />
        </div>
        </>
    );
};