import { useState } from "react";

import Navbar_landing from "../header_landing";
import { useNavigate } from 'react-router-dom'
const Registration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData ({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const register= 2; {/* Temporary change it to the api call */}
        if (register.success){
            console.log("Form submitted:", formData);  {/* For debugging, remove on launch */}
            navigate(-1) 
        }else{
            console.log("Unsuccessfully Registered"); {/* Temporary change it to the api call */}
        }
       

    };

    return (
        <>
            <div className="w-screen">
                <Navbar_landing></Navbar_landing>
            </div> 
            
            <div className="bg-[url('src/assets/Building.png')] bg-cover bg-center w-full h-full flex flex-col justify-between pb-20">
                <div className="grid grid-cols-1 gap-y-5 pt-16">
                    <h1 className=" !text-7xl font-bold text-white ">ARTEMIS</h1>       
                    <div className="flex justify-center">
                        <div className="bg-white/50 py-8 px-6 rounded-2xl shadow-lg w-96 backdrop-blur-sm">
                            <p className="text-xl text-center text-[#00110C] font-light pb-4">Alumni Registration Form</p>
                            <form onSubmit={handleSubmit} className="space-y-4">

                                {/* Username */}
                                <div className="">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        className="w-full p-2 border-3 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1 "
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
                                        className="w-full p-2 border-3 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1"
                                        placeholder="Email"
                                        required
                                    />
                                </div>

                                {/* Password */}
                                <div>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full p-2 border-3 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1"
                                        placeholder="Password"
                                        required
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full p-2 border-3 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1"
                                        placeholder="Re-enter password"
                                        required
                                    />
                                </div>

                                <div>
                                    <input
                                        type=""
                                        name=""
                                        value={formData.confirmPassword}
                                        onAbort={handleChange}
                                        className="w-full p-2 border-3 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1"
                                        placeholder="Contact Number"
                                        required
                                    />
                                </div>
                                <div>
                                    <input
                                        type=""
                                        name=""
                                        value={formData.confirmPassword}
                                        onAbort={handleChange}
                                        className="w-full p-2 border-3 border-[#3E3939] bg-white-700 rounded-md outline-none focus:ring-1"
                                        placeholder="Address"
                                        required
                                    />
                                </div>
                                <div className="w-full bg-[#3E3939] h-0.5"></div>
                                {/* Register Button */}
                                <button
                                    type="register"
                                    className="font-semibold w-full bg-[#085740] p-2 rounded-md hover:bg-green-600 transition focus:ring-1 focus:ring-green-600"
                                    
                                >
                                    Register
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