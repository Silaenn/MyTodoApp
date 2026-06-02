import AuthForm from "@/components/AuthForm";
import React from "react";

const page = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black py-12 sm:px-6 lg:px-8 px-6 overflow-hidden">
      {/* Abstract Brutalist Decoration */}
      <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] border-8 border-[var(--accent-neon)] opacity-10 rotate-45 pointer-events-none"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-[25%] h-[25%] border-8 border-white opacity-10 -rotate-12 pointer-events-none"></div>

      <div className="relative z-10 w-full">
        <AuthForm />
      </div>
    </div>
  );
};

export default page;
