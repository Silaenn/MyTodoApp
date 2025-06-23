import React from "react";

const Home = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Finish Report</h3>
            <input type="checkbox" className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-gray-400 text-sm mt-2">Category: Work</p>
          <button className="mt-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
            Play Song
          </button>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Read Book</h3>
            <input type="checkbox" className="h-5 w-5 text-blue-500" />
          </div>
          <p className="text-gray-400 text-sm mt-2">Category: Personal</p>
          <button className="mt-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
            Play Song
          </button>
        </div>
      </div>
      )
    </>
  );
};

export default Home;
