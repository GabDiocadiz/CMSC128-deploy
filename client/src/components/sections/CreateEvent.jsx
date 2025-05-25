import Navbar_admin from "../header_admin";
import Footer from "../footer";
import { useState, useRef, useEffect } from "react";
import { Datepicker} from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../auth/AuthContext";
import { LuCalendar, LuMapPin } from "react-icons/lu";
import { PiHandHeartBold  } from "react-icons/pi";
import { IoIosArrowBack } from "react-icons/io";
import { HiOutlineCloudUpload, HiOutlineX } from "react-icons/hi";
import { BsFileText } from "react-icons/bs";
import Sidebar from "../Sidebar";
import Loading from "../loading";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export const CreateEvent = () => {
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const { authAxios, user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen((prev) => !prev);
    const [formData, setFormData] = useState({
        event_name: "",
        event_description: "",
        event_date: new Date(),
        venue: "",
        created_by: `${user?._id}` || "",
        donatable: false,
    });

    const [actualFiles, setActualFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const imageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];

        const validFiles = [];
        const errors = [];

        selectedFiles.forEach(file => {
            if (!imageTypes.includes(file.type)) {
                errors.push(`${file.name} is not a supported image file.`);
            } else if (file.size > MAX_FILE_SIZE) {
                errors.push(`${file.name} exceeds the 10MB size limit.`);
            } else {
                validFiles.push(file);
            }
        });

        if (errors.length > 0) {
            alert(errors.join('\n'));
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setActualFiles(validFiles);

        if (validFiles.length > 0) {
            setFormData((prev) => ({
                ...prev,
                image: validFiles[0],
            }));
        }
    };

    const handleDateChange = (date) => {
        console.log("Date changed");
        const now = new Date();

        const normalizedDate = new Date(date);
        normalizedDate.setHours(0, 0, 0, 0);

        const todayNormalized = new Date(now);
        todayNormalized.setHours(0, 0, 0, 0);

        console.log(normalizedDate, todayNormalized)

        if (normalizedDate < todayNormalized) {
            alert("Cannot set event date to a previous date.");
            setFormData(prev => ({ ...prev, event_date: prev.event_date}));
            return;
        }

        setFormData(prev => ({ ...prev, event_date: date }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setLoading(true);
        console.log("Submitting...");

        if (!formData.event_name.trim()) {
            alert("Event Name is required.");
            setIsSubmitting(false);
            setLoading(false);
            return;
        }
        if (!formData.venue.trim()) {
            alert("Venue is required.");
            setIsSubmitting(false);
            setLoading(false);
            return;
        }

        try {
            const submissionFormData = new FormData();

            submissionFormData.append('event_name', formData.event_name.trim());
            submissionFormData.append('event_description', formData.event_description.trim());
            submissionFormData.append('event_date', new Date(formData.event_date).toISOString());
            submissionFormData.append('venue', formData.venue.trim());
            submissionFormData.append('created_by', formData.created_by);
            submissionFormData.append('donatable', formData.donatable.toString());

            actualFiles.forEach(fileObject => {
                submissionFormData.append("files[]", fileObject, fileObject.name);
            });
            console.log("Submitting event data with files...");
            const response = await authAxios.post("/events/create", submissionFormData, {});

            alert(`Event created successfully!`);
            navigate('/admin_main');
        } catch (err) {
            console.error("Error creating event:", err.response?.data || err.message || err);
            alert("Event submission failed");
        } finally {
            setIsSubmitting(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);

        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
           <Loading/>
        );
    }

    return (
        <>  
            <div className="w-screen">
                <Navbar_admin toggleSidebar={toggleSidebar}/>
            </div>

            <div
                className={`fixed top-0 left-0 h-full bg-gray-800 text-white w-64 z-40 transition-transform duration-300 ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <Sidebar />
            </div>

            <div className={`transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
                <div className="min-h-screen bg-gray-100">
                    <div className="bg-gray-100">
                        <div className="max-w-7xl mx-auto px-6 py-8 pt-30">
                            <div
                                className="flex items-center gap-3 cursor-pointer text-[#145C44] mb-4 hover:text-[#0d4a35] transition-colors duration-200"
                                onClick={() => navigate('/Admin_main')}
                            >
                                <IoIosArrowBack className="text-lg" />
                                <span className="text-sm font-medium">Back</span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-left">
                                <div>
                                    <div className="text-4xl md:text-5xl lg:text-5xl font-bold text-[#145C44] leading-tight flex items-center gap-3">
                                        Create an event
                                    </div>
                                    <p className="text-gray-600 pl-1">
                                        Fill in the details below to create a new event.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto px-6 pt-5 pb-12">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-2 h-8 bg-[#145C44] rounded-full"></div>
                                        Basic Information
                                    </h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            label="Event Name"
                                            value={formData.event_name}
                                            onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                                            icon={BsFileText}
                                            placeholder="Enter event name"
                                        />
                                        
                                        <InputField
                                            label="Venue"
                                            value={formData.venue}
                                            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                            icon={LuMapPin}
                                            placeholder="Enter venue location"
                                        />
                                        
                                        <div className="group">
                                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <LuCalendar className="w-4 h-4 text-gray-500" />
                                                Event Date
                                            </label>
                                            <div className="relative">
                                                <Datepicker
                                                    value={formData.event_date}
                                                    onChange={handleDateChange}
                                                    icon={false}
                                                    style={{
                                                        backgroundColor: '#f3f4f6',
                                                        border: '1px solid #d1d5db',
                                                        borderRadius: '6px',
                                                        color: '#374151',
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="group">
                                            <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                                <PiHandHeartBold className="w-4 h-4 text-gray-500" />
                                                Donate
                                            </label>
                                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <label className="inline-flex items-center cursor-pointer">
                                                    <input
                                                        name="donatable"
                                                        type="checkbox" 
                                                        checked={formData.donatable}
                                                        onChange={handleInputChange}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="relative w-14 h-7 peer-focus:outline-none rounded-full peer bg-[#891839] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-green-500 dark:peer-checked:bg-green-600"></div>
                                                    <span className="ms-3 text-base text-emerald-800 font-semibold">Charity Event?</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-2 h-8 bg-[#145C44] rounded-full"></div>
                                        Event Description
                                    </h2>
                                    
                                    <textarea
                                        name="event_description"
                                        value={formData.event_description}
                                        onChange={handleInputChange}
                                        placeholder="Describe the event, activities, what attendees can expect, and any important details..."
                                        rows={8}
                                        className="w-full text-gray-700 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#145C44] focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md resize-none"
                                    />
                                </div>
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sticky top-8">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                        <div className="w-2 h-8 bg-[#145C44] rounded-full"></div>
                                        Event Image
                                    </h2>
                                    
                                    <div className="space-y-4">
                                        <div className="relative w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center overflow-hidden group">
                                            {formData.image ? (
                                                <>
                                                    <img
                                                        src={URL.createObjectURL(formData.image)}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({ ...formData, image: null });
                                                            setActualFiles([]);
                                                            if (fileInputRef.current) {
                                                                fileInputRef.current.value = '';
                                                            }
                                                        }}
                                                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors duration-200 shadow-lg cursor-pointer"
                                                    >
                                                        <HiOutlineX className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="text-center">
                                                    <HiOutlineCloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                                    <p className="text-gray-500 text-sm font-medium">No image uploaded</p>
                                                    <p className="text-gray-400 text-xs mt-1">Click below to add an image</p>
                                                </div>
                                            )}
                                        </div>

                                        <label className="block">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                ref={fileInputRef}
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <div className="w-full px-4 py-3 bg-gradient-to-r from-[#145C44] to-[#0d4a35] text-white rounded-xl cursor-pointer hover:from-[#0d4a35] hover:to-[#145C44] transition-all duration-200 text-center font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                                                Choose Image
                                            </div>
                                        </label>

                                        <p className="text-xs text-gray-500 text-center">
                                            Supported formats: JPEG, PNG, WebP<br />
                                            Maximum size: 10MB
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-end mt-12 mb-15 pt-8 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate('/Admin_main')}
                                className="px-8 py-3 text-white bg-gradient-to-r from-[#891839] to-[#6d122d] hover:from-[#6d122d] hover:to-[#891839] font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-gradient-to-r from-[#145C44] to-[#0d4a35] hover:from-[#0d4a35] hover:to-[#145C44] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isSubmitting ? 'Creating Event...' : 'Create Event'}
                            </button>
                        </div>

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                                <p className="text-red-600 text-sm font-medium">{error}</p>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            <div className="w-full z-50">
                <Footer />
            </div>
        </>
    );
};

const InputField = ({ label, value, onChange, placeholder, icon: Icon, type = "text" }) => (
    <div className="group">
        <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-gray-500" />}
            {label}
        </label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#145C44] focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md group-hover:border-gray-300"
        />
    </div>
);