import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useUserStore = create((set, get) => ({
  // Initial State
  userData: [],

  isLoading: false,

  // Fetch user data first from database
  fetchUsersData: async () => {
    set({ isLoading: true });
    try {
      // place holder
      const fetchUserDataRes = await axiosInstance.get("user/employees", {
        withCredentials: true,
      });
      set({ userData: fetchUserDataRes.data.data });
    } catch (error) {
      const exactError =
        error.response?.data?.message || "Failed to fetch user data";

      toast.error(`Error: ${exactError}`);
      console.error("Backend Error Details:", error.response?.data);
    } finally {
      set({ isLoading: false });
    }
  },

  updateRole: async (id, requestRole) => {
    set({ isLoading: true });
    try {
      const updateRoleRes = await axiosInstance.put(
        `user/role-change/${id}`,
        {
          requestRole,
        },
        { withCredentials: true },
      );

      if (updateRoleRes.data.success) {
        get().fetchUsersData();
      }
    } catch (error) {
      const exactError =
        error.response?.data?.message || "Failed to update role";

      toast.error(`Error: ${exactError}`);
      console.error("Backend Error Details:", error.response?.data);
    } finally {
      set({ isLoading: false });
    }
  },

  requestRoleChange: async (requestedRole) => {
    try {
      const roleChangeRes = await axiosInstance.post(
        "user/request-role-change/",
        { requestedRole },
      );

      if (roleChangeRes.data.success) {
        toast.success("Role change request submitted successfully");
        get().fetchUsersData();
      }
    } catch (error) {
      const exactError =
        error.response?.data?.message || "Failed to request role change";

      toast.error(`Error: ${exactError}`);
      console.error("Backend Error Details:", error.response?.data);
    }
  },

  deactivateUser: async (id) => {
    try {
      const deactivateUserRes = await axiosInstance.put(
        `user/deactivate/${id}`,
      );

      if (deactivateUserRes.data.success) {
        toast.success("User deactivated successfully");
        get().fetchUsersData();
      }
    } catch (error) {
      const exactError =
        error.response?.data?.message || "Failed to deactivate user";

      toast.error(`Error: ${exactError}`);
      console.error("Backend Error Details:", error.response?.data);
    }
  },
  activateUser: async (id) => {
    try {
      const activateUserRes = await axiosInstance.put(`user/activate/${id}`);

      if (activateUserRes.data.success) {
        toast.success("User activated successfully");
        get().fetchUsersData();
      }
    } catch (error) {
      const exactError =
        error.response?.data?.message || "Failed to activate user";

      toast.error(`Error: ${exactError}`);
      console.error("Backend Error Details:", error.response?.data);
    }
  },

  deleteUser: async (id) => {
    try {
      const deleteUserRes = await axiosInstance.delete(`user/delete/${id}`);

      if (deleteUserRes.data.success) {
        toast.success("User deleted successfully");
        get().fetchUsersData();
      }
    } catch (error) {
      const exactError =
        error.response?.data?.message || "Failed to delete user";

      toast.error(`Error: ${exactError}`);
      console.error("Backend Error Details:", error.response?.data);
    }
  },
}));
