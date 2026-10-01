import { useState, useEffect } from "react";
import Sidebar from "./../components/Sidebar";
import Navbar from "./../components/Navbar";

import { useUserStore } from "./../store/useUserStore.js";

// Temporary mock data until the backend controller is connected
const mockEmployees = [
  {
    id: "100000001",
    username: "s100000001",
    name: "Xyrus John P. Vertucio",
    email: "xyvertucio@gmail.com",
    role: "Super Admin",
    status: "active",
  },
  {
    id: "100000002",
    username: "s100000002",
    name: "Thorin Oakenshield",
    email: "thorin@gmail.com",
    role: "Admin",
    status: "active",
    hasRequest: true,
  },
  {
    id: "100000003",
    username: "s100000003",
    name: "Steven Strange",
    email: "steven@gmail.com",
    role: "Admin",
    status: "inactive",
    hasRequest: true,
  },
];

const StatCard = ({ label, value }) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm py-6 flex flex-col items-center justify-center">
    <span className="text-xs font-bold tracking-wide uppercase text-gray-900">
      {label}
    </span>

    <span className="text-6xl font-black mt-3 leading-none">{value}</span>
  </div>
);

const FilterSelect = ({ label, value, onChange, options }) => (
  <label className="flex items-center gap-3 text-xs font-bold text-gray-800">
    {label}

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-gray-200 rounded-md px-3 py-2 text-xs font-semibold bg-white shadow-sm focus:outline-none focus:border-gray-400"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

const EmployeeAndStaff = () => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const {
    userData,
    fetchUsersData,
    updateRole,
    requestRoleChange,
    deactivateUser,
  } = useUserStore();

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);
  // ==============================
  // EMPLOYEE STATISTICS
  // ==============================

  const total = userData?.length || 0;

  const active = (userData || []).filter(
    (employee) => employee.status === "active",
  ).length;

  const inactive = (userData || []).filter(
    (employee) => employee.status === "inactive",
  ).length;

  // ==============================
  // SEARCH + FILTER
  // ==============================

  const visibleEmployees = (userData || []).filter((employee) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      !query ||
      [
        employee.id?.toString(),
        employee.username,
        employee.firstName,
        employee.lastName,
        employee.email,
      ].some((value) => value?.toLowerCase().includes(query));

    const matchesStatus =
      statusFilter === "all" || employee.status === statusFilter;

    const matchesRole =
      roleFilter === "all" || employee.role?.toLowerCase() === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  console.log("Employee from Database: ", userData);

  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans text-gray-900 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-8 pt-20 pb-8">
          {/* =========================================
              PAGE TITLE
          ========================================= */}
          <h1 className="text-3xl font-black mb-6 tracking-wide">
            EMPLOYEE & STAFF
          </h1>

          {/* =========================================
              SUMMARY CARDS
          ========================================= */}
          <div className="grid grid-cols-3 gap-6 mb-6">
            <StatCard label="All Employee" value={total} />

            <StatCard label="Active Employee" value={active} />

            <StatCard label="Inactive Employee" value={inactive} />
          </div>

          {/* =========================================
              EMPLOYEE TABLE PANEL
          ========================================= */}
          <section className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* =========================================
                TABLE HEADER / FILTER BAR
            ========================================= */}
            <div className="flex flex-wrap items-center gap-4 px-6 py-4 border-b border-gray-100">
              {/* TITLE */}
              <h2 className="text-sm font-black tracking-wide uppercase">
                Employee Details
              </h2>

              {/* SEARCH */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for ID, Username, Name, Email"
                className="w-80 border border-gray-200 rounded-md px-3 py-2 text-xs placeholder-gray-400 focus:outline-none focus:border-gray-400"
              />

              {/* FILTERS */}
              <div className="ml-auto flex items-center gap-6">
                {/* STATUS FILTER */}
                <FilterSelect
                  label="Status"
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    {
                      value: "all",
                      label: "All",
                    },
                    {
                      value: "active",
                      label: "Active",
                    },
                    {
                      value: "inactive",
                      label: "Inactive",
                    },
                  ]}
                />

                {/* ROLE FILTER */}
                <FilterSelect
                  label="Role"
                  value={roleFilter}
                  onChange={setRoleFilter}
                  options={[
                    {
                      value: "all",
                      label: "All",
                    },
                    {
                      value: "Super Admin",
                      label: "Super Admin",
                    },
                    {
                      value: "Admin",
                      label: "Admin",
                    },
                    {
                      value: "Staff",
                      label: "Staff",
                    },
                  ]}
                />
              </div>
            </div>

            {/* =========================================
                EMPLOYEE TABLE
            ========================================= */}
            <div className="w-full overflow-x-auto">
              <table className="w-full table-fixed text-sm text-left">
                {/* =====================================
                    FIXED COLUMN WIDTHS

                    This keeps the table headers,
                    employee data, and buttons aligned.
                ===================================== */}
                <colgroup>
                  <col className="w-[9%]" />
                  <col className="w-[11%]" />
                  <col className="w-[15%]" />
                  <col className="w-[24%]" />
                  <col className="w-[14%]" />
                  <col className="w-[11%]" />
                  <col className="w-[8%]" />
                  <col className="w-[8%]" />
                </colgroup>

                {/* =====================================
                    TABLE HEADER
                ===================================== */}
                <thead className="bg-[#D9D9D9] text-gray-800 font-bold text-xs uppercase">
                  <tr>
                    <th className="px-4 py-4">ID NO.</th>

                    <th className="px-4 py-4">USERNAME</th>

                    <th className="px-4 py-4">NAME</th>

                    <th className="px-4 py-4">EMAIL</th>

                    <th className="px-4 py-4">ROLE</th>

                    <th className="px-4 py-4 text-center">STATUS</th>

                    <th className="px-4 py-4 text-center">REQUEST</th>

                    <th className="px-4 py-4 text-center">ACTION</th>
                  </tr>
                </thead>

                {/* =====================================
                    TABLE BODY
                ===================================== */}
                <tbody className="divide-y divide-gray-200 bg-white">
                  {/* =====================================
                      EMPTY RESULT
                  ===================================== */}
                  {visibleEmployees.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-10 text-center text-xs text-gray-500"
                      >
                        No employees match your search or filters.
                      </td>
                    </tr>
                  )}

                  {/* =====================================
                      EMPLOYEE ROWS
                  ===================================== */}
                  {visibleEmployees.map((employee) => (
                    <tr
                      key={employee.id}
                      className="font-bold hover:bg-gray-50 transition-colors"
                    >
                      {/* ID */}
                      <td className="px-4 py-4 truncate">{employee.id}</td>

                      {/* USERNAME */}
                      <td className="px-4 py-4 truncate">
                        {employee.username}
                      </td>

                      {/* NAME */}
                      <td className="px-4 py-4 truncate">
                        {employee.firstName} {employee.middleInitial || " "}{" "}
                        {employee.lastName}
                      </td>

                      {/* EMAIL */}
                      <td className="px-4 py-4 truncate">{employee.email}</td>

                      {/* ROLE */}
                      <td className="px-4 py-4">
                        <select
                          defaultValue={employee.role}
                          className="w-full max-w-[140px] border border-gray-300 rounded px-3 py-1 font-semibold focus:outline-none focus:border-gray-500 bg-white text-xs"
                        >
                          <option value="super_admin">Super Admin</option>

                          <option value="admin">Admin</option>

                          <option value="staff">Staff</option>
                        </select>
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-block px-4 py-1 text-xs rounded-full border ${
                            employee.status === "active"
                              ? "text-green-700 bg-green-200 border-green-500"
                              : "text-red-700 bg-red-200 border-red-500"
                          }`}
                        >
                          {employee.status.toUpperCase()}
                        </span>
                      </td>

                      {/* REQUEST */}
                      <td className="px-4 py-4 text-center">
                        {employee.hasRequest && (
                          <button
                            type="button"
                            className="w-20 px-4 py-1 text-xs text-yellow-800 bg-yellow-200 border border-yellow-500 rounded-full hover:bg-yellow-300 transition"
                          >
                            CHANGE
                          </button>
                        )}
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          className="w-20 px-4 py-1 text-xs text-white bg-red-500 border border-red-600 rounded-full hover:bg-red-600 transition"
                        >
                          DELETE
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default EmployeeAndStaff;
