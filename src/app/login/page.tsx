"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#F5ECD7] flex flex-col items-center justify-center p-4 relative overflow-hidden">

      {/* Decorative shapes */}
      <div className="absolute top-12 left-12 h-24 w-24 rounded-sm border-2 border-[#1A1208] bg-[#E8A838] shadow-[4px_4px_0px_#1A1208] rotate-12 opacity-60" />
      <div className="absolute bottom-16 right-16 h-32 w-32 rounded-sm border-2 border-[#1A1208] bg-[#C75B2D] shadow-[4px_4px_0px_#1A1208] -rotate-6 opacity-40" />
      <div className="absolute top-1/3 right-12 h-16 w-16 rounded-sm border-2 border-[#1A1208] bg-[#4A7C59] shadow-[3px_3px_0px_#1A1208] rotate-3 opacity-50" />
      <div className="absolute bottom-1/3 left-16 h-12 w-12 rounded-sm border-2 border-[#1A1208] bg-[#FDFAF4] shadow-[3px_3px_0px_#1A1208] -rotate-12 opacity-70" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-md border-2 border-[#1A1208] bg-[#FDFAF4] p-10 shadow-[8px_8px_0px_#1A1208] text-center space-y-8">

          {/* Logo */}
          <div>
            <h1 className="text-6xl font-black uppercase italic tracking-tighter text-[#1A1208]">
              TASK<span className="text-[#C75B2D]">TUNE</span>
            </h1>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.4em] text-[#6B5744]">
              Productivity. Simplified.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-[#1A1208]/20" />

          {/* CTA */}
          <div className="space-y-6">
            <p className="text-sm font-bold text-[#6B5744] leading-relaxed">
              No registration required. <br />
              Just sync your frequency.
            </p>

            <button
              onClick={() => signIn("google", { callbackUrl: "/tasks" })}
              className="w-full inline-flex items-center justify-center gap-3 rounded-md border-2 border-[#1A1208] bg-[#C75B2D] px-6 py-4 text-xl font-black uppercase italic text-[#FDFAF4] shadow-[5px_5px_0px_#1A1208] transition-all hover:shadow-[7px_7px_0px_#1A1208] hover:-translate-x-px hover:-translate-y-px active:shadow-[2px_2px_0px_#1A1208] active:translate-x-0.5 active:translate-y-0.5"
            >
              <LogIn size={22} className="stroke-[3px]" />
              Sync with Google
            </button>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t-2 border-[#1A1208]/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#6B5744]">
              Data secured via Auth.js v5
            </p>
          </div>
        </div>

        {/* Bottom labels */}
        <div className="mt-6 flex justify-between px-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#1A1208]/30">
            Auth: Auth.js v5
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-[#1A1208]/30">
            Channel: Encrypted
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;