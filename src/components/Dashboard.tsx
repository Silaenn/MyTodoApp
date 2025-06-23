import Link from "next/link";
import React from "react";

const Dashboard = () => {
  return (
    <div className="fixed left-0 top-0 hidden md:block w-64 bg-gray-800 h-screen p-4">
      <h2 className="text-xl mt-2 mb-4">🎧TaskTune</h2>
      <hr className="mb-4" />
      <ul>
        <li className="mb-2">
          <Link href="/" className="hover:text-blue-400">
            Home
          </Link>
        </li>
        <li className="mb-2">
          <a href="/tasks" className="hover:text-blue-400">
            Tasks
          </a>
        </li>
        <li className="mb-2">
          <a href="/musics" className="hover:text-blue-400">
            Music
          </a>
        </li>
        <li className="mb-2">
          <a href="/profile" className="hover:text-blue-400">
            Profile
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Dashboard;
