import { RiTwitterXLine, RiInstagramLine } from "react-icons/ri";
import { SlSocialFacebook } from "react-icons/sl";
import { MapPin, Mail, Phone } from "lucide-react";
import icslogo from "../assets/icslogo.png";
import caslogo from "../assets/caslogo.png";
import uplblogo2 from "../assets/uplblogo2.png";
import artemis from "../../ARTEMIS.png";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-600 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <img 
                src={artemis} 
                alt="ARTEMIS Logo" 
                className="w-16 h-16 rounded-full mr-3 object-cover" 
              />
              <h2 className="text-4xl font-bold text-[#891839]">ARTEMIS</h2>
            </div>

            <p className="text-gray-700 text-md mb-4 lg:ml-8 text-left">
              Institute of Computer Science
            </p>

            <div className="space-y-3 max-w-3xl">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-[#891839] mr-3 mt-1 flex-shrink-0" />
                <p className="text-sm leading-snug text-justify">
                  Institute of Computer Science, College of Arts and Sciences <br/>
                  UPLB, Los Baños, Laguna, Philippines 4031
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 text-[#891839] mr-3 flex-shrink-0" />
                <p className="text-sm">(049) 536 2302 | 63-49-536-2302</p>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-[#891839] mr-3 flex-shrink-0" />
                <a href="mailto:ics.uplb@up.edu.ph" className="text-sm hover:text-[#891839] transition-colors">
                  ics.uplb@up.edu.ph
                </a>
              </div>
            </div>

            <div className="flex space-x-4 mt-5 lg:pl-8">
              <a 
                href="https://www.facebook.com/ICS.UPLB/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition transform hover:scale-110"
              >
                <SlSocialFacebook className="w-5 h-5 text-[#891839]" />
              </a>
              <a 
                href="https://x.com/ics_uplb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition transform hover:scale-110"
              >
                <RiTwitterXLine className="w-5 h-5 text-[#891839]" />
              </a>
              <a 
                href="https://www.instagram.com/up.edu.ph/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="transition transform hover:scale-110"
              >
                <RiInstagramLine className="w-5 h-5 text-[#891839]" />
              </a>
            </div>
          </div>

          <div className="flex justify-center md:justify-end items-center">
            <div className="flex space-x-6">
              <img src={icslogo} alt="ICS Logo" className="h-18 w-18 lg:w-38 lg:h-38 mt-1" />
              <img src={caslogo} alt="CAS Logo" className="h-19 w-19 lg:w-40 lg:h-40 mt-0.5 lg:mt-0" />
              <img src={uplblogo2} alt="UPLB Logo" className="h-18 w-18 lg:w-38 lg:h-38 mt-0.5" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="text-center text-gray-700 px-7 text-xs md:text-sm lg:text-sm">
            Institute of Computer Science, University of the Philippines Los Baños. All Rights Reserved © {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </footer>
  );
}