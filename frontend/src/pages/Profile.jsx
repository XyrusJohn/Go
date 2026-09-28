import { useEffect, useState } from "react";
import Sidebar from "./../components/Sidebar";
import Navbar from "./../components/Navbar";
import OtpCardModal from "./../components/OtpCardModal";

import { useAuthStore } from "../store/useAuthStore";
import { useOtpStore } from "../store/useOtpStore";
import toast from "react-hot-toast";

import { Loader } from "lucide-react";

/**
 * Reusable form input component used throughout the profile page.
 *
 * Centralizes common input styling and disabled-state behavior
 * to keep the profile form consistent and reduce duplicated JSX.
 */
const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  disabled = false,
  className,
}) => (
  <div className="flex flex-col w-full">
    <label className="text-[13px] text-gray-500 mb-1.5">{label}</label>

    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`border border-gray-200 rounded-lg p-2.5 text-sm outline-none shadow-sm transition-all ${className}
              ${
                disabled
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "focus:border-[#9A0AED] focus:ring-1 focus:ring-[#9A0AED] bg-white text-gray-900"
              }`}
    />
  </div>
);

const Profile = () => {
  // Retrieves the authenticated user's profile and profile-loading state.
  const {
    userData,
    isFetchingProfile,
    fetchUserProfile,
    updateProfile,
    isUpdatingProfileData,
    updatePassword,
    isUpdatingPasswordData,
  } = useAuthStore();

  // Safely fallback to an empty object while profile data is unavailable.
  const user = userData.data || {};

  // Handles OTP requests and exposes the request loading state.
  const { requestOtp, isUpdatingProfile } = useOtpStore();

  // Controls visibility of the OTP verification modal.
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Tracks whether an OTP has already been requested during this edit flow.
  // This prevents unnecessary duplicate OTP requests when reopening the modal.
  const [otpSent, setOtpSent] = useState(false);

  // Controls whether profile fields are currently editable.
  const [enableEdit, setEnableEdit] = useState(false);

  // Controls whether the password fields are unlocked after OTP verification
  const [enablePasswordEdit, setEnablePasswordEdit] = useState(false);

  // Tracks if an OTP has already been sent for the password change flow
  const [passwordOtpSend, setPasswordOtpSend] = useState(false);

  // Controls visibility of the OTP modal specifically for password change
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    lastName: user.lastName || "",
    firstName: user.firstName || "",
    middleInitial: user.middleInitial?.replace(".", "") || "",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /**
   * Loads the authenticated user's profile when the page is mounted.
   *
   * Keeping this request inside the effect ensures the profile data
   * is refreshed when the Profile page becomes active.
   */
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  useEffect(() => {
    if (!enableEdit && user && Object.keys(user).length > 0) {
      setFormData({
        lastName: user.lastName || "",
        firstName: user.firstName || "",
        middleInitial: user.middleInitial?.replace(".", "") || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
      });
    }
  }, [user, enableEdit, setFormData]);

  /**
   * Starts the profile-edit verification flow.
   *
   * Editing requires email-based OTP verification. If an OTP has already
   * been requested, the existing verification modal is reopened instead
   * of sending another code.
   *
   * @param {string} email - Email address used to receive the OTP.
   */
  const handleEditRequest = async (email) => {
    // Profile editing cannot proceed without an email address.
    if (!email) {
      toast("Email is required");
      return;
    }

    // Reopen the verification modal if an OTP has already been sent.
    if (otpSent) {
      setIsModalOpen(true);
      return;
    }

    toast("Requesting OTP for", email);

    // Request a new OTP before allowing the user to continue.
    await requestOtp(email);

    // Mark the OTP flow as active and display the verification modal.
    setOtpSent(true);
    setIsModalOpen(true);
  };
  // Handle form field changes for profile details
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    toast("Account details is updated");
  };

  // Sends the updated profile data to the backend.
  const handleSave = async () => {
    const result = await updateProfile(formData);
    if (result) {
      setEnableEdit(false);
      setOtpSent(false);
      toast("Profile updated");
    }
  };

  // Requests an OTP for password change and opens the password modal.
  const handleEditPasswordRequest = async (email) => {
    // Profile editing cannot proceed without an email address.
    if (!email) {
      toast("Email is required");
      return;
    }

    if (passwordOtpSend) {
      setIsPasswordModalOpen(true);
      return;
    }

    await requestOtp(email);
    setPasswordOtpSend(true);
    setIsPasswordModalOpen(true);
  };

  const handleChangePassword = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSavePassword = async () => {
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      toast("Please fill in all password fields");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast("Passwords do not match");
      return;
    }

    const passwordPayload = {
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword,
    };

    const result = await updatePassword(passwordPayload);
    if (result) {
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setEnablePasswordEdit(false);
      setPasswordOtpSend(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans text-gray-900 overflow-hidden">
      {isUpdatingProfileData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Loader className="size-12 animate-spin text-[#9A0AED]" />
        </div>
      )}
      {isUpdatingPasswordData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Loader className="size-12 animate-spin text-[#9A0AED]" />
        </div>
      )}
      {isUpdatingProfile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <Loader className="size-12 animate-spin text-[#9A0AED]" />
        </div>
      )}
      {/*
        OTP verification is rendered conditionally so the modal exists
        only while the profile-edit verification flow is active.
      */}
      {isModalOpen && (
        <OtpCardModal
          onClose={() => setIsModalOpen(false)}
          email={user.email}
          onVerifySuccess={() => {
            setEnableEdit(true);
            setIsModalOpen(false);
          }}
        />
      )}

      {isPasswordModalOpen && (
        <OtpCardModal
          onClose={() => setIsPasswordModalOpen(false)}
          email={user.email}
          onVerifySuccess={() => {
            setEnablePasswordEdit(true);
            setIsPasswordModalOpen(false);
          }}
        />
      )}

      {/* GLOBAL SIDEBAR */}
      <Sidebar />

      {/* MAIN APPLICATION CONTAINER */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* GLOBAL TOP NAVIGATION */}
        <Navbar />

        {/* PROFILE PAGE CONTENT */}
        <main className="flex-1 flex flex-col mt-10 p-8 overflow-y-auto">
          {/* PAGE HEADER */}
          <div className="mb-6 flex justify-between items-center shrink-0">
            <h1 className="text-[28px] font-black tracking-tight uppercase">
              PROFILE INFORMATION
            </h1>
          </div>

          {/*
            PROFILE SUMMARY CARD
            Displays the user's avatar, full name, and assigned role.
            Skeleton placeholders are shown while profile data is loading.
          */}
          <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm mb-6 w-full relative flex flex-col items-center justify-center min-h-[260px] shrink-0">
            <span className="absolute top-6 left-8 text-sm text-gray-500 hidden md:block uppercase">
              Update your Personal Information
            </span>

            {enableEdit && (
              <button
                onClick={handleSave}
                disabled={!enableEdit || isUpdatingProfileData}
                className={`absolute top-6 right-8 bg-[#9A0AED] text-white font-bold py-2.5 px-6 rounded-md text-sm transition-all shadow-md ${
                  !enableEdit || isUpdatingProfile
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
              >
                {isUpdatingProfileData ? "Saving..." : "Save Changes"}
              </button>
            )}

            {/* Profile avatar placeholder */}
            <div className="w-32 h-32 bg-[#D9D9D9] rounded-full mb-4 mt-8 md:mt-4"></div>

            {/* USER NAME */}
            <h2 className="text-[22px] font-black uppercase tracking-wide">
              {isFetchingProfile ? (
                // Skeleton placeholder prevents layout shifts while loading.
                <div className="w-64 h-5 mb-2 bg-gray-200 rounded-md animate-pulse"></div>
              ) : (
                `${user.lastName}, ${user.firstName}, ${user.middleInitial || ""}`
              )}
            </h2>

            {/* USER ROLE */}
            <div className="bg-gray-200 text-gray-600 border border-gray-300 text-sm font-bold uppercase px-3 py-0.5 rounded-full mt-1 tracking-wider">
              {user.role}
            </div>
          </div>

          {/*
            PROFILE MANAGEMENT SECTION
            Contains the editable personal-information form and
            the separate password-change request panel.
          */}
          <div className="flex flex-col xl:flex-row gap-6 w-full min-h-0 flex-1">
            {/* PERSONAL INFORMATION CARD */}
            <div className="flex-[1.5] bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col">
              <h4 className="text-[13px] font-black uppercase tracking-wider mb-8 text-gray-900">
                DETAILS
              </h4>

              <div className="relative flex flex-col gap-15">
                {/* NAME FIELDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <InputField
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    disabled={!enableEdit}
                  />

                  <InputField
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    disabled={!enableEdit}
                  />

                  <InputField
                    label="Middle Initial"
                    name="middleInitial"
                    value={formData.middleInitial}
                    onChange={handleChange}
                    disabled={!enableEdit}
                  />
                </div>

                {/* EMAIL FIELD */}
                {!isFetchingProfile && (
                  <InputField
                    type="email"
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={!enableEdit}
                  />
                )}

                {/* CONTACT AND ROLE FIELDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Phone Number"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    disabled={!enableEdit}
                  />

                  <div className="flex flex-col w-full">
                    <InputField
                      className="uppercase"
                      label="Role"
                      value={user.role || ""}
                      disabled={true} // Read-only ang role
                    />
                  </div>
                </div>

                {/*
                  EDIT REQUEST BUTTON
                  Starts the OTP verification process required before
                  profile information can be modified.
                */}
                {!enableEdit && (
                  <button
                    onClick={() => {
                      handleEditRequest(user.email);
                    }}
                    disabled={isUpdatingProfile}
                    className={`absolute right-0 -bottom-18 w-40 bg-[#9A0AED] text-white font-bold py-2.5 px-6 rounded-md text-sm transition-all shadow-md ${isUpdatingProfile ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}`}
                  >
                    {isUpdatingProfile
                      ? "Sending..."
                      : otpSent
                        ? "Verify Request"
                        : "Edit Request"}
                  </button>
                )}
              </div>
            </div>

            {/*
              PASSWORD CHANGE CARD
              Provides a separate workflow for requesting a
              password reset/change through email verification.
            */}
            <div className="flex-[1] bg-white border border-gray-200 rounded-xl p-8 shadow-sm flex flex-col">
              <h4 className="text-[13px] font-black uppercase tracking-wider mb-8 text-gray-900">
                CHANGE PASSWORD
              </h4>

              {!enablePasswordEdit ? (
                <div className="flex flex-col flex-1 justify-between">
                  <InputField
                    label="Email Address"
                    value={user.email || ""}
                    disabled={true}
                  />

                  <div className="mt-auto pt-8 flex justify-center xl:justify-start">
                    <button
                      onClick={() => handleEditPasswordRequest(user.email)}
                      disabled={isUpdatingProfile}
                      className="bg-[#9A0AED] text-white font-bold py-2.5 px-8 rounded-lg text-sm transition-all hover:opacity-90 shadow-md w-full sm:w-auto xl:w-full"
                    >
                      {isUpdatingProfile
                        ? "Sending..."
                        : passwordOtpSend
                          ? "Verify Request"
                          : "Send Request"}
                    </button>
                  </div>
                </div>
              ) : (
                // 2. NAKA-UNLOCK (Verified na ang OTP): Ilalabas ang New Password fields at Update button
                <div className="flex flex-col flex-1 justify-between gap-6">
                  <div className="flex flex-col gap-4">
                    <InputField
                      type="password"
                      label="Current Password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handleChangePassword}
                      disabled={isUpdatingPasswordData}
                    />

                    <InputField
                      type="password"
                      label="New Password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handleChangePassword}
                      disabled={isUpdatingPasswordData}
                    />

                    <InputField
                      type="password"
                      label="Confirm New Password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handleChangePassword}
                      disabled={isUpdatingPasswordData}
                    />
                  </div>

                  <div className="mt-auto pt-8 flex justify-center xl:justify-start">
                    <button
                      onClick={handleSavePassword}
                      disabled={isUpdatingPasswordData}
                      className={`bg-[#9A0AED] text-white font-bold py-2.5 px-8 rounded-lg text-sm transition-all shadow-md w-full sm:w-auto xl:w-full ${
                        isUpdatingPasswordData
                          ? "opacity-70 cursor-not-allowed"
                          : "hover:opacity-90"
                      }`}
                    >
                      {isUpdatingPasswordData
                        ? "Updating..."
                        : "Update Password"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
