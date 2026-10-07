import { useState } from "react";
import {Link} from "react-router-dom"

import { 
  ArrowUp, 
  ArrowRight, 
  Mail, 
  MapPin 
} from "lucide-react";

import { SiInstagram } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {

  const scrollToTop=()=>{
      window.scrollTo({top:0,behavior:"smooth"});
  }
  return (
         <footer className="w-full">
           <section>
             <div className="relative bg-[#3232a1] px-5 py-7 text-white sm:px-6 lg:py-8">
                <button type="button" onClick={scrollToTop} aria-label="Back to top"
                className="absolute right-5 top-5 rounded-lg border border-white/20 bg-white/10 p-2 transition hover:bg-indigo-600 sm:right-10">
                    <ArrowRight size={20}/>
                </button>

                <div className="mx-auto max-w-4xl">
                     <div className="flex text-center">
                        <Link to="/" className="text-3xl front-extrabold tracking-tight text-center ml-50">
                        KOSH <span className="text-indigo-400">Fin</span>
                        </Link>
                        <p className="mt-3 ml-8 text-sm text-slate-300 mr-5">Your Property. Your Finances. One Platform.</p>

                        {/* <div className="mt-7 flex justify-center gap-4"> */}
                            {[SiInstagram, FaLinkedin].map((Icon, index)=>(
                                <span key={index} className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-700 text-white">
                                    <Icon size={19}/>
                                </span>
                            ))}
                            {/* </div> */}
                     </div>
                     <nav className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 text-sm font-semibold uppercase tracking-wide">
               <Link to="/" className="hover:text-indigo-300">
              Home
            </Link>

            <Link to="/properties" className="hover:text-indigo-300">
              Properties
            </Link>

            <Link to="/about" className="hover:text-indigo-300">
              About Us
            </Link>

            <Link to="/contact" className="hover:text-indigo-300">
              Contact
            </Link>
         </nav>
         <div className="mt-6 flex flex-wrap justify-center gap-x-5
         text-xs text-slate-400">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Term & Conditions</Link>
         </div>

         <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-center text-xs text-slate-400">
            Simplifying property discovery and financial management.
          </p>
         </div>
                </div>
             </div>

             <div className="bg-indigo-700 px-8 py-5 text-center text-xs text-indigo-100"> © {new Date().getFullYear()} KOSHFin.
        All rights reserved.

             </div>
           </section>
         </footer>
  );
};

export default Footer