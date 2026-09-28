import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "./../lib/axios";

// export const payload = [
//   {
//     sapDispatchNumber: "0010137218",
//     driverId: "DRV-2026-001",
//     Driver: "JUAN DELA CRUZ",
//     HelperName: "DELA JUAN CRUZ",
//     plateNumber: "ABC-1234",
//     truckType: "AUV",
//     Status: "delivered",
//     shipments: [
//       {
//         shipToParty: "0010003200",
//         shipToPartyName: "THE MARKETPLACE-CENTURY CITY",
//         address: "LOWER GROUND FLR LG01 CENTURY, 1209, CIT",
//         obdItems: [
//           { obdNumber: "6801004268", amount: 13645.97, quantity: 17 },
//           { obdNumber: "6801004269", amount: 18362.51, quantity: 21 },
//           { obdNumber: "6801004270", amount: 18701.91, quantity: 14 },
//         ],
//       },
//       {
//         shipToParty: "0010003207",
//         shipToPartyName: "ROBINSONS EASYMART-SAN LORENZO PLAC",
//         address: "UNITA13-A16 G/F TOWER3 SAN LORENZO, 1233",
//         obdItems: [
//           { obdNumber: "6801004266", amount: 12893.41, quantity: 16 },
//           { obdNumber: "6801004267", amount: 14287.27, quantity: 16 },
//           { obdNumber: "6801004265", amount: 3998.2, quantity: 4 },
//         ],
//       },
//       {
//         shipToParty: "0010003187",
//         shipToPartyName: "THE MARKETPLACE ALPHALAND",
//         address: "BASEMENT MAKATI PLACA AYALA, 1209, COR M",
//         obdItems: [{ obdNumber: "6801002596", amount: 21134.26, quantity: 17 }],
//       },
//     ],
//   },
// ];

export const useSapRequest = create((set, get) => ({
  // Initial State
  cargoData: [],
  ShipmentAssignmentData: [],
  shipmentMetrics: {},
  isFetchingSapData: false,
  isFetchingMetrics: false,
  isAssignShipment: false,
  _latestRequestId: null,

  fetchSapData: async () => {
    const requestId = Symbol();
    set({ isFetchingSapData: true, _latestRequestId: requestId });

    try {
      const sapRes = await axiosInstance.get("/sap/get-sap-data", {
        withCredentials: true,
      });

      if (get()._latestRequestId === requestId) {
        set({ cargoData: sapRes.data });
      }
    } catch (error) {
      console.log(
        "[fetchSapData] ERROR:",
        error.response?.status,
        error.message,
      );
      toast.error("Failed to load SAP Data");
      if (get()._latestRequestId === requestId) {
        set({ cargoData: [] });
      }
    } finally {
      if (get()._latestRequestId === requestId) {
        set({ isFetchingSapData: false });
      }
    }
  },

  // Get the filtered SAP data
  getUnassignedShipment: () => {
    const { cargoData } = get();

    const allowedTruckType = ["auv", "4w", "6w", "10w", "20f", "40f"];

    const filteredData = cargoData.filter(
      (item) =>
        (!item.Driver ||
          item.Driver.includes("-") ||
          item.Driver.includes("*-*") ||
          item.Driver?.trim().toLowerCase() === "driver") &&
        allowedTruckType.includes(item.TruckType?.trim().toLowerCase()) &&
        item.Delivery !== "DELIVERED" &&
        item.PgiStatus?.trim().toLowerCase() === "x" &&
        item.SAPDispatchNumber &&
        (item.Driver || "").trim().toUpperCase() !== "FOR RE-SO",
    );

    return filteredData;
  },

  assignCargo: () => {
    const unassignShipment = get().getUnassignedShipment();

    const groupShipment = unassignShipment.reduce((basket, item) => {
      const dispatchShipment = item.SAPDispatchNumber;

      const formatDate = (sapDate) => {
        if (!sapDate) return "N/A";

        const cleanDate = sapDate.match(/\d+/);
        if (!cleanDate) return sapDate;

        const date = new Date(parseFloat(cleanDate[0], 10));

        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      };

      const obdDetails = {
        OBDItems: item.OBDNumber,
        Amount: parseFloat(item.Amount || 0),
        Volume: parseFloat(item.Volume || 0),
        Weight: parseFloat(item.Weight || 0),
        Quantity: parseFloat(item.Quantity || 0),
      };

      const shipmentDetails = {
        PlanningDate: formatDate(item.PlanningDate),
        ActualDelDate: formatDate(item.ActualDelDate),
        ShipToParty: item.ShipToParty,
        ShipToPartyName: item.ShipToPartyName.trim().toUpperCase(),
        Address: item.Address.trim().toUpperCase(),
        // Driver: item.Driver ? item.Driver.trim().toUpperCase() : "",
        Pgi: item.PgiStatus ? item.PgiStatus.trim().toUpperCase() : "",
        TruckType: item.TruckType ? item.TruckType.trim().toUpperCase() : "",
        Details: [obdDetails],
      };

      if (!basket[dispatchShipment]) {
        basket[dispatchShipment] = {
          SAPDispatchNumber: item.SAPDispatchNumber,
          TotalDestination: 1,
          TotalOBD: 1,
          Route: item.Route,
          Status: "unassign",
          Helper: [],
          Driver: item.Driver ? item.Driver.trim().toUpperCase() : "",
          UnassignedShipment: [shipmentDetails],
          TruckType: [shipmentDetails.TruckType],
          TotalAmount: parseFloat(item.Amount || 0),
          TotalWeight: parseFloat(item.Weight || 0),
          TotalVolume: parseFloat(item.Volume || 0),
          TotalQuantity: parseFloat(item.Quantity || 0),
        };
      } else {
        const existingCustomer = basket[
          dispatchShipment
        ].UnassignedShipment.find(
          (shipment) => shipment.Address === item.Address.trim().toUpperCase(),
        );

        if (existingCustomer) {
          existingCustomer.Details.push(obdDetails);
        } else {
          basket[dispatchShipment].TotalDestination += 1;
          basket[dispatchShipment].UnassignedShipment.push(shipmentDetails);
        }
        basket[dispatchShipment].TotalOBD += 1;
        // basket[dispatchShipment].TotalAmount += parseFloat(item.Amount || 0);
        basket[dispatchShipment].TotalAmount =
          Math.round(
            (basket[dispatchShipment].TotalAmount + (+item.Amount || 0)) * 100,
          ) / 100;
        basket[dispatchShipment].TotalVolume =
          Math.round(
            (basket[dispatchShipment].TotalVolume + (+item.Volume || 0)) * 100,
          ) / 100;
        basket[dispatchShipment].TotalWeight =
          Math.round(
            (basket[dispatchShipment].TotalWeight + (+item.Weight || 0)) * 100,
          ) / 100;
        basket[dispatchShipment].TotalQuantity =
          Math.round(
            (basket[dispatchShipment].TotalQuantity + (+item.Quantity || 0)) *
              100,
          ) / 100;
      }
      return basket;
    }, {});

    const groupArray = Object.values(groupShipment);

    return {
      ReadyToAssign: groupArray.length,
      Shipment: groupArray,
    };
  },

  registerShipment: async (assignmentAssign) => {
    set({ isAssignShipment: true });

    try {
      const shipmentRegRes = await axiosInstance.post(
        "/sap/shipment-registration",
        assignmentAssign,
        { withCredentials: true },
      );
      toast.success("Shipment successfully assigned!");

      const currentCargoData = get().cargoData;
      const updatedCargoData = currentCargoData.filter(
        (item) => item.SAPDispatchNumber !== assignmentAssign.SAPDispatchNumber,
      );
      set({ cargoData: updatedCargoData });

      return shipmentRegRes.data;
    } catch (error) {
      console.error("[registerShipment] ERROR:", error.message);

      const errorMsg =
        error.response?.data?.message || "Failed to assign shipment";
      toast.error(errorMsg);

      throw error; // Throw error so the UI component knows it failed
    } finally {
      set({ isAssignShipment: false });
    }
  },
  // Takes Shipment Data from the database using req.query
  fetchRegisteredShipment: async (status) => {
    try {
      const shipmentAssignRes = await axiosInstance.get(
        `/sap/shipment-assignment?Status=${status}`,
        { withCredentials: true },
      );
      // Normalize Data that comes from MySQL/Database
      if (shipmentAssignRes.data.success) {
        const normalizedData = shipmentAssignRes.data.data.map((dbRow) => {
          const parsedShipment =
            typeof dbRow.UnassignedShipment === "string"
              ? JSON.parse(dbRow.UnassignedShipment)
              : dbRow.UnassignedShipment;

          return {
            SAPDispatchNumber: dbRow.SAPDispatchNumber,
            Driver: dbRow.Driver,
            HelperName: dbRow.Helper,
            Route: dbRow.Route,
            Status: dbRow.Status,
            TotalAmount: dbRow.TotalAmount,
            TotalDestination: dbRow.TotalDestination,
            TotalOBD: dbRow.TotalObd,
            TotalQuantity: dbRow.TotalQuantity,
            TotalVolume: dbRow.TotalVolume,
            TotalWeight: dbRow.TotalWeight,
            TruckType: [dbRow.TruckType],
            UnassignedShipment: parsedShipment,
          };
        });

        set({ ShipmentAssignmentData: normalizedData });
      }
      console.log(shipmentAssignRes);
    } catch (error) {
      console.error("Error fetching assigned shipments:", error);
      set({ assignedShipmentData: [] });
    }
  },

  fetchShipmentMetrics: async () => {
    set({ isFetchingMetrics: true });
    try {
      const metricsRes = await axiosInstance.get("/sap/metrics", {
        withCredentials: true,
      });

      if (metricsRes.data.success) {
        const formattedMetrics = metricsRes.data.data.reduce(
          (basket, metrics) => {
            basket[metrics.Status] = metrics.count;
            return basket;
          },
          {},
        );
        set({ shipmentMetrics: formattedMetrics });
      }
    } finally {
      set({ isFetchingMetrics: false });
    }
  },
}));
