import calendar from "../../assets/calendar.png";

export default function BookEventButton() {
    return (
        <div className="group relative bg-[#891839] p-8 pb-30 flex justify-center items-center w-full h-full transition-colors duration-300 overflow-hidden cursor-pointer">
            <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white/70 to-transparent transition-colors duration-300 group-hover:from-white/70 z-0" />
            <button className="hover:scale-105 transition-transform relative z-10 bg-[#891839] text-[#ffffff] rounded-3xl border-5 border-white w-full h-full flex items-center justify-center px-4 py-6 sm:px-8 lg:px-10  duration-300 cursor-pointer overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full">
                    <img src={calendar} alt="Calendar Icon" className="w-24 h-24 sm:w-35 sm:h-35 lg:w-60 lg:h-60" />
                    <div className="text-center sm:text-right">
                        <p className="text-3xl sm:text-4xl lg:text-6xl font-semibold leading-tight max-w-full">Book an</p>
                        <p className="text-3xl sm:text-4xl lg:text-6xl font-semibold leading-tight max-w-full">Event</p>
                    </div>
                </div>
            </button>
        </div>
    );
};