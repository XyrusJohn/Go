import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useOtpStore } from "../store/useOtpStore";

const OtpCardModal = ({ onClose, email, onVerifySuccess }) => {
  const { requestOtp, validateResult, isUpdatingProfile, isValidatingOtp } =
    useOtpStore();

  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value !== "") {
      element.nextSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 6) {
      return;
    }

    try {
      await validateResult({ email, otp: enteredOtp });

      if (onVerifySuccess) {
        onVerifySuccess();
      }
    } catch (error) {
      console.error(error);
      setOtp(new Array(6).fill(""));
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (isUpdatingProfile) return;
    if (email) {
      await requestOtp(email);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[20px] shadow-2xl w-full max-w-[500px] min-h-[400px] relative animate-in fade-in zoom-in-95 duration-200 flex flex-col items-center justify-center p-8 overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors z-10"
        >
          <X className="w-6 h-6" strokeWidth={1.5} />
        </button>

        <h2 className="text-2xl font-black uppercase mb-2">
          Verification Code
        </h2>
        <p className="text-gray-500 text-center text-sm mb-8">
          Enter the 6-digit code sent to your email to unlock profile editing.
        </p>

        {/* 6-DIGIT INPUT BOXES */}
        <div className="flex gap-3 mb-8">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              name="otp"
              maxLength="1"
              value={data}
              onChange={(e) => handleChange(e.target, index)}
              onFocus={(e) => e.target.select()}
              className="w-12 h-14 border border-gray-300 rounded-lg text-center text-xl font-bold text-gray-900 focus:border-[#9A0AED] focus:ring-1 focus:ring-[#9A0AED] outline-none transition-all"
            />
          ))}
        </div>

        {/* IKAKABIT NATIN ANG SUBMIT HANDLER SA BUTTON */}
        <button
          onClick={handleSubmit}
          disabled={isValidatingOtp || otp.some((val) => !val)}
          className={`w-full bg-[#9A0AED] text-white font-bold py-3 px-6 rounded-lg transition-all shadow-md ${
            isValidatingOtp || otp.some((val) => !val)
              ? "opacity-70 cursor-not-allowed"
              : "hover:opacity-90"
          }`}
        >
          {isValidatingOtp ? "Verifying..." : "Verify Code"}
        </button>

        <div className="mt-6 text-center text-sm text-gray-500">
          Didn't receive the code?{" "}
          <a
            href="#"
            onClick={handleResend}
            className={`font-bold text-[#9A0AED] hover:underline transition-opacity ${
              isUpdatingProfile ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {isUpdatingProfile ? "Resending..." : "Click to resend"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default OtpCardModal;
