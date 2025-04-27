
import { useState } from "react";

export default function Notification_View({notification_info, setNotification_view}){
    const markasRead=()=>{

    }
    return (
    
    <div>
        
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className=" relative bg-white rounded-xl p-6 w-[60vw] h-[80vh]  shadow-lg flex flex-col">
          <div className="w-full">
            <h2 className="text-[5vh] font-bold text-emerald-800 text-start pb-2">
                {notification_info.title}
            </h2>
          </div>
            <p className="text-black text-start h-10">Sent {notification_info.date}</p>
            {/* https://flowbite.com/docs/forms/textarea/ Text Area */}
            {/* <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your message</label>
            <textarea id="message" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-2xl border border-gray-30 resize-none h-[50vh]"
             placeholder="Write your message here..."></textarea> */}
             
                <div className="relative whitespace-pre-line bg-transparent border-2 h-[50vh] text-black rounded-2xl text-start p-4">
                    <div className=" h-full w-full
                    space-y-1
                    overflow-y-auto [&::-webkit-scrollbar]:w-1
                    [&::-webkit-scrollbar-track]:rounded-fulsl
                    [&::-webkit-scrollbar-track]:bg-gray-100
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    [&::-webkit-scrollbar-thumb]:bg-gray-300
                    dark:[&::-webkit-scrollbar-track]:bg-neutral-700
                    dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500  pr-5">
                        {notification_info.message}
                        
                    </div>
                </div>
            
             

            <div className="grid grid-cols-2 absolute bottom-4 right-4 gap-x-4">
              {/* Cancel */}
              <button 
              onClick={()=>{
                setNotification_view(false)
              }}
              className=" bg-[#891839] text-white px-4 py-2 rounded w-[150px] hover:bg-red-700 transition-colors">
              Exit
              </button>
              {/* Submit */}
              <button 
              onClick={()=>{
                markasRead();
                setNotification_view(false);
              }}
              className=" bg-emerald-800 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">
              Mark as Read
              </button>
            </div>
          </div>
        </div>
    </div>
   );
}