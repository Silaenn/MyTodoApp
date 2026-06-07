"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { LogIn, Loader2 } from "lucide-react";

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Login failed:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8EDE6] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-12 left-12 h-24 w-24 rounded-sm border-2 border-[#0F1A0F] bg-[#D4A843] shadow-[4px_4px_0px_#0F1A0F] rotate-12 opacity-60" />
      <div className="absolute bottom-16 right-16 h-32 w-32 rounded-sm border-2 border-[#0F1A0F] bg-[#3B6B4A] shadow-[4px_4px_0px_#0F1A0F] -rotate-6 opacity-40" />
      <div className="absolute top-1/3 right-12 h-16 w-16 rounded-sm border-2 border-[#0F1A0F] bg-[#8B4A2B] shadow-[3px_3px_0px_#0F1A0F] rotate-3 opacity-50" />
      <div className="absolute bottom-1/3 left-16 h-12 w-12 rounded-sm border-2 border-[#0F1A0F] bg-[#F5F8F4] shadow-[3px_3px_0px_#0F1A0F] -rotate-12 opacity-70" />

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-md border-2 border-[#0F1A0F] bg-[#F5F8F4] p-10 shadow-[8px_8px_0px_#0F1A0F] text-center space-y-8">
          {/* Logo */}
          <div>
            <h1 className="text-6xl font-black uppercase italic tracking-tighter text-[#0F1A0F]">
              TASK<span className="text-[#3B6B4A]">TUNE</span>
            </h1>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.4em] text-[#5A6E5A]">
              Productivity. Simplified.
            </p>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-[#0F1A0F]/20" />

          {/* CTA */}
          <div className="space-y-6">
            <p className="text-sm font-bold text-[#5A6E5A] leading-relaxed">
              No registration required. <br />
              Just sync your frequency.
            </p>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-3 rounded-md border-2 border-[#0F1A0F] bg-[#3B6B4A] px-6 py-4 text-xl font-black uppercase italic text-[#F5F8F4] shadow-[5px_5px_0px_#0F1A0F] transition-all hover:shadow-[7px_7px_0px_#0F1A0F] hover:-translate-x-px hover:-translate-y-px active:shadow-[2px_2px_0px_#0F1A0F] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:translate-x-0 disabled:active:translate-y-0"
            >
              {isLoading ? (
                <>
                  <Loader2 size={22} className="stroke-[3px] animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <LogIn size={22} className="stroke-[3px]" />
                  Sync with Google
                </>
              )}
            </button>
          </div>

          {/* Footer note */}
          <div className="pt-4 border-t-2 border-[#0F1A0F]/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#5A6E5A]">
              Data secured via Auth.js v5
            </p>
          </div>
        </div>

        {/* Bottom labels */}
        <div className="mt-6 flex justify-between px-2">
          <span className="text-[9px] font-black uppercase tracking-widest text-[#0F1A0F]/30">
            Auth: Auth.js v5
          </span>
          <span className="text-[9px] font-black uppercase tracking-widest text-[#0F1A0F]/30">
            Channel: Encrypted
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;