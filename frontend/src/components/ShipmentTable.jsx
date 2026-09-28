import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { useShipmentTableStore } from "../store/useShipmentTableStore";

/**
 * ! Renders a standardized table header cell.
 *
 * Centralizing the header structure keeps column alignment and typography
 * consistent across the shipment table.
 */
const HeaderItem = ({ title }) => (
  <th className="h-14 flex items-center justify-center text-[12px] font-extrabold text-black uppercase tracking-wider">
    {title}
  </th>
);

/**
 * ! Renders a standardized shipment data cell.
 *
 * Falls back to "N/A" when the supplied value is missing, preventing
 * incomplete shipment records from breaking the table layout.
 */
const ShipmentCell = ({ value, className = "" }) => {
  if (!value) {
    return (
      <td
        className={`flex items-center justify-center text-gray-400 ${className}`}
      >
        N/A
      </td>
    );
  }

  return (
    <td className={`flex items-center justify-center ${className}`}>{value}</td>
  );
};

/**
 * ! Maps shipment status values to their corresponding visual indicators.
 *
 * The component receives the raw status from the shipment record and
 * converts it into a consistent, human-readable status pill.
 */
const StatusPill = ({ status }) => {
  const pillColorMap = {
    in_transit: "bg-green-100 text-green-700 border-green-200",
    return_to_base: "bg-yellow-100 text-yellow-700 border-yellow-200",
    default: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const statusColor =
    pillColorMap[status?.toLowerCase()] || pillColorMap.default;

  const displayText = status.replace(/_/g, " ");

  return (
    <span
      className={`inline-flex items-center justify-center px-3 h-6 rounded-full font-bold uppercase tracking-wider text-[11px] leading-none border ${statusColor}`}
    >
      {displayText}
    </span>
  );
};

/**
 * *ShipmentTable
 *
 * ! Displays the currently active shipments retrieved from the shipment store.
 *
 * Responsibilities:
 * - Fetch shipment data when the component mounts.
 * - Display loading and empty states.
 * - Render shipment records in a consistent tabular layout.
 * - Provide a collapsible bottom-panel interface for the shipment list.
 *
 * Data flow:
 * useShipmentTableStore
 *        ↓
 * fetchShipment()
 *        ↓
 * shipment state
 *        ↓
 * Loading / Empty / Shipment rows
 */
const ShipmentTable = () => {
  const [showModal, setShowModal] = useState(true);

  const { shipment, isFetchingShipmentTable, fetchShipment } =
    useShipmentTableStore();

  /**
   * ! Initialize the shipment table when reload with the latest shipment data.
   *
   * The store owns the API/data-fetching logic, while this component
   * remains responsible only for presentation and UI state.
   */
  useEffect(() => {
    fetchShipment();
  }, [fetchShipment]);

  return (
    <>
      {/* Collapsed-state trigger shown when the shipment panel is minimized. */}
      <div
        className={`absolute bottom-1 left-1/2 -translate-x-1/2 transition-all duration-500 ease-in-out z-[9999] ${
          showModal
            ? "opacity-0 translate-y-10 pointer-events-none"
            : "opacity-100 translate-y-0 delay-150"
        }`}
      >
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center w-24 h-10 bg-white rounded-md shadow-sm border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-black transition-all cursor-pointer pointer-events-auto"
        >
          <ChevronUp size={28} strokeWidth={1.5} />
        </button>
      </div>

      {/* Main shipment panel containing the table and its controls. */}
      <div
        className={`absolute bottom-6 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-white rounded-3xl shadow-2xl border border-gray-200 p-6 pointer-events-auto z-[9999] flex flex-col transition-all duration-500 ease-in-out ${
          showModal
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20 pointer-events-none"
        }`}
      >
        {/* Panel handle used to collapse the shipment table. */}
        <button
          onClick={() => setShowModal(false)}
          className="flex justify-end mb-6 shrink-0 w-full cursor-pointer hover:opacity-70 transition-opacity"
        >
          <div className="w-3 h-0.5 bg-gray-500 rounded-full"></div>
        </button>

        <div className="border border-gray-200 rounded-2xl flex flex-col flex-1 overflow-hidden bg-white shadow-sm">
          <table className="w-full flex flex-col h-full">
            {/* Fixed table header. Padding accounts for the scrollbar in the body. */}
            <thead
              className="block bg-[#fcfcfc] border-b border-gray-200 shrink-0"
              style={{ paddingRight: "14px" }}
            >
              <tr className="grid grid-cols-6">
                <HeaderItem title="shipment" />
                <HeaderItem title="name" />
                <HeaderItem title="lat/lng" />
                <HeaderItem title="plate no." />
                <HeaderItem title="truck type" />
                <HeaderItem title="status" />
              </tr>
            </thead>

            {/* Scrollable shipment records while keeping the header fixed. */}
            <tbody className="block flex-1 overflow-y-auto custom-scrollbar bg-white">
              {/* Loading state while shipment data is being retrieved. */}
              {isFetchingShipmentTable ? (
                <tr className="absolute inset-0 flex items-center justify-center">
                  <span className="loading loading-dots loading-xl bg-gray-300"></span>
                </tr>
              ) : /* Empty state when no active shipments are available. */
              shipment.length === 0 ? (
                <tr className="absolute inset-0 flex items-center justify-center">
                  <td className="flex flex-col items-center gap-2 text-gray-400">
                    <span className="font-extrabold text-[15px]">
                      No active shipments
                    </span>
                    <span className="text-[12px] font-medium">
                      When trucks are dispatched, they will appear here.
                    </span>
                  </td>
                </tr>
              ) : (
                /* Render each active shipment returned by the store. */
                shipment.map((row, index) => (
                  <tr
                    key={index}
                    className="grid grid-cols-6 h-16 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer text-[14px] font-extrabold text-black"
                  >
                    <ShipmentCell value={row.id} />
                    <ShipmentCell value={row.name} />
                    <ShipmentCell value={row.latLng} />
                    <ShipmentCell value={row.plate} />
                    <ShipmentCell value={row.type} />
                    <ShipmentCell
                      value={
                        row.status ? <StatusPill status={row.status} /> : null
                      }
                    />
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ShipmentTable;
