import { useState, useEffect } from "react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuthStore } from "./../store/useAuthStore.js";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  useEffect(() => {
    const savedUsername = localStorage.getItem("snapgo_username");

    if (savedUsername) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({ ...prev, username: savedUsername }));
      setRememberMe(true);
    }
  }, []);
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rememberMe) {
      localStorage.setItem("snapgo_username", formData.username);
    } else {
      localStorage.removeItem("snapgo_username");
    }

    login(formData);
  };
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[rgb(11,15,25)] text-white font-sans">
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-b from-[#22c55e] to-[#0b0f19] p-8">
        <div className="max-w-sm text-center">
          <h1 className="text-4xl font-bold mb-4">Get started with us</h1>
          <p className="text-gray-200">
            Complete these easy steps to register your account.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col justify-center items-center p-8 bg-white text-black">
        {!showForm ? (
          <div className="text-center space-y-6 transition-all duration-500">
            <h2 className="text-4xl font-bold">Welcome Back</h2>
            <p className="text-gray-500">
              Access your Snap Go account to continue.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-black hover:bg-gray-800 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transform"
            >
              Log in to Snap Go
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-8">
            <button
              onClick={() => setShowForm(false)}
              className="p-2 -ml-2 rounded-md hover:bg-gray-100 text-black hover:text-gray-500 transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Log in to Snap Go</h2>
              <p className="text-sm text-gray-400">
                Enter your data to Sign in your account.
              </p>
            </div>

            <div className="flex items-center text-gray-500 text-sm">
              <hr className="flex-grow border-gray-300" />
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 h-100 bg-gray-100 rounded-xl p-10"
            >
              <div>
                <label className="block text-m mb-2 text-gray-400">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="s100000001"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black placeholder-gray-300 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition"
                />
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-300">
                  Password
                </label>
                <div className="relative flex align-middle">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    placeholder="•••••••"
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-black  placeholder-gray-300 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-200 transition"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2 cursor-pointer text-gray-500">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox checkbox-sm border-gray-300 bg-gray-200 checked:bg-black checked:border-black rounded-sm cursor-pointer"
                  />
                  Remember me
                </label>
                <a
                  href="#"
                  className="text-gray-400 hover:text-black transition"
                >
                  Forget Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-black hover:bg-gray-500 text-white font-bold py-3 rounded-xl transition mt-4 ease-in"
              >
                {isLoggingIn ? (
                  <span className="loading loading-dots loading-md"></span>
                ) : (
                  "LOG IN"
                )}
              </button>
            </form>

            <p className="text-center text-gray-400 text-sm">
              Do you have an account?{" "}
              <a
                href="/registration"
                className="text-black font-medium hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
