"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-brutal-neon/10 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-brutal-pink/10 rounded-full blur-[100px] animate-pulse delay-700"></div>

      <div className="relative z-10 w-full max-w-md">
        <div className="brutal-card p-10 bg-brutal-gray text-center space-y-8">
          <div>
            <h1 className="text-6xl font-black uppercase italic tracking-tighter text-stroke-sm mb-2">
              TASK<span className="text-brutal-neon !text-white !italic">TUNE</span>
            </h1>
            <p className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">
              Access Controlled Territory
            </p>
          </div>

          <div className="py-8 space-y-6">
            <p className="text-sm font-bold text-gray-300">
              NO REGISTRATION REQUIRED. <br />
              JUST SYNC YOUR FREQUENCY.
            </p>
            
            <Button 
              onClick={() => signIn("google", { callbackUrl: "/tasks" })}
              className="w-full h-16 bg-white text-black hover:bg-brutal-neon border-4 border-white shadow-brutal flex items-center justify-center gap-4 group"
            >
              <LogIn className="group-hover:rotate-12 transition-transform" />
              <span className="text-xl font-black uppercase italic">
                SYNC WITH GOOGLE
              </span>
            </Button>
          </div>

          <div className="pt-4 border-t-2 border-white/10">
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">
              By syncing, you agree to store your data securely via Auth.js.
            </p>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-8 flex justify-between px-4">
          <span className="text-[8px] font-black uppercase tracking-widest opacity-30">AUTH_PROTOCOL: Auth.js v5</span>
          <span className="text-[8px] font-black uppercase tracking-widest opacity-30">SECURE_CHANNEL: ENCRYPTED</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
