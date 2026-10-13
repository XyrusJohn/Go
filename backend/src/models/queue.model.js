import mysql from "../config/db.js";

// Queue status ['pending', 'locked', 'registered', 'in_transit' ,'completed', 'cancelled']

export const findQueueById = async (queueId) => {
  const selectQuery = "SELECT * FROM queues WHERE id = ? OR queue_code = ?";

  const [rows] = await mysql.execute(selectQuery, [queueId, queueId]);
  return rows[0] || null;
};

export const getActiveDriverJobs = async (driverId) => {
  const selectQuery =
    "SELECT id FROM queues WHERE driver_id = ? AND status IN ('locked', 'registered', 'in_transit')";
  const [rows] = await mysql.execute(selectQuery, [driverId]);

  return rows;
};

export const applyQueueLock = async (queueId, driverId, lockMinute = 5) => {
  const updateQuery =
    "UPDATE queues SET locked_by_driver_id = ?, lock_expires_at = DATE_ADD(NOW(), INTERVAL ? MINUTE), status = 'locked' WHERE id = ?";

  const [result] = await mysql.execute(updateQuery, [
    driverId,
    lockMinute,
    queueId,
  ]);

  return result.affectedRows > 0;
};

export const confirmQueueRegistration = async (queueId, driverId) => {
  const updateQuery =
    "UPDATE queues SET driver_id = ?, status = 'registered', scanned_at = NOW(), locked_by_driver_id = NULL, lock_expires_at = NULL WHERE id = ? AND locked_by_driver_id = ?";

  const [result] = await mysql.execute(updateQuery, [
    driverId,
    queueId,
    driverId,
  ]);

  return result.affectedRows > 0;
};
