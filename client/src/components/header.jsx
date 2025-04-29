import { useState } from "react";
import { Link } from "react-router-dom";
import Notification from "./notification";

import uplbLogo from "../assets/uplblogo.png";
import notifications from "../assets/notifications.png";
import humanIcon from "../assets/Human Icon.png";

export default function Navbar({user_id}) {
  const  [notification_modal, setnotification_modal] = useState(false)
  return (
   <div>
      {notification_modal &&(
        <div>
          <Notification setVisible={setnotification_modal}></Notification>
        </div>
      )}
       <nav className="bg-white w-full py-1 fixed top-0 left-0 z-20">
        {/* Flexbox for proper alignment */}
        <div className="container flex justify-between items-center py-1 px-4">
          {/* Left - Logo */}
          <Link to={`/home/${user_id}`}>
            <img src={uplbLogo} className="bg-none w-40 h-auto" alt="UPLB Logo" />
          </Link>

          {/* Right - Notification & Profile Icons */}
          <div className="absolute top-1 right-4 flex items-center space-x-4">
            {/* Notification Icon */}
            <div 
            onClick={()=>{
              setnotification_modal(true)
            }
            }
            className="cursor-pointer"
            >
              <img src={notifications} className="w-10 h-10" alt="Notifications" />
            </div>

            {/* Profile Icon inside Circle */}
            <a href="/" className="w-10 h-10 bg-none text-white flex items-center justify-center rounded-full">
              <img src={humanIcon} className="w-10 h-10" alt="Profile" />
            </a>
          </div>
        </div>
      </nav>
   </div>
  );
}