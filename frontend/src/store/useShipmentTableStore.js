import { create } from "zustand";
import toast from "react-hot-toast";

// const shipmentTableRow = [
//   {
//     id: "10135533",
//     name: "Jose P. Rizal",
//     latLng: "14.6760 / 121.0437",
//     plate: "NFN-3123",
//     type: "AUV",
//     status: "in_transit",
//   },
//   {
//     id: "10135534",
//     name: "Andres Bonifacio",
//     latLng: "14.6504 / 121.0300",
//     plate: "XYZ-9876",
//     type: "6-Wheeler",
//     status: "in_transit",
//   },
//   {
//     id: "10135535",
//     name: "Emilio Aguinaldo",
//     latLng: "14.6201 / 121.0500",
//     plate: "ABC-1234",
//     type: "Closed Van",
//     status: "in_transit",
//   },
//   {
//     id: "10135536",
//     name: "Apolinario Mabini",
//     latLng: "14.6802 / 121.0600",
//     plate: "DEF-5678",
//     type: "AUV",
//     status: "return_to_base",
//   },
//   {
//     id: "10135537",
//     name: "Marcelo H. del Pilar",
//     latLng: "14.6905 / 121.0700",
//     plate: "GHI-9012",
//     type: "10-Wheeler",
//   },
//   {
//     id: "10135538",
//     name: "Juan Luna",
//     latLng: "14.6409 / 121.0200",
//     plate: "JKL-3456",
//     type: "Forward",
//   },
//   {
//     id: "10135539",
//     name: "Antonio Luna",
//     latLng: "14.6108 / 121.0100",
//     plate: "MNO-7890",
//     type: "AUV",
//   },
//   {
//     id: "10135540",
//     name: "Gabriela Silang",
//     latLng: "14.6300 / 121.0800",
//     plate: "PQR-1357",
//     type: "Closed Van",
//   },
// ];

export const useShipmentTableStore = create((set) => ({
  // Initial State
  shipment: [],
  isFetchingShipmentTable: true,

  fetchShipment: async () => {
    set({ isFetchingShipmentTable: true });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      set({ shipment: shipmentTableRow });
    } catch (error) {
      console.log("Error in fetchShipments: ", error);
      {
        /* toast.error("Failed to load shipments");*/
      }
      set({ shipment: [] }); // Fallback to empty array on error
    } finally {
      set({ isFetchingShipmentTable: false });
    }
  },
}));
