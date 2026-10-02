import {
  getWebEmployeeData,
  updateUserRole,
  requestRoleChange,
  deactivateUserById,
  findUserById,
  activateUserById,
} from "../models/auth.model.js";

export const getWebEmployee = async (req, res) => {
  try {
    //placeholder
    const employees = await getWebEmployeeData();

    if (!employees) {
      return res.status(404).json({
        success: false,
        message: "No employees found",
      });
    }

    res.status(200).json({
      success: true,
      data: employees,
    });
  } catch (error) {
    console.log("Error in getWebEmployee", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { requestRole } = req.body;
    const currentRole = req.user.role;

    if (!["super_admin", "admin", "staff"].includes(requestRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    if (currentRole === "admin") {
      if (requestRole === "super_admin") {
        return res.status(400).json({
          success: false,
          message: "Admin cannot assign Super Admin role.",
        });
      }
      const targetUser = await findUserById(id);
      if (!targetUser) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      if (targetUser.role === "admin" || targetUser.role === "super_admin")
        return res.status(400).json({
          success: false,
          message:
            "Cannot assign admin or super_admin role to another admin or super_admin.",
        });
    }

    await updateUserRole(id, requestRole);
    res.status(200).json({
      success: true,
      message: "Role updated successfully",
    });
  } catch (error) {
    console.log("Error in updateRole", error);
    res.status(500).json({ message: error.message });
  }
};

export const requestRole = async (req, res) => {
  try {
    const userId = req.user.id;
    const { requestedRole } = req.body;

    if (!["super_admin", "admin"].includes(requestedRole)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role specified",
      });
    }

    await requestRoleChange(userId, requestedRole);
    res.status(200).json({
      success: true,
      message: "Role request submitted successfully",
    });
  } catch (error) {
    console.log("Error in requestRole", error);
    res.status(500).json({ message: error.message });
  }
};

export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (req.user.id.toString() === id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot deactivate yourself",
      });
    }

    await deactivateUserById(id);
    res.status(200).json({
      success: true,
      message: "User deactivated successfully",
    });
  } catch (error) {
    console.log("Error in deactivateUser", error);
    res.status(500).json({ message: error.message });
  }
};

export const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (req.user.id.toString() === id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot activate yourself",
      });
    }

    await activateUserById(id);
    res.status(200).json({
      success: true,
      message: "User activated successfully",
    });
    // console.log("User activated successfully", id);
  } catch (error) {
    console.log("Error in activateUser", error);
    res.status(500).json({ message: error.message });
  }
};
