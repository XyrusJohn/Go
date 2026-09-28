import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

export const useOtpStore = create((set) => ({
  /**
   * Tracks whether an OTP-related request is currently being processed.
   *
   * Used by the UI to prevent duplicate requests and provide loading
   * feedback while communicating with the backend.
   */
  isUpdatingProfile: false,
  isValidatingOtp: false,

  /**
   * Requests a new OTP for the specified email address.
   *
   * The function manages the complete request lifecycle:
   * validation → API request → success notification → error handling.
   *
   * @param {string} email - Email address that should receive the OTP.
   */
  requestOtp: async (email) => {
    // Set loading state before starting the API request.
    set({ isUpdatingProfile: true });

    try {
      // Prevent unnecessary API calls when no email is provided.
      if (!email) {
        console.error("Email is required");
        return;
      }

      // Request the backend to generate and send a new OTP.
      await axiosInstance.post(
        "otp/request-otp",
        {
          email,
        },
        { withCredentials: true },
      );

      // Store the email associated with the active OTP request.
      set({ email });

      // Notify the user after the backend confirms the request.
      toast.success("OTP sent successfully");
    } catch (error) {
      // Display a user-friendly message while logging the
      // original error for debugging purposes.
      toast.error("Failed to send OTP");
      console.error(error);
    } finally {
      // Always reset the loading state regardless of request outcome.
      set({ isUpdatingProfile: false });
    }
  },

  validateResult: async (data) => {
    set({ isValidatingOtp: true });
    try {
      await axiosInstance.post("otp/verify-otp", data, {
        withCredentials: true,
      });

      toast.success("OTP verified successfully");
      set({ data });
      console.log("data", data);
    } catch (error) {
      toast.error("Failed to validate OTP");
      console.error(error);
    } finally {
      set({ isValidatingOtp: false });
    }
  },
}));
