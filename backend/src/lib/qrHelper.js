import crypto from "crypto";

const SECRET_KEY = process.env.SECRET_KEY;

// function to generate QR load
export const generateQrLoad = (tripId) => {
  const timestamp = Date.now();
  const rawData = `SYSU-QR-SCANNER:${tripId}:${timestamp}`;
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(rawData)
    .digest("hex");

  return `${rawData}:${signature}`;
};

// verify QR load request of naive app
export const verifyQrLoad = (qrData, maxAgeInSeconds = 60) => {
  if (!qrData || typeof qrData !== "string") {
    return { valid: false, error: "Invalid QR data" };
  }

  const parts = qrData.split(":");
  if (parts.length !== 4 || parts[0] !== "SYSU-QR-SCANNER") {
    return { valid: false, error: "Invalid QR data" };
  }

  const [prefix, tripId, timestampStr, recievedSignature] = parts;
  const timeStamp = Number(timestampStr);

  const ageInSeconds = (Date.now() - timeStamp) / 1000;
  if (isNaN(ageInSeconds) || ageInSeconds > maxAgeInSeconds) {
    return { valid: false, error: "QR data expired" };
  }

  const expectedSignature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(`${prefix}:${tripId}:${timestampStr}`)
    .digest("hex");
  if (expectedSignature !== recievedSignature) {
    return { valid: false, error: "Invalid QR data" };
  }

  return { valid: true, tripId, timestamp: timeStamp };
};
