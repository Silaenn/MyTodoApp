"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-[#F5ECD7] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="relative z-10 w-full max-w-md">
        <div className="brutal-card p-10 bg-[#FDFAF4] text-center space-y-8">
          <div>
            <h1 className="text-6xl font-black uppercase italic tracking-tighter mb-2 text-[#1A1208]">
              TASK<span className="text-[#C75B2D]">TUNE</span>
            </h1>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-[#6B5744]">
              Access Controlled Territory
            </p>
          </div>

          <div className="py-8 space-y-6">
            <p className="text-sm font-bold text-[#6B5744]">
              NO REGISTRATION REQUIRED. <br />
              JUST SYNC YOUR FREQUENCY.
            </p>
            
            <Button 
              onClick={() => signIn("google", { callbackUrl: "/tasks" })}
              className="w-full h-16 brutal-btn brutal-btn-primary"
            >
              <LogIn />
              <span className="text-xl font-black uppercase italic">
                SYNC WITH GOOGLE
              </span>
            </Button>
          </div>

          <div className="pt-4 border-t-2 border-[#1A1208]/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-[#6B5744]">
              By syncing, you agree to store your data securely via Auth.js.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-between px-4 text-[#1A1208]/30">
          <span className="text-[8px] font-black uppercase tracking-widest">AUTH_PROTOCOL: Auth.js v5</span>
          <span className="text-[8px] font-black uppercase tracking-widest">SECURE_CHANNEL: ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
