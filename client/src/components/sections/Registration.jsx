import { useState, useRef } from "react";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import axios from "axios";

import Navbar_landing from "../header_landing";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import buildingImg from "../../assets/Building.png";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB 


const Registration = () => {
    const navigate = useNavigate();
    const [actualFiles, setActualFiles] = useState([]); // Reintroduced for generic file handling
    const fileInputRef = useRef(null);

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        user_type: "",
        confirmPassword: "",
        degree: "",
        graduation_year: ""
        // No 'profile_picture' in formData directly, it's handled by actualFiles
    });

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
          errors.forEach(err => toast.error(err));
          if (fileInputRef.current) fileInputRef.current.value = "";
          return;
        }

        setActualFiles(validFiles);
        console.log(actualFiles);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
    const errors = [];

    if (!formData.username || formData.username.trim().length < 2) {
        errors.push("Name is required and must be at least 2 characters.");
    }

    if (!formData.email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
        errors.push("Please enter a valid email address.");
    }

    if (!formData.password || formData.password.length < 8) {
        errors.push("Password must be at least 8 characters.");
    }

    if (formData.password !== formData.confirmPassword) {
        errors.push("Passwords do not match.");
    }

    if (!formData.degree) {
        errors.push("Degree program is required.");
    }

    if (!formData.graduation_year) {
        errors.push("Graduation year is required.");
    } else if (!/^\d{4}$/.test(formData.graduation_year)) {
        errors.push("Graduation year must be a 4-digit number.");
    } else {
        const year = parseInt(formData.graduation_year, 10);
        const currentYear = new Date().getFullYear();
        if (year < 1940 || year > currentYear) {
            errors.push(`Graduation year must be between 1940 and ${currentYear}.`);
        }
    }

    if (errors.length > 0) {
        toast.error(
            <div>
                <strong>Fix the following issues:</strong>
                <ul className="list-disc ml-5 mt-2">
                    {errors.map((err, idx) => (
                        <li key={idx}>{err}</li>
                    ))}
                </ul>
            </div>,
            { autoClose: 7000 }
        );
        return;
    }

    try {
        let uploadedFiles = [];

            if (actualFiles.length > 0) {
                const fileFormData = new FormData();
                actualFiles.forEach(file => fileFormData.append("files[]", file));

                const file_res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register/upload`, fileFormData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                uploadedFiles = file_res.data.files.map(file => ({
                    originalFilename: file.originalname,
                    serverFilename: file.serverFilename,
                }));
            } else {
                // Use a default image reference if none uploaded
                uploadedFiles = [{
                    originalFilename: "default_avatar.png",
                    serverFilename: "default_avatar.png"
                }];
            }

            const userRegData = {
                name: formData.username,
                email: formData.email,
                password: formData.password,
                confirmPassword: formData.confirmPassword,
                user_type: "Alumni",
                degree: formData.degree,
                graduation_year: formData.graduation_year,
                files: uploadedFiles,
            };

        const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, userRegData);
        toast.success("Registration Successful. Redirecting to home page...");
        navigate(-1);
    } catch (err) {
        console.error("Registration error:", err);
        if (err.response?.data?.errors) 
        {
            err.response.data.errors.forEach(msg => toast.error(msg));
        } 
        else 
        {
            toast.error(err.response?.data?.error || "Registration failed. Please try again.");
        }
    }
    };

    return (
        <>
            <div className="w-screen">
                <Navbar_landing></Navbar_landing>
            </div>

            <div className="bg-cover bg-center w-full h-full flex flex-col justify-between pb-20 pt-10"
                style={{ backgroundImage: `url(${buildingImg})` }}>
                <div className="grid grid-cols-1 gap-y-5 pt-16">
                    <h1 className=" !text-7xl font-bold text-white ">ARTEMIS</h1>
                    <div className="flex justify-center">
                        <div className="bg-white/60 py-8 px-6 rounded-2xl shadow-lg w-96 backdrop-blur-sm">
                            <p className="text-xl text-center text-[#00110C] font-light pb-4">Alumni Registration Form</p>
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Username */}
                                <div className="">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full p-2 border-2 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1 "
                                        placeholder="Name"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full p-2 border-2 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1"
                                        placeholder="Email"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full p-2 border-2 border-[#3E3939] rounded-md outline-none focus:ring-1 pr-10"
                                        placeholder="Password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                                    </button>
                                </div>

                                {/* Confirm Password */}
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full p-2 border-2 border-[#3E3939] rounded-md outline-none focus:ring-1 pr-10"
                                        placeholder="Re-enter password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-700 focus:outline-none"
                                    >
                                        {showConfirmPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                                    </button>
                                </div>

                                {/* Degree Program */}
                                <div>
                                    <input
                                        type="text"
                                        name="degree"
                                        value={formData.degree}
                                        onChange={handleChange}
                                        className="w-full p-2 border-2 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1"
                                        placeholder="Degree Program"
                                        required
                                    />
                                </div>
                                {/* Graduation Year */}
                                <div>
                                    <input
                                        type="text"
                                        name="graduation_year"
                                        value={formData.graduation_year}
                                        onChange={handleChange}
                                        className="w-full p-2 border-2 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1"
                                        placeholder="Year Graduated"
                                        required
                                    />
                                </div>
                                {/* Profile Picture Input */}
                                <div>
                                    <label htmlFor="profile_picture_input" className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                                    <input
                                        ref={fileInputRef}
                                        id="profile_picture_input" // Using a more specific ID
                                        // The 'name' attribute here isn't crucial for FormData.append when using 'files[]'
                                        // but it's good practice for HTML validation if it were a standard form field.
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="block w-full max-w-xs text-sm text-gray-900 border border-gray-300 rounded-md file:bg-[#891839] file:text-white file:border-none file:px-4 file:py-2 cursor-pointer"
                                        type="file"
                                    />
                                    {actualFiles.length > 0 && (
                                        <p className="text-xs text-gray-500 mt-1">Selected: {actualFiles[0].name}</p>
                                    )}
                                </div>

                                <div className="w-full bg-[#3E3939] h-0.5"></div>
                                {/* Register Button */}
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="font-semibold w-full bg-[#085740] p-2 rounded-md hover:bg-green-600 transition focus:ring-1 focus:ring-green-600 focus:!outline-none cursor-pointer"

                                >
                                    Register
                                </button>
                                {/* Login Button */}
                                <hr className="border-t border-[#085740]" />
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="w-full bg-[#891839] text-white font-bold p-2 rounded-md hover:bg-red-700 transition focus:!outline-none cursor-pointer"
                                >
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>


        </>

    )

};
export default Registration;