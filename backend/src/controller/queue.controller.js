import { verifyQrLoad, generateQrLoad } from "../lib/qrHelper.js";
import {
  findQueueById,
  getActiveDriverJobs,
  applyQueueLock,
} from "../models/queue.model.js";

export const qrGenerator = () => {
  try {
    const qrPayload = generateQrLoad();

    return res.status(200).json({
      success: true,
      qrPayload: qrPayload,
    });
  } catch (error) {
    console.error("Error on qrGenerator controller: ", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const scanAndLock = async (req, res) => {
  try {
    const { qrPayload } = req.body;
    const driverId = req.user.id;

    const verification = verifyQrLoad(qrPayload, 60);
    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.error,
      });
    }

    const activeJobs = await getActiveDriverJobs(driverId);
    if (activeJobs.length > 0) {
      return res.status(400).json({
        success: false,
        message: "The drive has ongoing trip/queue",
      });
    }

    const currentQueue = await findQueueById(verification.tripId);
    if (!currentQueue) {
      return res.status(400).json({
        success: false,
        message: "Cannot find queue",
      });
    }

    const now = new Date();
    if (
      currentQueue.locked_by_driver_id &&
      new Date(currentQueue.lock_expires_at) > now &&
      currentQueue.locked_by_driver_id !== driverId
    ) {
      return res.status(400).json({
        success: false,
        message: "Different driver is registering on this QR",
      });
    }

    if (
      ["registered", "in_transit", "completed"].includes(currentQueue.status)
    ) {
      return res.status(400).json({
        success: false,
        message: "QR queue is already finished or used",
      });
    }

    const locked = await applyQueueLock(currentQueue.id, driverId, 5);
    if (!locked) {
      return res.status(400).json({
        success: false,
        message: "Failed to lock the queue",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Proceed to registration",
      queue: {
        id: currentQueue.id,
        queue_code: currentQueue.queue_code,
        truck_type: currentQueue.truck_type,
      },
    });
  } catch (error) {
    console.error("Error on queue controller: ", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
