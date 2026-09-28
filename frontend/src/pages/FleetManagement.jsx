import React from "react";

import Sidebar from "../components/Sidebar.jsx";

const FleetManagement = () => {
  return (
    <div>
      Fleet Management
      <div className="flex h-screen bg-[#0b0f19] text-white">
        <div className="h-full flex flex-col items-center justify-center bg-[#0b0f19]">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};

export default FleetManagement;
