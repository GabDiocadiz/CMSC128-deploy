import React, { useEffect } from 'react';
import { useState } from "react";

export default function Request_Confirmation({request_response, setVisible,id,refetch}){
  const [response, setResponse]=useState("");
  const handleHeader=()=>{
    if (request_response === 1){
      setResponse("ACCEPT");
    }else{
      setResponse("REJECT")
    }
  }
  const handleDeleteRequest=()=>{
    
      // fetch the information of request using the id
      //Send information to the inbox of the requester
      //delete the request
      refetch();
      setVisible(false);// Close the Modal
  }
  const handleApproveRequest=()=>{
    
    // fetch the information of request using the id
    //Send information to the inbox of the requester
    //Approve the request
    refetch();
    setVisible(false); // Close the Modal
}
  useEffect(() => {
    handleHeader(); // This will be triggered automatically whenever request_response changes
  }, [request_response]); 
  return (
    <div>
      {/* https://flowbite.com/docs/components/modal/ */}
       
      <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
        {/* <!-- Modal content -->  */}
        <div class="relative flex justify-center bg-white rounded-lg shadow-sm w-[30vw] h-auto">
            <div className='w-[60vw]'>
              {/* <!-- Modal header --> */}
            <div class="flex items-center justify-between p-4 rounded-t dark:border-white-600 border-gray-200">
                
                <button 
                onClick={()=>setVisible(false)}
                type="button" class="absolute top-4 left-4 text-gray-400 bg-transparent hover:bg-gray-200  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-300 dark:hover:text-black" data-modal-hide="static-modal">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
            </div>
            {/* <!-- Modal body --> */}
            <div class="p-4 flex justify-center">
              <p class="text-2xl text-center font-semibold !text-black dark:text-white">
                Are you sure you want to {response}?
              </p>
            </div>
            {/* <!-- Modal footer --> */}
            <div class="p-4 border-gray-200 rounded-b dark:border-gray-600 flex justify-center gap-4 font-semibold">

              <button 
                onClick={handleDeleteRequest}
              data-modal-hide="static-modal" type="button" class="bg-[#891839] text-white px-4 py-2 rounded w-[150px] hover:bg-red-700">
                No
              </button>
              <button 
              onClick={handleApproveRequest}
              data-modal-hide="static-modal" type="button"  class="w-[150px] bg-emerald-800 text-w hite px-4 py-2 rounded hover:bg-green-700">
                Yes
              </button>
            </div>
            </div> 
        </div>
    </div>
</div>


  );
};


