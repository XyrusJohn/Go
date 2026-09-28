import mysql from "../config/db.js";

export const createOtp = async (otp, otpExpiry, id) => {
  const updateQuery = `UPDATE users SET edit_otp = ?, edit_otp_expires = ? WHERE id = ?`;

  const [result] = await mysql.execute(updateQuery, [otp, otpExpiry, id]);
  return result || null;
};

export const findUserOtpData = async (email) => {
  const selectQuery = `SELECT id, email, edit_otp, edit_otp_expires FROM users WHERE email = ? LIMIT 1`;

  const [rows] = await mysql.execute(selectQuery, [email]);
  return rows || null;
};

export const clearOtpData = async (id) => {
  const updateQuery = `UPDATE users SET edit_otp = NULL, edit_otp_expires = NULL WHERE id = ?`;

  const [result] = await mysql.execute(updateQuery, [id]);
  return result || null;
};
