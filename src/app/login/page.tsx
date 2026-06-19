"use client";
import React, { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { LogIn, Loader2 } from "lucide-react";
import { motion, Variants } from "framer-motion";

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

  const containerVariants: Variants = {
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

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const floatingVariants: (delay: number) => Variants = (delay: number) => ({
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
    <div className="min-h-screen bg-brutal-parchment flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative shapes */}
      <motion.div 
        initial="initial"
        animate="animate"
        variants={floatingVariants(0)}
        className="absolute top-12 left-12 h-24 w-24 rounded-sm border-2 border-brutal-ink bg-brutal-secondary shadow-brutal rotate-12 opacity-60" 
      />
      <motion.div 
        initial="initial"
        animate="animate"
        variants={floatingVariants(1)}
        className="absolute bottom-16 right-16 h-32 w-32 rounded-sm border-2 border-brutal-ink bg-brutal-primary shadow-brutal -rotate-6 opacity-40" 
      />
      <motion.div 
        initial="initial"
        animate="animate"
        variants={floatingVariants(2)}
        className="absolute top-1/3 right-12 h-16 w-16 rounded-sm border-2 border-brutal-ink bg-brutal-accent shadow-brutal-sm rotate-3 opacity-50" 
      />
      <motion.div 
        initial="initial"
        animate="animate"
        variants={floatingVariants(0.5)}
        className="absolute bottom-1/3 left-16 h-12 w-12 rounded-sm border-2 border-brutal-ink bg-brutal-paper shadow-brutal-sm -rotate-12 opacity-70" 
      />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative z-10 w-full max-w-md"
      >
        <div className="rounded-md border-2 border-brutal-ink bg-brutal-paper p-10 shadow-brutal-lg text-center space-y-8">
          {/* Logo */}
          <motion.div variants={itemVariants} className="flex flex-col items-center">
            <div className="mb-4">
              <Image src="/images/logo.png" alt="TaskTune" width={80} height={80} className="md:w-24 md:h-24" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-brutal-ink">
              TASK<span className="text-brutal-primary">TUNE</span>
            </h1>
            <p className="mt-2 text-xs font-bold uppercase tracking-brutal text-brutal-muted">
              Productivity. Simplified.
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div variants={itemVariants} className="border-t-2 border-brutal-ink/20" />

          {/* CTA */}
          <div className="space-y-6">
            <motion.p variants={itemVariants} className="text-sm font-bold text-brutal-muted leading-relaxed">
              No registration required. <br />
              Just sync your frequency.
            </motion.p>
            <motion.button
              variants={itemVariants}
              onClick={handleLogin}
              disabled={isLoading}
              className={`w-full inline-flex items-center justify-center gap-3 rounded-md border-2 border-brutal-ink px-6 py-4 text-xl font-black uppercase shadow-brutal
                ${isLoading 
                  ? "bg-brutal-muted text-brutal-paper/70 cursor-not-allowed shadow-none translate-x-0.5 translate-y-0.5 grayscale" 
                  : "bg-brutal-primary text-brutal-paper hover:shadow-brutal-lg hover:-translate-x-px hover:-translate-y-px active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
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
          <motion.div variants={itemVariants} className="pt-4 border-t-2 border-brutal-ink/10">
            <p className="text-tiny font-bold uppercase tracking-widest text-brutal-muted">
              Data secured via Auth.js v5
            </p>
          </motion.div>
        </div>

        {/* Bottom labels */}
        <motion.div 
          variants={itemVariants}
          className="mt-6 flex justify-between px-2"
        >
          <span className="text-tiny font-bold uppercase tracking-brutal text-brutal-muted">
            Auth: Auth.js v5
          </span>
          <span className="text-tiny font-bold uppercase tracking-brutal text-brutal-muted">
            Channel: Encrypted
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;