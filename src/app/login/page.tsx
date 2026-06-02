import AuthForm from "@/components/AuthForm";
import React from "react";

const page = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-black py-12 sm:px-6 lg:px-8 px-6 overflow-hidden">
      {/* Abstract Brutalist Decoration */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] border-8 border-white opacity-10 rotate-12 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] border-8 border-[var(--accent-pink)] opacity-10 -rotate-12 pointer-events-none"></div>
      
      <div className="relative z-10 w-full">
        <AuthForm />
      </div>
    </div>
  );
};

export default page;
