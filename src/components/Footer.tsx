import React from "react";
import { Repeat1 } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <>
      {/* Music Widget (Sticky Bottom) */}
      <footer className="bg-black fixed bottom-0 left-64 w-[calc(100%-256px)] flex items-center justify-between border-t-4 border-white px-8 py-4 z-50">
        <div className="flex items-center gap-4">
          <div className="border-2 border-white shadow-[4px_4px_0px_#ffffff]">
            <Image
              className="w-16 h-16 grayscale hover:grayscale-0 transition-all duration-300"
              src="/images/BG-3.jpg"
              width={64}
              height={64}
              alt="Foto do álbum"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-black uppercase italic tracking-tighter text-lg leading-none">The Wheel Spins</span>
            <span className="text-xs font-bold text-[var(--accent-pink)] uppercase tracking-widest mt-1">Understone</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-8">
            <button className="text-white hover:text-[var(--accent-neon)] transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16">
                <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356a2.25 2.25 0 0 1 1.724-.804h1.947l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z"></path>
              </svg>
            </button>
            <button className="text-white hover:text-[var(--accent-neon)] transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16">
                <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path>
              </svg>
            </button>
            <button className="flex h-12 w-12 items-center justify-center bg-[var(--accent-neon)] border-2 border-white text-black shadow-[4px_4px_0px_#ffffff] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 16 16">
                <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
              </svg>
            </button>
            <button className="text-white hover:text-[var(--accent-neon)] transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16">
                <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
              </svg>
            </button>
            <Repeat1 className="cursor-pointer text-white hover:text-[var(--accent-neon)]" size={24} />
          </div>
          
          <div className="flex items-center gap-4 w-full">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">2:43</span>
            <div className="h-2 w-[500px] border-2 border-white bg-[#121212] relative">
              <div className="absolute top-0 left-0 h-full w-40 bg-[var(--accent-neon)]"></div>
            </div>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">5:00</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-white hover:text-[var(--accent-pink)] transition-colors">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 16 16">
              <path d="M15 15H1v-1.5h14V15zm0-4.5H1V9h14v1.5zm-14-7A2.5 2.5 0 0 1 3.5 1h9a2.5 2.5 0 0 1 0 5h-9A2.5 2.5 0 0 1 1 3.5zm2.5-1a1 1 0 0 0 0 2h9a1 1 0 1 0 0-2h-9z"></path>
            </svg>
          </button>
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 fill-current text-white" viewBox="0 0 16 16">
              <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path>
            </svg>
            <div className="h-2 w-24 border-2 border-white bg-[#121212] relative">
              <div className="absolute top-0 left-0 h-full w-10 bg-[var(--accent-pink)]"></div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
