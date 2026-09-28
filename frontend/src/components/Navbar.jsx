import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Settings, LogOut } from "lucide-react";

import { useAuthStore } from "../store/useAuthStore.js";

const SubMenuItem = ({ title, path, icon: Icon, onClick }) => (
  <Link
    onClick={onClick}
    to={path || "#"}
    className="flex items-center gap-2 px-2 py-1 text-black whitespace-nowrap hover:opacity-70 transition-all ease-in-out duration-200"
  >
    {Icon && <Icon size={20} strokeWidth={2.5} className="shrink-0" />}
    <span className="text-[13px] font-bold">{title}</span>
  </Link>
);

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { authUser, userData, fetchUserProfile, logout } = useAuthStore();

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const user = userData.data || {};
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="navbar fixed top-0 left-0 w-full h-16 mt-2 bg-transparent flex justify-center items-center lg:gap-400 md:gap-150 gap-100 z-40">
      <div>logo</div>
      {/* Avatar */}
      <div
        ref={dropdownRef}
        className="relative flex items-center justify-center gap-3 pl-5 rounded-md cursor-pointer"
        onClick={() => setShowProfileMenu(!showProfileMenu)}
      >
        <div className="avatar">
          <div className="ring-green-500 w-8 rounded-full ring-2 ring-offset-2"></div>
        </div>
        {showProfileMenu && (
          <ul className="absolute top-12 flex w-48 flex-col items-center justify-center gap-3 rounded-xl bg-white py-3 pl-1 shadow-xl border border-gray-100">
            <div className="flex flex-col items-center justify-center text-sm text-center">
              <div className="font-bold">
                {user.lastName}, {user.firstName} {user.middleInitial || " "}
              </div>
              <div className="bg-gray-200 text-gray-600 border border-gray-300 text-xs font-bold uppercase px-3 py-0.5 rounded-full mt-1 tracking-wider">
                {user.role}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex w-35 border-b border-gray-200"></div>
              <div className="group flex items-center cursor-pointer">
                <Settings
                  size={20}
                  strokeWidth={2.5}
                  className="text-black transition-transform duration-300 ease-in-out group-hover:-rotate-180 group-hover:opacity-70 shrink-0"
                />
                <SubMenuItem title="Manage Account" path="/profile" />
              </div>

              <div className="flex w-35 border-b border-gray-200"></div>
              {authUser && (
                <div className="group flex items-center cursor-pointer">
                  <LogOut
                    size={20}
                    strokeWidth={2.5}
                    className="text-black transition-transform duration-300 ease-in-out group-hover:-rotate-180 group-hover:text-red-500 shrink-0"
                  />
                  <SubMenuItem onClick={logout} title="Logout" />
                </div>
              )}
            </div>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navbar;
