import axios from "axios";
import {
  createShipment,
  fetchShipmentAssignment,
  fetchMetricsAssignment,
} from "../models/sap.model.js";

export const getSapData = async (req, res) => {
  try {
    const sapUrl = process.env.SAP_URL;
    console.log("Attempting to Fetch:", sapUrl);
    if (!sapUrl) {
      return res.status(500).json({ error: "SAP_URL is not defined in .env" });
    }

    const sapRes = await axios.get(sapUrl);

    const sapActualData = sapRes.data.d.results;

    // console.log(sapActualData);
    res.json(sapActualData);
  } catch (error) {
    console.error("Error fetching SAP data:", error.message);
    res.status(500).json({ error: "Failed to fetch data from SAP" });
  }
};

export const shipmentRegistration = async (req, res) => {
  const {
    Driver,
    Helper,
    Route,
    SAPDispatchNumber,
    Status,
    TotalAmount,
    TotalDestination,
    TotalObd,
    TotalQuantity,
    TotalVolume,
    TotalWeight,
    TruckType,
    UnassignedShipment,
  } = req.body;
  try {
    if (!SAPDispatchNumber) {
      return res.status(400).json({
        success: false,
        message: "SAP Dispatch Number is required.",
      });
    }
    if (!TruckType || !Status) {
      return res.status(400).json({
        success: false,
        message: "Truck type and Status are required fields.",
      });
    }

    const newShipment = await createShipment({
      Driver,
      Helper,
      Route,
      SAPDispatchNumber,
      Status: Status || "assign",
      TotalAmount: parseFloat(TotalAmount || 0),
      TotalDestination: parseInt(TotalDestination || 0, 10),
      TotalObd: parseInt(TotalObd || 0, 10),
      TotalQuantity: parseFloat(TotalQuantity || 0),
      TotalVolume: parseFloat(TotalVolume || 0),
      TotalWeight: parseFloat(TotalWeight || 0),
      TruckType,
      UnassignedShipment,
    });

    return res.status(201).json({
      success: true,
      message: "Shipment assignment created successfully.",
      data: newShipment,
    });
  } catch (error) {
    console.error("[handleCreateShipment] Controller Error:", error.message);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message:
          "A shipment assignment with this SAP Dispatch Number already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal Server Error while creating shipment.",
      error: error.message,
    });
  }
};

export const getShipmentAssignment = async (req, res) => {
  try {
    const { Status } = req.query;

    if (!Status) {
      return res
        .status(400)
        .json({ success: false, message: "Status Query Parameter Required." });
    }

    const shipmentAssignment = await fetchShipmentAssignment(Status);

    return res.status(200).json({
      success: true,
      message: `Successfully fetched shipments with status: ${Status}`,
      data: shipmentAssignment,
    });
  } catch (error) {
    console.error("[getAssignedShipments] Controller Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching assigned shipments.",
      error: error.message,
    });
  }
};

export const getShipmentMetrics = async (req, res) => {
  try {
    const metrics = await fetchMetricsAssignment();
    return res.status(200).json({ success: true, data: metrics });
  } catch (error) {
    console.error("[getShipmentMetrics] Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
