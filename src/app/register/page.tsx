import AuthForm from "@/components/AuthForm";
import React from "react";

const page = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-[url('/images/BackgroundLogin.png')] bg-cover bg-center bg-no-repeat py-12 sm:px-6 lg:px-8 px-6">
      <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
      <div className="relative z-10 w-full">
        <AuthForm />
      </div>
    </div>
  );
};

export default page;
