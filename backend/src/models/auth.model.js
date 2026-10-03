import mysql from "../config/db.js";

const getRolePrefix = (role) => {
  const prefixes = {
    staff: "s",
    driver: "d",
    admin: "a",
    super_admin: "sa",
  };
  return prefixes[role] || "u";
};

/**
 * * Register's user on database
 * ! @param {Object} input userData
 * ? @return {Promise<Object|Number>} Registration must output a ID number
 **/
// Change: Takes first 2 chars to lastName and add user ID to username
export const createUser = async ({
  role = "staff",
  lastName,
  firstName,
  middleInitial,
  email,
  password,
}) => {
  const insertQuery = `INSERT INTO users (role, lastName, firstName, middleInitial, email, password) VALUES (?, ?, ?, ?, ?, ?)`;

  const [result] = await mysql.execute(insertQuery, [
    role,
    lastName,
    firstName,
    middleInitial,
    email,
    password,
  ]);

  const newUserId = result.insertId;
  const generatedUsername = `${lastName.slice(0, 2).toUpperCase()}${newUserId}`;

  const updateQuery = `UPDATE users SET username = ? WHERE id= ?`;
  await mysql.execute(updateQuery, [generatedUsername, newUserId]);

  return { id: newUserId, username: generatedUsername };
};

/**
 * * Find user via username and email
 * ! @param {String} call the parameter as identifier
 * ? @return {Promise<Object|null>} Check if theres duplicate of username || email
 **/

export const findUserByIdentifier = async (identifier) => {
  const selectQuery = `SELECT id, username, lastName, firstName, middleInitial, email, password, created_at FROM users
  WHERE email = ? OR username = ?
  LIMIT 1
`;

  const [rows] = await mysql.execute(selectQuery, [identifier, identifier]);
  return rows[0] || null;
};
// Need ko din ba lagyan to ng profile_picture sa pag select ng query?
export const findUserById = async (id) => {
  const selectQuery = `SELECT id, username, role, lastName, firstName, middleInitial, email, password, created_at, profile_picture, status FROM users
  WHERE id = ?
  LIMIT 1
`;

  const [rows] = await mysql.execute(selectQuery, [id]);
  return rows[0] || null;
};

export const updateUserProfileData = async (id, data) => {
  const { lastName, firstName, middleInitial, phoneNumber, email } = data;

  const updateQuery = `UPDATE users SET lastName = ?, firstName = ?, middleInitial = ?, phoneNumber =?, email = ? WHERE id = ? `;

  const [result] = await mysql.execute(updateQuery, [
    lastName,
    firstName,
    middleInitial || null,
    phoneNumber || null,
    email,
    id,
  ]);
  return result || null;
};

export const updateUserPasswordData = async (id, hashedPassword) => {
  const updateQuery = `UPDATE users SET password = ? WHERE id = ? `;

  const [result] = await mysql.execute(updateQuery, [hashedPassword, id]);
  return result || null;
};

export const updateProfilePicture = async (id, profilePicUrl) => {
  const updateQuery = `UPDATE users SET profile_picture = ? WHERE id = ? `;

  const [result] = await mysql.execute(updateQuery, [profilePicUrl, id]);
  return result || null;
};

export const getWebEmployeeData = async () => {
  const selectQuery = `SELECT id, username, role, firstName, lastName, middleInitial, email, created_at, profile_picture, status, requested_role FROM users
  WHERE role IN ('super_admin', 'admin','staff') ORDER BY created_at DESC
  `;

  const [rows] = await mysql.execute(selectQuery);
  return rows || null;
};

export const updateUserRole = async (id, requestedRole) => {
  const updateQuery = `UPDATE users SET role = ?, requested_role = NULL WHERE id = ?`;

  const [result] = await mysql.execute(updateQuery, [requestedRole, id]);
  return result || null;
};

export const requestRoleChange = async (id, requestRole) => {
  const updateQuery = `UPDATE users SET requested_role = ? WHERE id = ?`;

  const [result] = await mysql.execute(updateQuery, [requestRole, id]);
  return result || null;
};

export const deactivateUserById = async (id) => {
  const updateQuery = `UPDATE users SET status = 'inactive' WHERE id = ? `;

  const [result] = await mysql.execute(updateQuery, [id]);
  return result || null;
};

export const activateUserById = async (id) => {
  const updateQuery = `UPDATE users SET status = 'active' WHERE id = ? `;

  const [result] = await mysql.execute(updateQuery, [id]);
  return result || null;
};

export const deleteUserById = async (id) => {
  const deleteQuery = `DELETE FROM users WHERE id = ? `;

  const [result] = await mysql.execute(deleteQuery, [id]);
  return result.affectedRows > 0;
};
