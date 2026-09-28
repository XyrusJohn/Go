import { useEffect, useState } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Box,
  PackageCheck,
  Truck,
  MapPin,
  ShoppingBasket,
  Calendar,
  CircleCheckBig,
} from "lucide-react";

// --- SUB-COMPONENT: Status Step Tracker ---
const StatusStep = ({ icon: Icon, label, isActive }) => (
  <div className="flex items-center gap-2">
    <div
      className={`p-1.5 rounded-md flex items-center justify-center transition-colors duration-300 ${isActive ? "bg-green-100 text-green-800" : "text-gray-400"}`}
    >
      <Icon size={15} />
    </div>
    <span
      className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? "text-gray-800" : "text-gray-400"}`}
    >
      {label}
    </span>
  </div>
);

// --- SUB-COMPONENT: Receipt Row ---
const ReceiptRow = ({ label, value }) => (
  <div className="flex items-end justify-between w-full mb-3 text-[11px]">
    <span className="text-gray-800 font-medium bg-[#f9f9f9] pr-2 relative z-10">
      {label}
    </span>
    <div className="flex-1 border-b-[1.5px] border-dashed border-gray-300 mb-1 mx-1"></div>
    <span className="text-gray-600 bg-[#f9f9f9] pl-2 relative z-10">
      {value || "0"}
    </span>
  </div>
);

// --- SUB-COMPONENT: Accordion Item ---
const ShipmentItem = ({ shipment }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-4 shadow-sm bg-white transition-all">
      <div
        className="p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center text-[11px] text-gray-500 mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />
            <span>Planned Date:</span>
            {shipment.PlanningDate}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar size={13} />
            <span>Delivery Date:</span>
            {shipment.ActualDelDate}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs mb-2">
          <div>
            <span className="font-bold text-gray-900 block mb-0.5">
              Shipment To Party:
            </span>
            <span className="text-gray-600">{shipment.ShipToParty}</span>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <span className="font-bold text-gray-900 block mb-0.5">
                Customer:
              </span>
              <span className="text-gray-600">
                {shipment.ShipToPartyName || "N/A"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-2">
          <div className="text-xs">
            <span className="font-bold text-gray-900 block mb-0.5">
              Address:
            </span>
            <span className="text-gray-600">{shipment.Address}</span>
          </div>
          <button className="text-gray-400 hover:text-gray-700 bg-gray-50 p-1 rounded-md">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isOpen && shipment.Details && shipment.Details.length > 0 && (
        <div className="bg-[#f3f4f6] p-4 space-y-3 border-t border-gray-100 animate-in fade-in slide-in-from-top-1">
          {shipment.Details.map((obd, index) => (
            <div
              key={index}
              className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center"
            >
              <div className="flex flex-col gap-1 w-1/3">
                <span className="text-[10px] font-bold text-gray-500">
                  OBD ITEM:
                </span>
                <span className="text-xs font-semibold text-gray-800">
                  {obd.OBDItems}
                </span>
                <span className="text-[10px] text-gray-400 mt-1">
                  Quantity: {obd.Quantity}
                </span>
              </div>
              <div className="flex flex-col gap-1 w-1/3 items-center justify-center">
                <span className="text-[10px] text-transparent hidden md:block">
                  Spacer
                </span>
                <span className="text-xs font-semibold text-gray-800 hidden md:block">
                  &nbsp;
                </span>
                <span className="text-[10px] text-gray-400 mt-1">
                  Weight: {obd.Weight}
                </span>
              </div>
              <div className="flex flex-col gap-1 w-1/3 text-right">
                <span className="text-[10px] font-bold text-gray-500">
                  TOTAL:
                </span>
                <span className="text-xs font-bold text-gray-900">
                  ₱{obd.Amount?.toLocaleString() || "0"}
                </span>
                <span className="text-[10px] text-gray-400 mt-1">
                  Volume: {obd.Volume}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- MAIN MODAL COMPONENT ---
// TANDAAN: Dinagdag natin ang currentStatus dito sa props
const ShipmentCardModal = ({
  data,
  onClose,
  onAssign,
  isUnassign,
  currentStatus,
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // STATUS PROGRESSION LOGIC
  const statuses = [
    "unassign",
    "assign",
    "loading",
    "loaded",
    "transit",
    "delivered",
  ];
  // Gamitin ang pinasang currentStatus, kung wala, fallback sa status ng data o unassign
  const activeStatus =
    currentStatus || data?.status || (isUnassign ? "unassign" : "assign");
  const currentIndex = statuses.indexOf(activeStatus);

  const totalVolume = data.UnassignedShipment?.reduce(
    (sum, addr) =>
      sum +
      addr.Details.reduce(
        (obdSum, obd) => obdSum + (parseFloat(obd.Volume) || 0),
        0,
      ),
    0,
  ).toFixed(2);

  const totalWeight = data.UnassignedShipment?.reduce(
    (sum, addr) =>
      sum +
      addr.Details.reduce(
        (obdSum, obd) => obdSum + (parseFloat(obd.Weight) || 0),
        0,
      ),
    0,
  ).toFixed(2);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[20px] shadow-2xl w-full max-w-[1000px] h-[85vh] min-h-[600px] relative animate-in fade-in zoom-in-95 duration-200 flex flex-col overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors z-10"
        >
          <X className="w-6 h-6" strokeWidth={1.5} />
        </button>

        <div className="p-8 pb-4 shrink-0">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">
            Shipment Details
          </h2>
        </div>

        <div className="px-8 pb-8 flex flex-col gap-6 flex-1 overflow-hidden">
          {/* TOP PROGRESS BAR */}
          <div className="border border-gray-200 rounded-xl p-5 shrink-0">
            <span className="text-xs font-medium text-gray-500 mb-4 block">
              Shipment Status
            </span>
            <div className="flex items-center justify-between w-full px-2">
              <StatusStep
                icon={CircleCheckBig}
                label="Ready for Assignment"
                isActive={currentIndex >= 0}
              />
              <div className="flex-1 border-t-[1.5px] border-dotted border-gray-300 mx-4"></div>
              <StatusStep
                icon={ClipboardList}
                label="Shipment Assigned"
                isActive={currentIndex >= 1}
              />
              <div className="flex-1 border-t-[1.5px] border-dotted border-gray-300 mx-4"></div>
              <StatusStep
                icon={Box}
                label="Shipment Loading"
                isActive={currentIndex >= 2}
              />
              <div className="flex-1 border-t-[1.5px] border-dotted border-gray-300 mx-4"></div>
              <StatusStep
                icon={PackageCheck}
                label="Shipment Fully Loaded"
                isActive={currentIndex >= 3}
              />
              <div className="flex-1 border-t-[1.5px] border-dotted border-gray-300 mx-4"></div>
              <StatusStep
                icon={Truck}
                label="In Transit"
                isActive={currentIndex >= 4}
              />
              <div className="flex-1 border-t-[1.5px] border-dotted border-gray-300 mx-4"></div>
              <StatusStep
                icon={MapPin}
                label="Delivered"
                isActive={currentIndex >= 5}
              />
            </div>
          </div>

          {/* TWO COLUMN LAYOUT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
            {/* LEFT COLUMN: Shipment Outbound */}
            <div className="lg:col-span-2 border border-gray-200 rounded-xl p-5 flex flex-col h-full overflow-hidden">
              <div className="flex items-center gap-3 mb-4 shrink-0">
                <div className="bg-gray-100 p-2 rounded-lg text-gray-800">
                  <ShoppingBasket size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">
                    Shipment Outbound
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    All Shipment/s Inside this Dispatch
                  </p>
                </div>
              </div>

              <hr className="border-gray-100 mb-5 shrink-0" />

              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {data.UnassignedShipment?.map((shipment, index) => (
                  <ShipmentItem key={index} shipment={shipment} />
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-1 flex flex-col h-full">
              <div
                className="relative bg-[#f9f9f9] rounded-t-xl overflow-hidden shadow-inner flex flex-col pt-8 pb-10 px-6 border-x border-t border-gray-200"
                style={{
                  maskImage:
                    "radial-gradient(circle at 10px 100%, transparent 10px, black 11px)",
                  maskSize: "20px 100%",
                  maskPosition: "bottom",
                  borderBottom: "12px solid transparent",
                }}
              >
                <div className="flex justify-between items-end border-b-[1.5px] border-dashed border-gray-300 pb-2 mb-6 relative z-10 shrink-0">
                  <span className="font-black text-sm text-gray-900">
                    Dispatch Number
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono tracking-tighter">
                    {data.SAPDispatchNumber}
                  </span>
                </div>

                <div className="space-y-1 mb-8 shrink-0">
                  <ReceiptRow label="Route" value={data.Route} />
                  <ReceiptRow label="Quantity" value={data.TotalQuantity} />
                  <ReceiptRow label="Volume" value={totalVolume} />
                  <ReceiptRow label="Weight" value={totalWeight} />
                  <ReceiptRow
                    label="Destination"
                    value={data.TotalDestination}
                  />
                </div>

                <div className="mt-auto pt-6 border-t-[1.5px] border-dashed border-gray-300 flex justify-between items-center relative z-10 shrink-0">
                  <span className="font-black text-gray-900 text-sm">
                    Price:
                  </span>
                  <span className="font-black text-lg text-gray-900 tracking-tight">
                    ₱{" "}
                    {data.TotalAmount?.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }) || "0.00"}
                  </span>
                </div>
              </div>

              <div className="mt-4 shrink-0">
                {isUnassign && (
                  <button
                    onClick={() => {
                      onAssign();
                      console.log("ASSIGNED BUTTON CLICK!");
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-sm py-4 rounded-xl shadow-md transition-all duration-200 active:scale-[0.98] uppercase tracking-wide"
                  >
                    Assign Shipment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentCardModal;
