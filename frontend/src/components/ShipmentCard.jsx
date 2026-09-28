import { useState } from "react";
import auvImage from "../assets/AUV.png";
import fourWheelImage from "../assets/4W.png";
import sixWheelImage from "../assets/6W.png";
import tenWheelImage from "../assets/10W.png";
import twentyFootImage from "../assets/20F.png";
import fortyFootImage from "../assets/40F.png";

const truckConfig = {
  AUV: {
    src: auvImage,
    className: "absolute -right-3 -top-0.5 w-56",
  },
  "4W": {
    src: fourWheelImage,
    className: "absolute -right-3 -top-0.5 w-56",
  },
  "6W": {
    src: sixWheelImage,
    className: "absolute right-8 top-1.5 w-50",
  },
  "10W": {
    src: tenWheelImage,
    className: "absolute right-5 -top-0.5 w-56",
  },
  "20F": {
    src: twentyFootImage,
    className: "absolute -right-3 -top-0.5 w-56",
  },
  "40F": {
    src: fortyFootImage,
    className: "absolute right-8 -top-0.5 w-56",
  },
};

const statusStyles = {
  UNASSIGN: {
    dot: "bg-red-500",
    ring: "text-red-500",
    text: "text-red-600",
    progress: "0",
    isPulsing: true,
  },
  ASSIGN: {
    dot: "bg-orange-500",
    ring: "text-orange-500",
    text: "text-orange-600",
    progress: "20",
    isPulsing: true,
  },
  LOADING: {
    dot: "bg-yellow-500",
    ring: "text-yellow-500",
    text: "text-yellow-700",
    progress: "40",
    isPulsing: true,
  },
  LOADED: {
    dot: "bg-blue-500",
    ring: "text-blue-500",
    text: "text-blue-700",
    progress: "60",
    isPulsing: true,
  },
  TRANSIT: {
    dot: "bg-violet-500",
    ring: "text-violet-500",
    text: "text-green-700",
    progress: "80",
    isPulsing: true,
  },
  DELIVERED: {
    dot: "bg-green-500",
    ring: "text-green-500",
    text: "text-gray-900",
    progress: "100",
    isPulsing: true,
  },
  UNKNOWN: {
    dot: "bg-gray-400",
    ring: "text-gray-400",
    text: "text-gray-900",
    isPulsing: false,
  },
};

const ShipmentCard = ({ dispatch, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!dispatch)
    return <div className="p-4 text-sm text-gray-500">Loading card...</div>;

  const dispatchNumber = dispatch.SAPDispatchNumber || "N/A";
  let currentStatus = dispatch.Status.trim().toUpperCase() || "UNKNOWN";
  const route = dispatch.Route || "N/A";
  const truckType = dispatch.TruckType || "N/A";
  const driverName = dispatch.Driver || "DRIVER";
  const pgiStatus = dispatch.UnassignedShipment?.[0]?.Pgi || "";
  const helperName = dispatch.HelperName || "NO HELPER";
  const plateNumber = dispatch.Plate || "UNASSIGNED";
  // const progress = statusStyles[currentStatus.progress];

  // Total items / OBD count
  const totalOBD = dispatch.TotalOBD || 0;
  const totalDestination = dispatch.TotalDestination || 0;

  const hasNoDriver = !dispatch.Driver || dispatch.Driver.trim() === "";

  if (pgiStatus === "X" && hasNoDriver && currentStatus !== "ASSIGN") {
    currentStatus = "UNASSIGN";
  }

  const styleConfig = statusStyles[currentStatus] || statusStyles["UNKNOWN"];

  const progress = styleConfig.progress || 0;

  const currentTruck = truckConfig[truckType] || {
    src: "",
    className: "absolute -right-16 -top-2 w-56", // Default fallback styling
  };

  return (
    <div
      onClick={onClick}
      className="relative bg-[#F3F4F6] rounded-2xl p-5 w-full max-w-[340px] overflow-hidden flex flex-col justify-between h-[250px]
  cursor-pointer
  transition-all duration-300 ease-in-out
  hover:bg-gray-100 hover:-translate-y-1.5 hover:shadow-xl hover:border-gray-200 border border-transparent"
    >
      {/* 1. STATUS PILL (Top Left) */}
      <div className="absolute top-5 left-5 bg-white px-2.5 py-1.5 rounded-md shadow-sm z-10 flex items-center space-x-1.5 h-6">
        {styleConfig.isPulsing ? (
          <div className="relative flex items-center justify-center w-3 h-3">
            <span
              className={`absolute loading loading-ring loading-xs ${styleConfig.ring}`}
            ></span>
            <div
              className={`w-1 h-1 rounded-full ${styleConfig.dot} z-10`}
            ></div>
          </div>
        ) : (
          <div className={`w-1.5 h-1.5 rounded-full ${styleConfig.dot}`}></div>
        )}

        <span className="text-[10px] font-bold text-black">
          {currentStatus}
        </span>
      </div>

      <div className="absolute top-2 right-5 bg-white px-3 py-2 rounded-md shadow-sm z-20 flex items-center justify-center min-w-[36px]">
        <span className="text-sm font-black text-gray-900 tracking-tight">
          {totalOBD}
        </span>
      </div>

      {/* TRUCK IMAGE WITH SKELETON LOADER */}
      <div
        className={`absolute -right-16 -top-2 w-56 h-36 z-0 flex items-center justify-center pointer-events-none`}
      >
        {!imageLoaded && (
          <div className="skeleton absolute right-20 top-16 w-20 h-20 bg-gray-200/100 rounded-xl animate-pulse"></div>
        )}

        <img
          src={currentTruck.src}
          alt={`${truckType} Truck`}
          onLoad={() => setImageLoaded(true)}
          className={`${currentTruck.className} object-contain drop-shadow-xl transition-opacity duration-500 ${
            imageLoaded ? "opacity-90" : "opacity-0"
          }`}
        />
      </div>

      {/* PLATE NUMBER & TRUCK TYPE */}
      <div className="flex flex-col mt-14 z-10">
        <h2 className="text-xl font-black text-gray-900 tracking-tight">
          {plateNumber}
        </h2>
        <p className="text-[13px] text-gray-500 font-medium uppercase mt-0.5">
          {truckType}
        </p>
        <span className="text-[10px] font-medium text-gray-600 truncate max-w-[150px]">
          {route}
        </span>
        <span className="text-[10px] font-medium text-gray-600 truncate max-w-[150px]">
          DESTINATION:{" "}
          <strong className="text-[13px]">{totalDestination}</strong>
        </span>
      </div>

      {/* BOTTOM WHITE BOX (Driver, Dispatch #, Progress) */}
      <div className="bg-white rounded-xl px-4 py-2.5 mt-2 z-10 shadow-sm">
        {/* Row 1: Names and Dispatch ID */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-medium text-gray-600 truncate max-w-[200px]">
            {driverName} • {helperName}
          </span>

          <span className="text-[10px] text-gray-500 font-mono tracking-tighter">
            # {dispatchNumber}
          </span>
        </div>

        {/* Row 2: Progress Text */}
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-[10px] font-bold text-gray-400">
            Progress Status
          </span>
          <span className="text-[10px] font-bold text-gray-400">
            {progress}%
          </span>
        </div>

        {/* Row 3: Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-[#00C800] h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentCard;
