import { useAuthStore } from "./../store/useAuthStore.js";
import Sidebar from "../components/Sidebar.jsx";
import MapSection from "../components/MapComponents/MapSection.jsx";
import Navbar from "../components/Navbar.jsx";
import ShipmentTable from "../components/ShipmentTable.jsx";

const Overview = () => {
  const position = [14.676, 121.0437];

  return (
    <>
      <div className="relative h-screen w-full overflow-hidden">
        <Navbar />
        {/* 1. Map acts as the full-screen background */}
        <div className="absolute inset-0 z-0">
          <MapSection position={position} />
        </div>

        {/* 2. Sidebar container floats on top */}
        <div className="absolute top-0 left-0 h-full flex items-center z-[9999] pointer-events-none">
          {/* pointer-events-auto restores clicks ONLY for the actual sidebar UI */}
          <div className="pointer-events-auto">
            <Sidebar />
          </div>
        </div>
        <div>
          <ShipmentTable />
        </div>
      </div>
    </>
  );
};

export default Overview;
