import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useAuthStore = create((set, get) => ({
  // Initial State
  authUser: null,
  isCheckingAuth: true,
  userData: [],

  isSigningUp: false,
  isLoggingIn: false,
  isFetchingProfile: false,
  isUpdatingProfileData: false,
  isUpdatingPasswordData: false,

  checkAuth: async () => {
    try {
      const checkAuthRes = await axiosInstance.get("auth/check");
      set({ authUser: checkAuthRes.data });
    } catch (error) {
      console.log("Error in checkAuth: ", error);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const loginRes = await axiosInstance.post("auth/login", data);
      set({ authUser: loginRes.data });
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("auth/logout");
      set({ authUser: null });
    } catch (error) {
      console.error("Logout Error: ", error);
      toast.error("Failed to logout");
    }
  },

  fetchUserProfile: async () => {
    set({ isFetchingProfile: true });
    try {
      const fetchProfileRes = await axiosInstance.get("auth/profile");
      set({ userData: fetchProfileRes.data });
    } catch (error) {
      console.error("Error in fetchUserProfile: ", error);
      toast.error("Failed to fetch profile");
    } finally {
      set({ isFetchingProfile: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfileData: true });
    try {
      const updateProfileRes = await axiosInstance.put(
        "auth/profile-update",
        data,
      );

      toast.success("Profile updated successfully");

      await get().fetchUserProfile();

      return updateProfileRes.data;
    } catch (error) {
      console.error("Error in updateProfile: ", error);
      toast.error("Failed to update profile");
    } finally {
      set({ isUpdatingProfileData: false });
    }
  },

  updatePassword: async (passwordData) => {
    set({ isUpdatingPasswordData: true });
    try {
      const updatePasswordRes = await axiosInstance.put(
        "auth/update-password",
        passwordData,
      );

      toast.success(
        updatePasswordRes.data.message || "Password updated successfully",
      );

      return true;
    } catch (error) {
      console.error("Error in updatePassword: ", error);
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      set({ isUpdatingPasswordData: false });
    }
  },
}));
