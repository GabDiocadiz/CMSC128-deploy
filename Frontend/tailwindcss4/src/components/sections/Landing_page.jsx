import Navbar from "../header"

export const Landing_page = () => {
   
    return (
        
        <div className="fixed inset-0 z-50 bg-black text-white flex flex-col items-center justify-center">
            <div className="fixed top-0"><Navbar /></div>
            <div class="bg-[url('src/assets/Building.png')] bg-cover bg-center w-screen h-screen">
                
               <div className="flex justify-between items-center   h-full text-white text-7xl font-bold text-left pl-16">
                    <div className="flex flex-col">
                    <p>Welcome to Artemis
                    </p>
                    <p className="text-4xl font-medium">Alumni Relations, Tracking,<br></br> and Engagement
                    Management Integrated System</p>

                    <p className="text-xl font-light pt-5">"Guiding Alumni Connections, Every Step of the Way"</p>
                    </div>
                    
                    <div className="flex pt-120 pb-5 pr-15 ">
                        <div className="px-4">
                            <button className="!bg-transparent hover:bg-[#FFFFFF] !text-3xl text-white hover:text-[#085740] !h-15 !font-semibold !px-4 !py-1 !border-2 !border-white  !rounded-full ">Log In</button>
                        </div>
                        <div className="px-4">
                        <button className="!bg-transparent !hover:bg-[#FFFFFF] !text-3xl text-white hover:text-[#085740] !h-15 !font-semibold !hover:text-white !px-4 !py-1 !border-2 !border-white  !rounded-full">View Job Listing</button>
                        </div>

                         
                    </div>
                    
                    
                    
               </div>
            </div> 
            <div className="w-screen bg-gray-200 p-10">
                <h2 className="text-7xl text-center text-[#891839] font-bold">Stay Connected, Stay Involve</h2>
                <div className="flex justify-center">
                    <div>
                        <p className="text-2xl text-[#891839] font-bold" >1</p>
                        <div>
                        <p> Build your Profile</p>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>

    )
}