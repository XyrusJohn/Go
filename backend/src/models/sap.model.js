import mysql from "../config/db.js";

export const createShipment = async ({
  SAPDispatchNumber,
  Driver,
  Helper,
  Route,
  Status,
  TotalAmount,
  TotalDestination,
  TotalObd,
  TotalQuantity,
  TotalVolume,
  TotalWeight,
  TruckType,
  UnassignedShipment,
}) => {
  const insertQuery = `INSERT INTO sap_assignment (
  SAPDispatchNumber,
  Driver,
  Helper,
  Route,
  Status,
  TotalAmount,
  TotalDestination,
  TotalObd,
  TotalQuantity,
  TotalVolume,
  TotalWeight,
  TruckType,
  UnassignedShipment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const [result] = await mysql.execute(insertQuery, [
    SAPDispatchNumber,
    Driver,
    Helper,
    Route,
    Status,
    TotalAmount,
    TotalDestination,
    TotalObd,
    TotalQuantity,
    TotalVolume,
    TotalWeight,
    TruckType,
    JSON.stringify(UnassignedShipment || []),
  ]);

  const newShipmentId = result.insertId;

  return { success: true, id: newShipmentId, SAPDispatchNumber };
};

export const fetchShipmentAssignment = async (Status) => {
  const selectQuery =
    "SELECT * from sap_assignment WHERE Status = ? ORDER BY created_at DESC";

  const [rows] = await mysql.execute(selectQuery, [Status]);
  return rows || [];
};

export const fetchMetricsAssignment = async () => {
  const selectQuery = `SELECT Status, COUNT(id) as count FROM sap_assignment GROUP BY Status`;

  const [rows] = await mysql.execute(selectQuery);
  return rows || [];
};
