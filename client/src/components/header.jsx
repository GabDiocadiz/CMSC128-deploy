import { useState } from "react";
import Notification from "./notification";
export default function Navbar() {
  const  [notification_modal, setnotification_modal] = useState(false)
  return (
   <div>
      {notification_modal &&(
        <div>
          <Notification setVisible={setnotification_modal}></Notification>
        </div>
      )}
       <nav className="bg-white w-full py-1 fixed top-0 left-0">
        {/* Flexbox for proper alignment */}
        <div className="container flex justify-between items-center py-1 px-4">
          {/* Left - Logo */}
          <a href="/">
            <img src="src/assets/uplblogo.png" className="bg-none w-40 h-auto" alt="UPLB Logo" />
          </a>

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
              <img src="src/assets/notifications.png" className="w-10 h-10" alt="Notifications" />
            </div>

            {/* Profile Icon inside Circle */}
            <a href="/" className="w-10 h-10 bg-none text-white flex items-center justify-center rounded-full">
              <img src="src/assets/Human Icon.png" className="w-10 h-10" alt="Profile" />
            </a>
          </div>
        </div>
      </nav>
   </div>
  );
}
