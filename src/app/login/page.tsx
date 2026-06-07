"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { LogIn, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const floatingVariants = (delay: number) => ({
    initial: { y: 0 },
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay,
      },
    },
  });

  return (
    <div className="min-h-screen bg-[#E8EDE6] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative shapes */}
      <motion.div 
        initial="initial"
        animate="animate"
        variants={floatingVariants(0)}
        className="absolute top-12 left-12 h-24 w-24 rounded-sm border-2 border-[#0F1A0F] bg-[#D4A843] shadow-brutal rotate-12 opacity-60" 
      />
      <motion.div 
        initial="initial"
        animate="animate"
        variants={floatingVariants(1)}
        className="absolute bottom-16 right-16 h-32 w-32 rounded-sm border-2 border-[#0F1A0F] bg-[#3B6B4A] shadow-brutal -rotate-6 opacity-40" 
      />
      <motion.div 
        initial="initial"
        animate="animate"
        variants={floatingVariants(2)}
        className="absolute top-1/3 right-12 h-16 w-16 rounded-sm border-2 border-[#0F1A0F] bg-[#8B4A2B] shadow-brutal-sm rotate-3 opacity-50" 
      />
      <motion.div 
        initial="initial"
        animate="animate"
        variants={floatingVariants(0.5)}
        className="absolute bottom-1/3 left-16 h-12 w-12 rounded-sm border-2 border-[#0F1A0F] bg-[#F5F8F4] shadow-brutal-sm -rotate-12 opacity-70" 
      />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-md border-2 border-[#0F1A0F] bg-[#F5F8F4] p-10 shadow-brutal-lg text-center space-y-8">
          {/* Logo */}
          <motion.div variants={itemVariants}>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-[#0F1A0F]">
              TASK<span className="text-[#3B6B4A]">TUNE</span>
            </h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-brutal text-[#5A6E5A]">
              Productivity. Simplified.
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="border-t-2 border-[#0F1A0F]/20" />

          {/* CTA */}
          <div className="space-y-6">
            <motion.p variants={itemVariants} className="text-sm font-bold text-[#5A6E5A] leading-relaxed">
              No registration required. <br />
              Just sync your frequency.
            </motion.p>
            <motion.button
              variants={itemVariants}
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full inline-flex items-center justify-center gap-3 rounded-md border-2 border-[#0F1A0F] px-6 py-4 text-xl font-black uppercase shadow-brutal
                ${isLoading 
                  ? "bg-[#5A6E5A] text-[#F5F8F4]/50 cursor-not-allowed shadow-none translate-x-0.5 translate-y-0.5 grayscale" 
                  : "bg-[#3B6B4A] text-[#F5F8F4] hover:shadow-brutal-lg hover:-translate-x-px hover:-translate-y-px active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
                }`}
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
            </motion.button>
          </div>

          {/* Footer note */}
          <motion.div variants={itemVariants} className="pt-4 border-t-2 border-[#0F1A0F]/10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5A6E5A]">
              Data secured via Auth.js v5
            </p>
          </motion.div>
        </div>

        {/* Bottom labels */}
        <motion.div 
          variants={itemVariants}
          className="mt-6 flex justify-between px-2"
        >
          <span className="text-[9px] font-bold uppercase tracking-brutal text-[#5A6E5A]">
            Auth: Auth.js v5
          </span>
          <span className="text-[9px] font-bold uppercase tracking-brutal text-[#5A6E5A]">
            Channel: Encrypted
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;