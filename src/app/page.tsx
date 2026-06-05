import HomePage from "@/components/Home";
import { auth } from "@/auth";
import React from "react";

const Home = async () => {
  const session = await auth();
  
  return (
    <>
      <HomePage session={session} />
    </>
  );
};

export default Home;
