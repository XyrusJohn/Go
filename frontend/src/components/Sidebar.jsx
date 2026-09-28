import { useState } from "react";

import { useAuthStore } from "../store/useAuthStore.js";

import {
  ChevronRight,
  Minus,
  LayoutDashboard,
  Truck,
  UserCircle,
  Settings,
  LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";

/**
 * Renders a sidebar submenu entry with an optional trailing element.
 *
 * The connector line is created with CSS pseudo-elements to visually
 * associate submenu items with their parent menu section.
 */
const SubMenuItem = ({ title, path, rightElement }) => (
  <Link
    to={path || "#"}
    className="relative flex items-center h-10 hover:opacity-70
               before:absolute before:left-0 before:top-[-8px] before:bottom-0 
               before:border-l-[1.5px] before:border-black 
               last:before:bottom-1/2"
  >
    <div className="absolute left-0 top-1/2 w-[16px] border-b-[1.5px] border-black"></div>

    <div className="ml-[24px] flex flex-1 items-center justify-between pr-4">
      <span className="text-[14px] font-bold text-black">{title}</span>
      {rightElement}
    </div>
  </Link>
);

/**
 * Renders a primary sidebar menu section.
 *
 * Accepts a Lucide icon, section title, and optional submenu content.
 * Submenu items are rendered beneath the primary menu entry.
 */
const MenuItem = ({ icon: Icon, title, children }) => (
  <div className="flex flex-col mb-5">
    <div className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors pr-4">
      <div className="flex items-center gap-[14px]">
        <div className="relative z-10 bg-[#fcfcfc]">
          <Icon size={24} strokeWidth={2.5} className="text-black" />
        </div>

        <span className="font-extrabold text-[15px] text-black tracking-wide">
          {title}
        </span>
      </div>
    </div>

    {children && <div className="ml-[70px] flex flex-col">{children}</div>}
  </div>
);

/**
 * Sidebar
 *
 * Provides the application's primary navigation and authenticated
 * user actions.
 *
 * Responsibilities:
 * - Render grouped navigation sections and submenu routes.
 * - Control the expanded/collapsed sidebar state.
 * - Display authenticated user actions.
 * - Delegate logout behavior to the authentication store.
 *
 * UI state:
 * showModal = true  → expanded sidebar
 * showModal = false → collapsed sidebar
 *
 * Authentication flow:
 * useAuthStore → authUser / logout
 *                        ↓
 *                 Logout button
 */
const Sidebar = () => {
  const { authUser, logout } = useAuthStore();
  const [showModal, setShowModal] = useState(true);

  return (
    <div className="relative flex items-center">
      {/* Collapsed-state trigger used to restore the sidebar. */}
      <div
        className={`absolute left-1 top-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out z-20 ${
          showModal
            ? "opacity-0 -translate-x-5 pointer-events-none"
            : "opacity-100 translate-x-0 delay-150"
        }`}
      >
        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center justify-center h-20 w-10 rounded bg-white shadow-sm border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200 cursor-pointer"
        >
          <ChevronRight
            size={24}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
        </button>
      </div>

      {/* Expanded navigation panel. Width and visibility transition together
          to provide a smooth collapse/expand animation. */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden z-10 origin-left ${
          showModal
            ? "w-[340px] opacity-100 ml-10 translate-x-0"
            : "w-0 opacity-0 ml-0 -translate-x-10"
        }`}
      >
        <div className="bg-[#fcfcfc] h-auto w-[340px] rounded-xl shadow-xl border border-gray-200 flex flex-col pt-4 pb-6 pl-6 pr-2 min-w-[340px]">
          {/* Panel control for collapsing the expanded sidebar. */}
          <div className="flex justify-end pr-4 mb-4">
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-black transition-colors"
            >
              <Minus size={20} strokeWidth={2.5} />
            </button>
          </div>

          {/* Scrollable navigation area keeps the logout action fixed below. */}
          <div className="flex-1 overflow-y-auto">
            <MenuItem icon={LayoutDashboard} title="Dashboard">
              <SubMenuItem title="Overview" path="/" />
              <SubMenuItem title="Live Tracking" />
              <SubMenuItem title="Fleet Management" path="/fleet-management" />
            </MenuItem>

            <MenuItem icon={Truck} title="Systems Management">
              <SubMenuItem title="Driver" />
              <SubMenuItem title="Dispatch" path="/dispatch" />
              <SubMenuItem title="History" />
            </MenuItem>

            <MenuItem icon={UserCircle} title="User Management">
              <SubMenuItem title="Employee & Staff" />
              <SubMenuItem title="Requests" />
            </MenuItem>

            <MenuItem icon={Settings} title="Settings">
              {/* <SubMenuItem title="Account" /> */}

              <SubMenuItem
                title="Theme"
                rightElement={
                  <div className="w-8 h-4 bg-gray-300 rounded-full flex items-center p-0.5 cursor-pointer">
                    <div className="w-3 h-3 bg-white rounded-full shadow-sm"></div>
                  </div>
                }
              />
            </MenuItem>
          </div>

          {/* Logout is displayed only when an authenticated user exists.
              The actual session-clearing logic remains inside useAuthStore. */}
          {/* <div className="mt-8 pt-4">
            {authUser && (
              <button
                onClick={logout}
                className="group flex items-center gap-2 justify-center hover:bg-gray-100 p-2 rounded transition-colors w-25 text-left cursor-pointer"
              >
                <LogOut
                  size={22}
                  strokeWidth={2.5}
                  className="text-black group-hover:text-red-500 transition-colors"
                />

                <span className="font-extrabold text-[14px] text-black tracking-wide group-hover:text-red-500 transition-colors">
                  Logout
                </span>
              </button>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
