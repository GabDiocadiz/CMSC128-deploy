import artemis from "../../ARTEMIS.png"

export default function Navbar_landing() {
  return (
    <div>
      <nav className="bg-white w-full py-2 fixed top-0 left-0 shadow-md z-50">
        {/* Flexbox for proper alignment */}
        <div className="container flex justify-between items-center py-1 px-4">
          {/* Left - Logo*/}
          <a href="/" className="flex items-center space-x-3 lg:ml-5">
            <img
              src={artemis}
              alt="ARTEMIS Logo"
              className="w-10 h-10 rounded-full object-cover"
            />
            <h2 className="text-2xl font-bold text-[#891839]">ARTEMIS</h2>
          </a>
        </div>
      </nav>
    </div>
  );
}