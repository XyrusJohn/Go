import { useEffect, useMemo, useState } from "react";
import { useSapRequest } from "../store/useSapRequest.js";
import Sidebar from "./../components/Sidebar";
import Navbar from "./../components/Navbar";
import { useAuthStore } from "../store/useAuthStore.js";
import ShipmentCard from "../components/ShipmentCard.jsx";
import ShipmentCardModal from "../components/ShipmentCardModal.jsx";

import { X } from "lucide-react";

const Dispatch = () => {
  const [selectTruckType, setSelectedTruckType] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedShipment, setSelectedShipment] = useState(null);

  const [selectStatus, setSelectStatus] = useState("unassign");

  const {
    fetchSapData,
    isFetchingSapData,
    isFetchingMetrics,
    assignCargo,
    cargoData,
    registerShipment,
    fetchRegisteredShipment,
    ShipmentAssignmentData,
    fetchShipmentMetrics,
    shipmentMetrics,
  } = useSapRequest();

  const { isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    if (!isCheckingAuth && authUser) {
      fetchSapData();
      fetchShipmentMetrics();
    }
    if (selectStatus !== "unassign") {
      fetchRegisteredShipment(selectStatus);
    }
  }, [
    fetchSapData,
    fetchRegisteredShipment,
    fetchShipmentMetrics,
    isCheckingAuth,
    authUser,
    selectStatus,
  ]);

  const unassignedData = useMemo(() => assignCargo(), [cargoData]);

  const rawDataToFilter =
    selectStatus === "unassign"
      ? unassignedData?.Shipment
      : ShipmentAssignmentData;

  const filteredShipment = (rawDataToFilter || [])?.filter((dispatch) => {
    const matchedTruckType =
      selectTruckType === "All" ||
      dispatch?.TruckType?.[0] === selectTruckType ||
      dispatch?.TruckType === selectTruckType;

    const query = searchQuery.toLowerCase();

    const matchedSearch =
      query === "" ||
      dispatch?.SAPDispatchNumber?.toLowerCase().includes(query) ||
      dispatch?.Driver?.toLowerCase().includes(query) ||
      dispatch?.Route?.toLowerCase().includes(query) ||
      dispatch?.Plate?.toLowerCase().includes(query);

    return matchedTruckType && matchedSearch;
  });

  console.log("RAW DATA", cargoData);
  // console.log("UNASSIGNED", unassignedData);
  console.log("FILTERED", filteredShipment);
  console.log("SHIPMENT METRICS", shipmentMetrics);
  // console.log("PAYLOAD", payload);

  const handleRegisterShipment = async (shipmentData) => {
    const payload = {
      SAPDispatchNumber: shipmentData.SAPDispatchNumber,
      Driver: shipmentData.Driver || "",
      Helper: shipmentData.Helper?.join(", ") || "",
      Route: shipmentData.Route,
      Status: "assign",
      TotalAmount: shipmentData.TotalAmount,
      TotalDestination: shipmentData.TotalDestination,
      TotalObd: shipmentData.TotalOBD,
      TotalQuantity: shipmentData.TotalQuantity,
      TotalVolume: shipmentData.TotalVolume,
      TotalWeight: shipmentData.TotalWeight,
      TruckType: shipmentData.TruckType?.[0] || "",
      UnassignedShipment: shipmentData.UnassignedShipment,
    };

    try {
      await registerShipment(payload);
      setSelectedShipment(null);
    } catch (error) {
      console.error("Failed to assign shipment:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans text-gray-900 overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CONTAINER */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* TOP NAVBAR */}
        <Navbar />

        {/* DASHBOARD CONTENT */}
        <main className="flex-1 flex flex-col p-8 overflow-hidden">
          {/* Page Title & Sync Indicator */}
          <div className="mb-6 mt-8 flex justify-between items-center shrink-0">
            <h1 className="text-[32px] font-black tracking-tight">DISPATCH</h1>
            {isFetchingSapData && (
              <span className="text-sm font-bold text-gray-500 animate-pulse">
                Syncing SAP Data...
              </span>
            )}
          </div>

          {/* 5 METRIC CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8 shrink-0">
            {/* Card 1 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center shadow-sm h-40">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-1">
                All Shipments
              </h3>
              {isFetchingMetrics ? (
                <div className="w-16 h-16 bg-gray-200/80 rounded-xl animate-pulse mt-2"></div>
              ) : (
                <p className="text-[64px] font-black leading-none text-gray-900 mt-2">
                  {shipmentMetrics?.delivered || 0}
                </p>
              )}
              {/* <p className="text-[10px] text-gray-400 mt-2">
                All Delivered Shipments
              </p> */}
            </div>

            {/* Card 2 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center shadow-sm h-40">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-1">
                In Transit
              </h3>
              {isFetchingMetrics ? (
                <div className="w-16 h-16 bg-gray-200/80 rounded-xl animate-pulse mt-2"></div>
              ) : (
                <p className="text-[64px] font-black leading-none text-gray-900 mt-2">
                  {shipmentMetrics?.transit || 0}
                </p>
              )}
            </div>

            {/* Card 3 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center shadow-sm h-40">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-1">
                Fully Loaded
              </h3>
              {isFetchingMetrics ? (
                <div className="w-16 h-16 bg-gray-200/80 rounded-xl animate-pulse mt-2"></div>
              ) : (
                <p className="text-[64px] font-black leading-none text-gray-900 mt-2">
                  {shipmentMetrics?.loaded || 0}
                </p>
              )}
            </div>

            {/* Card 4 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center shadow-sm h-40">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-1">
                Loading
              </h3>
              {isFetchingMetrics ? (
                <div className="w-16 h-16 bg-gray-200/80 rounded-xl animate-pulse mt-2"></div>
              ) : (
                <p className="text-[64px] font-black leading-none text-gray-900 mt-2">
                  {shipmentMetrics?.loading || 0}
                </p>
              )}
            </div>

            {/* Card 5 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center shadow-sm h-40">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-1">
                Assign
              </h3>
              {isFetchingMetrics ? (
                <div className="w-16 h-16 bg-gray-200/80 rounded-xl animate-pulse mt-2"></div>
              ) : (
                <p className="text-[64px] font-black leading-none text-gray-900 mt-2">
                  {shipmentMetrics?.assign || 0}
                </p>
              )}
            </div>

            {/* Card 6 */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center shadow-sm h-40">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-900 mb-1">
                Unassigned
              </h3>
              <div className="flex flex-col items-center justify-center text-[64px] font-black leading-none text-gray-900 mt-2">
                {isFetchingSapData ? (
                  <div className="w-16 h-16 bg-gray-200/80 rounded-xl animate-pulse"></div>
                ) : (
                  unassignedData?.Shipment?.length || 0
                )}
                {/* <div className="mt-3">
                  {isFetchingSapData ? (
                    <div className="w-24 h-4 bg-gray-200/80 rounded-md animate-pulse"></div>
                  ) : (
                    <p className="text-[12px] text-gray-400">
                      {selectTruckType === "All"
                        ? "All Truck Type"
                        : `${selectTruckType}`}
                    </p>
                  )}
                </div> */}
              </div>
            </div>
          </div>

          {/* CARGO DETAILS SECTION */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm flex-1 flex flex-col min-h-0">
            <div className="p-4 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 shrink-0">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 w-full md:w-auto">
                <h2 className="text-sm font-black uppercase tracking-tight text-gray-900 shrink-0">
                  Cargo Details
                </h2>

                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </span>
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    type="text"
                    placeholder="Search for Shipment ID, Driver's Name, Plate #"
                    className="w-full pl-9 pr-4 py-1.5 border border-gray-300 rounded-md text-[11px] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-red-500 transition-colors"
                      aria-label="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* RIGHT GROUP: STATUS DROP DOWN*/}
              <div className="flex flex-row gap-20">
                <div className="flex items-center gap-2 shrink-0">
                  <label
                    htmlFor="truck-type-filter"
                    className="text-[11px] font-semibold text-gray-600 whitespace-nowrap"
                  >
                    Status
                  </label>

                  <div className="relative">
                    <select
                      id="status-filter"
                      value={selectStatus}
                      onChange={(e) => {
                        setSelectStatus(e.target.value);
                      }}
                      className="
        appearance-none
        min-w-[110px]
        rounded-lg
        border border-gray-200
        bg-white
        py-2 pl-3 pr-8
        text-[11px]
        font-semibold
        text-gray-700
        shadow-sm
        outline-none
        cursor-pointer
        transition-all
        duration-150
        hover:border-gray-300
        hover:bg-gray-50
        focus:border-gray-400
        focus:ring-2
        focus:ring-gray-100
      "
                    >
                      <option value="unassign">Unassigned</option>
                      <option value="assign">Assignment</option>
                      <option value="loading">Loading</option>
                      <option value="loaded">Loaded</option>
                      <option value="transit">Transit</option>
                      <option value="delivered">Delivered</option>
                    </select>

                    {/* Custom dropdown arrow */}
                    <svg
                      className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19 9-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* RIGHT GROUP: TRUCK TYPE DROP DOWN */}
                <div className="flex items-center gap-2 shrink-0">
                  <label
                    htmlFor="truck-type-filter"
                    className="text-[11px] font-semibold text-gray-600 whitespace-nowrap"
                  >
                    Truck Type
                  </label>

                  <div className="relative">
                    <select
                      id="truck-type-filter"
                      value={selectTruckType}
                      onChange={(e) => {
                        setSelectedTruckType(e.target.value);
                      }}
                      className="
        appearance-none
        min-w-[5px]
        rounded-lg
        border border-gray-200
        bg-white
        py-2 pl-3 pr-8
        text-[12px]
        font-semibold
        text-gray-700
        shadow-sm
        outline-none
        cursor-pointer
        transition-all
        duration-150
        hover:border-gray-300
        hover:bg-gray-50
        focus:border-gray-400
        focus:ring-2
        focus:ring-gray-100
      "
                    >
                      <option value="All">All</option>
                      <option value="AUV">AUV</option>
                      <option value="4W">4W</option>
                      <option value="6W">6W</option>
                      <option value="10W">10W</option>
                      <option value="20F">20F</option>
                      <option value="40F">40F</option>
                    </select>

                    {/* Custom dropdown arrow */}
                    <svg
                      className="pointer-events-none absolute right-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m19 9-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* CARDS GRID AREA (Scrollable) */}
            <div className="flex-1 p-8 border-t border-gray-100 overflow-y-auto">
              {isFetchingSapData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="relative bg-gray-200/70 rounded-2xl p-5 w-full max-w-[340px] h-[250px] overflow-hidden flex flex-col justify-between animate-pulse"
                    >
                      <div className="w-20 h-6 bg-gray-300 rounded-md"></div>

                      <div className="absolute top-5 right-5 w-9 h-8 bg-gray-300 rounded-xl"></div>
                      <div className="mt-4 space-y-2">
                        <div className="w-28 h-5 bg-gray-300 rounded"></div>

                        <div className="w-16 h-2 bg-gray-300 rounded"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded"></div>
                        <div className="w-16 h-2 bg-gray-300 rounded"></div>
                      </div>
                      <div className="bg-white/80 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between">
                          <div className="w-32 h-3 bg-gray-200 rounded"></div>
                          <div className="w-16 h-3 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex justify-between">
                          <div className="w-20 h-2.5 bg-gray-200 rounded"></div>
                          <div className="w-8 h-2.5 bg-gray-200 rounded"></div>
                        </div>
                        <div className="w-full bg-gray-200 h-1.5 rounded-full"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : !filteredShipment || filteredShipment.length === 0 ? (
                <div className="flex items-center justify-center h-48 text-gray-400 text-sm font-medium">
                  No shipments available.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
                  {filteredShipment.map((dispatch, index) => {
                    return (
                      <ShipmentCard
                        dispatch={dispatch}
                        key={index}
                        onClick={() => {
                          setSelectedShipment(dispatch);
                          console.log(
                            "this shipment card is selected",
                            dispatch,
                          );
                        }}
                      />
                    );
                  })}
                  {selectedShipment && (
                    <ShipmentCardModal
                      data={selectedShipment}
                      currentStatus={selectStatus}
                      isUnassign={selectStatus === "unassign"}
                      onClose={() => setSelectedShipment(null)}
                      onAssign={() => handleRegisterShipment(selectedShipment)}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dispatch;
