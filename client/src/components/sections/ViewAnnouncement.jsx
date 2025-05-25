import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { CiCalendar } from "react-icons/ci";
import { useEffect, useState } from "react";
import { ScrollToTop } from "../../utils/helper";
import Navbar from "../header";
import Footer from "../footer";
import Loading from "../loading";
import axios from "axios";
import { useAuth } from "../../auth/AuthContext";

export default function ViewAnnouncementDetails() {
    const { id } = useParams();
    const { authAxios } = useAuth();
    const [announcement, setAnnouncement] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [backgroundImageUrl, setBackgroundImageUrl] = useState(''); // New state for background image URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnnouncement = async () => { // Define an async function inside useEffect
            setIsLoading(true);
            try {
                // Use a consistent protocol (http or https)
                console.log(id)
                const response = await authAxios.get(`/announcement/read-announcements/${id}`);
                const fetchedData = response.data;
                
                if (fetchedData) {
                    // Assuming your backend sends files as an array of objects,
                    // and the first one is the main image.
                    const imageUrl = fetchedData.files && fetchedData.files.length > 0
                        ? `/uploads/${fetchedData.files[0].serverFilename}`
                        : ''; // Fallback if no image

                    if (imageUrl) {
                        const image = new Image();
                        image.src = imageUrl;

                        image.onload = () => {
                            setAnnouncement(fetchedData);
                            setBackgroundImageUrl(imageUrl); // Set the background image URL
                            setIsLoading(false);
                        };

                        image.onerror = () => {
                            console.warn("Failed to load announcement image. Displaying content without it.");
                            setAnnouncement(fetchedData);
                            setBackgroundImageUrl('/src/assets/default_announcement_bg.png'); // A default fallback image path if the actual image fails
                            setIsLoading(false);
                        };
                    } else {
                        // No image to load, just set the announcement data
                        setAnnouncement(fetchedData);
                        setBackgroundImageUrl('/src/assets/default_announcement_bg.png'); // Set a default if no image is provided
                        setIsLoading(false);
                    }

                } else {
                    // No data returned
                    setAnnouncement(null); // Explicitly set to null if no announcement found
                    setIsLoading(false);
                }
            } catch (e) {
                console.error("Error fetching announcement:", e);
                setIsLoading(false);
                setAnnouncement(null); // Ensure announcement is null on error
                // You might want to navigate to a 404 page or show an error message
            }
        };

        fetchAnnouncement(); // Call the async function
        ScrollToTop();
    }, [id]); // Re-run effect if ID changes

    // Show loading state while data is being fetched
    if (isLoading) {
        return <Loading />;
    }

    // If not loading but announcement is null, it means it wasn't found or an error occurred
    if (!announcement) {
        return (
            <>
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-screen text-gray-700">
                    <p className="text-xl mb-4">Announcement not found or an error occurred.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#891839] text-white hover:bg-[#6c132e] transition"
                    >
                        <IoIosArrowBack /> Go Back
                    </button>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <div className="fixed top-0 w-full z-50">
                <Navbar />
            </div>

            <div className="flex flex-col min-w-screen w-full min-h-screen h-full pt-12">
                <div
                    className="bg-cover bg-center text-white flex flex-col justify-center items-start px-8 sm:px-16 py-14 w-full h-[30vh]"
                    // Use the new backgroundImageUrl state here
                    style={{ backgroundImage: `url(${backgroundImageUrl})` }}
                >
                </div>

                <main className="flex-grow bg-gray-100 px-20 py-15">
                    <div
                        className="flex items-center gap-2 cursor-pointer text-gray-900 hover:text-gray-800 mb-8"
                        onClick={() => navigate(-1)}
                    >
                        <IoIosArrowBack className="text-sm" />
                        <span className="text-sm font-light">Back</span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold text-left text-[#891839] mb-2">
                        {announcement.title}
                    </h2>
                    <div className="px-1 pr-30">
                        <div className="flex items-center gap-2 text-md sm:text-md text-gray-900 text-left pb-12">
                            <CiCalendar className="text-xl sm:text-2xl" />
                            <p>
                                Posted on: {new Date(announcement.date_published).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                        </div>
                        <p className="text-sm sm:text-lg text-gray-900 text-left pb-10">
                            {announcement.content}
                        </p>
                    </div>
                </main>

                <div className="w-full z-50">
                    <Footer />
                </div>
            </div>
        </>
    );
}