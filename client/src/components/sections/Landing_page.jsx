import { useNavigate } from 'react-router-dom'
import Navbar_landing from "../header_landing";
import Footer from "../footer";

export const Landing_page = () => {
  const navigate = useNavigate()
   
  return (
    <>
      <div className="w-screen h-auto">
        <Navbar_landing />
      </div>
      <div className="bg-[url('src/assets/Building.png')] bg-cover bg-center w-full min-h-screen h-175 flex flex-col justify-between">
        <div className="flex justify-between items-center h-full text-white text-left pl-8 pt-15 sm:pl-20">
          <div className="flex flex-col">
          <p className="text-5xl md:text-5xl lg:text-7xl font-bold pb-2">
            Welcome to Artemis
          </p>
          <p className="text-xl md:text-2xl lg:text-4xl font-medium pb-3">
            Alumni Relations, Tracking, and <br />
            Engagement Management Integrated System
          </p>
          <p className="text-md md:text-lg lg:text-xl font-light">
            "Guiding Alumni Connections, Every Step of the Way"
          </p>
          </div>
        </div>
        <div className="flex justify-end pb-15 pr-25">
          <div className="flex gap-4">
            <button className="text-base sm:text-lg lg:text-xl text-white h-[50px] sm:h-[60px] w-[140px] sm:w-[180px] font-bold px-4 py-2 border-2 border-white rounded-md hover:bg-white hover:text-[#085740]"
              onClick={()=> navigate('/login')}>
              Log In
            </button>
            <button className="text-base sm:text-lg lg:text-xl text-white h-[50px] sm:h-[60px] w-[170px] sm:w-[190px] font-bold px-4 py-2 border-2 border-white rounded-md hover:bg-white hover:text-[#085740]">
              View Job Listing
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-screen bg-gray-100 px-10 py-15 h-auto">
        <div className="flex flex-col justify-center text-center">
        <h2 className="text-3xl md:text-4xl lg:text-6xl text-center text-[#891839] font-bold">
          Stay Connected, Stay Involved
        </h2>
        <h2 className="text-md md:text-lg lg:text-xl text-center text-black font-light py-5 sm:px-10">
          The ICS Alumni Tracker and Relations Management System is your gateway
          to reconnecting with old friends, expanding your professional network,
          and giving back to the ICS community.
        </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 pt-10 sm:px-10">
            {/* Column 1 */ }
            <div className="grid grid-cols-4 gap-2">
                <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#891839] italic text-center  col-span-1 ">1</span>
                <div className=" col-span-3">
                    <h3 className="text-2xl font-bold text-[#891839] text-left">Build Your Profile</h3>
                    <p className="text-md md:text-lg lg:text-xl text-black text-left pt-1">Share your journey, update your career milestones, and let others find you.</p>
                </div>
                
            </div>
            {/* Column 1 */ }
            <div className="grid grid-cols-4 gap-2">
                <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#891839] italic text-center  col-span-1 ">2</span>
                <div className=" col-span-3">
                    <h3 className="text-2xl font-bold text-[#891839] text-left">Expand Your Network</h3>
                    <p className="text-md md:text-lg lg:text-xl text-black text-left pt-1">Share your journey, update your career milestones, and let others find you.</p>
                </div>
                
            </div>

            {/* Column 3 */}
            <div className="grid grid-cols-4 gap-2">
                <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#891839] italic text-center  col-span-1 ">3</span>
                <div className=" col-span-3">
                    <h3 className="text-2xl font-bold text-[#891839] text-left">Advance Your Career</h3>
                    <p className="text-md md:text-lg lg:text-xl text-black text-left pt-1">Post and discover job opportunities shared by ICS alumni.</p>
                </div>
                
            </div>

            {/* Column 4 */}
            <div className="grid grid-cols-4 gap-2">
                <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#891839] italic text-center  col-span-1 ">4</span>
                <div className=" col-span-3">
                    <h3 className="text-2xl font-bold text-[#891839] text-left">Join Events & Reunions</h3>
                    <p className="text-md md:text-lg lg:text-xl text-black text-left pt-1">Stay updated on upcoming gatherings and RSVP with ease.</p>
                </div>
                
            </div>

            {/* Column 5 */}
            <div className="grid grid-cols-4 gap-2">
                <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#891839] italic text-center  col-span-1 ">5</span>
                <div className=" col-span-3">
                    <h3 className="text-2xl font-bold text-[#891839] text-left">Give Back</h3>
                    <p className="text-md md:text-lg lg:text-xl text-black text-left pt-1">Support scholarships and initiatives through donations and sponsorship.</p>
                </div>
                
            </div>

            {/* Column 6 */}
            <div className="grid grid-cols-4 gap-2">
                <span className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#891839] italic text-center  col-span-1 ">6</span>
                <div className=" col-span-3">
                    <h3 className="text-2xl font-bold text-[#891839] text-left">Stay Informed</h3>
                    <p className="text-md md:text-lg lg:text-xl text-black text-left pt-1">Receive newsletters, announcements, and invitations exclusive events.</p>
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