import { useEffect } from "react";
import Overview from "./pages/Overview";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import FleetManagement from "./pages/FleetManagement";
import Profile from "./pages/Profile";

import { useAuthStore } from "./store/useAuthStore.js";

import { Routes, Route, Navigate } from "react-router-dom";

import { Loader } from "lucide-react";

import Dispatch from "./pages/Dispatch";
// import Navbar from "./components/Navbar";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      {/* <div className="min-h-screen overflow-x-hidden">
        // <Navbar />
      </div> */}
      <Routes>
        <Route
          path="/"
          element={authUser ? <Overview /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/registration"
          element={!authUser ? <RegistrationPage /> : <Navigate to="/" />}
        />
        <Route
          path="/fleet-management"
          element={authUser ? <FleetManagement /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/dispatch"
          element={authUser ? <Dispatch /> : <Navigate to="/login" />}
        />
      </Routes>
    </div>
  );
};

export default App;
