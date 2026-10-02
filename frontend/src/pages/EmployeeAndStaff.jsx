import { useState, useEffect } from "react";

import Sidebar from "./../components/Sidebar";
import Navbar from "./../components/Navbar";

import { useUserStore } from "./../store/useUserStore.js";
import { useAuthStore } from "./../store/useAuthStore.js";

const StatCard = ({ label, value }) => (
  <div className="min-w-0 rounded-lg border border-gray-200 bg-white px-4 py-6 shadow-sm">
    <div className="flex flex-col items-center justify-center">
      <span className="text-center text-xs font-bold uppercase tracking-wide text-gray-900">
        {label}
      </span>

      <span className="mt-3 text-5xl font-black leading-none text-gray-900 sm:text-6xl">
        {value}
      </span>
    </div>
  </div>
);

const FilterSelect = ({ label, value, onChange, options }) => (
  <label className="flex min-w-0 items-center gap-2 text-xs font-bold text-gray-800">
    <span className="shrink-0">{label}</span>

    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="min-w-[100px] rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold shadow-sm outline-none transition focus:border-gray-400"
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
    activateUser,
  } = useUserStore();

  const { authUser } = useAuthStore();

  const currentUserId = authUser?.data?.id || authUser?.id;
  const currentUsername = authUser?.data?.username || authUser?.username;
  const currentUserEmail = authUser?.data?.email || authUser?.email;

  const currentUserRole = (
    authUser?.data?.role ||
    authUser?.role ||
    ""
  ).toLowerCase();

  const isAdmin =
    currentUserRole === "super_admin" || currentUserRole === "admin";
  const isStaff = !isAdmin;

  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  const employees = userData || [];

  const total = employees.length;

  const active = employees.filter(
    (employee) => employee.status === "active",
  ).length;

  const inactive = employees.filter(
    (employee) => employee.status === "inactive",
  ).length;

  const visibleEmployees = employees.filter((employee) => {
    const query = search.trim().toLowerCase();

    const searchableValues = [
      employee.id?.toString(),
      employee.username,
      employee.firstName,
      employee.lastName,
      employee.email,
    ];

    const matchesSearch =
      !query ||
      searchableValues.some((value) =>
        value?.toString().toLowerCase().includes(query),
      );

    const matchesStatus =
      statusFilter === "all" || employee.status === statusFilter;

    const matchesRole =
      roleFilter === "all" || employee.role?.toLowerCase() === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="flex h-screen w-full min-w-0 overflow-hidden bg-[#F8F9FA] font-sans text-gray-900">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Navbar />

        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pt-20">
          <h1 className="mb-6 text-2xl font-black tracking-wide text-[#0F1C33] sm:text-3xl">
            EMPLOYEE & STAFF
          </h1>

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            <StatCard label="All Employee" value={total} />
            <StatCard label="Active Employee" value={active} />
            <StatCard label="Inactive Employee" value={inactive} />
          </div>

          <section className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 border-b border-gray-100 px-4 py-4 sm:px-6">
              <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:items-center">
                <h2 className="shrink-0 text-sm font-black uppercase tracking-wide">
                  Employee Details
                </h2>

                <div className="min-w-0 flex-1 xl:max-w-[380px]">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search for ID, Username, Name, Email"
                    className="w-full rounded-md border border-gray-200 px-3 py-2 text-xs placeholder-gray-400 outline-none transition focus:border-gray-400"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 xl:ml-auto">
                  <FilterSelect
                    label="Status"
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={[
                      { value: "all", label: "All" },
                      { value: "active", label: "Active" },
                      { value: "inactive", label: "Inactive" },
                    ]}
                  />

                  <FilterSelect
                    label="Role"
                    value={roleFilter}
                    onChange={setRoleFilter}
                    options={[
                      { value: "all", label: "All" },
                      { value: "super_admin", label: "Super Admin" },
                      { value: "admin", label: "Admin" },
                      { value: "staff", label: "Staff" },
                    ]}
                  />
                </div>
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table
                className={`min-w-[1050px] w-full text-left text-[11px] ${
                  isStaff ? "min-w-[850px]" : "min-w-[1050px]"
                }`}
              >
                <thead className="bg-[#D9D9D9] font-bold uppercase text-gray-800">
                  <tr>
                    <th className="whitespace-nowrap px-4 py-4">ID NO.</th>
                    <th className="whitespace-nowrap px-4 py-4">USERNAME</th>
                    <th className="whitespace-nowrap px-4 py-4">NAME</th>
                    <th className="whitespace-nowrap px-4 py-4">EMAIL</th>
                    <th className="whitespace-nowrap px-4 py-4">ROLE</th>
                    <th className="whitespace-nowrap px-4 py-4 text-center">
                      STATUS
                    </th>
                    <th className="whitespace-nowrap px-4 py-4 text-center">
                      REQUEST
                    </th>
                    {isAdmin && (
                      <>
                        <th className="whitespace-nowrap px-4 py-4 text-center">
                          DEACTIVATE
                        </th>
                        <th className="whitespace-nowrap px-4 py-4 text-center">
                          ACTION
                        </th>
                      </>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {visibleEmployees.length === 0 && (
                    <tr>
                      <td
                        colSpan={isAdmin ? 9 : 7}
                        className="px-6 py-10 text-center text-xs text-gray-500"
                      >
                        No employees match your search or filters.
                      </td>
                    </tr>
                  )}

                  {visibleEmployees.map((employee) => {
                    const isSelf =
                      (currentUserId &&
                        String(currentUserId) === String(employee.id)) ||
                      (currentUsername &&
                        currentUsername === employee.username) ||
                      (currentUserEmail && currentUserEmail === employee.email);

                    return (
                      <tr
                        key={employee.id}
                        className="font-bold transition-colors hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-4 py-4">
                          {employee.id}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {employee.username}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          {employee.firstName}{" "}
                          {employee.middleInitial
                            ? `${employee.middleInitial}`
                            : ""}{" "}
                          {employee.lastName}
                        </td>
                        <td className="px-4 py-4">
                          <span className="block max-w-[260px] truncate">
                            {employee.email}
                          </span>
                        </td>

                        {/* ROLE COLUMN: May dropdown para sa ibang account kung Super Admin, plain text kung sarili o Admin/Staff */}
                        <td className="px-4 py-4">
                          {currentUserRole === "super_admin" && !isSelf ? (
                            <select
                              value={employee.role}
                              onChange={(e) =>
                                updateRole(employee.id, e.target.value)
                              }
                              className="w-[130px] rounded border border-gray-300 bg-white px-2 py-1 font-semibold outline-none focus:border-gray-500 text-[11px]"
                            >
                              <option value="admin">ADMIN</option>
                              <option value="staff">STAFF</option>
                            </select>
                          ) : (
                            <span className="whitespace-nowrap font-semibold uppercase text-gray-700">
                              {employee.role
                                ? employee.role.replace("_", " ")
                                : "STAFF"}
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-block whitespace-nowrap rounded-full border px-3 py-1 text-[10px] ${
                              employee.status === "active"
                                ? "border-green-500 bg-green-200 text-green-700"
                                : "border-red-500 bg-red-200 text-red-700"
                            }`}
                          >
                            {employee.status.toUpperCase()}
                          </span>
                        </td>

                        {/* REQUEST / CHANGE COLUMN */}
                        <td className="px-4 py-4 text-center">
                          {isAdmin
                            ? employee.requested_role && (
                                <button
                                  onClick={() =>
                                    updateRole(
                                      employee.id,
                                      employee.requested_role,
                                    )
                                  }
                                  type="button"
                                  className="whitespace-nowrap rounded-full border border-yellow-500 bg-yellow-200 px-2 py-1 text-[10px] text-yellow-800 transition hover:bg-yellow-300"
                                >
                                  CHANGE (
                                  {employee.requested_role.toUpperCase()})
                                </button>
                              )
                            : isSelf &&
                              (employee.requested_role ? (
                                <span className="inline-block whitespace-nowrap rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-[11px] font-semibold text-gray-500">
                                  PENDING (
                                  {employee.requested_role.toUpperCase()})
                                </span>
                              ) : (
                                <div className="relative inline-block text-left">
                                  <select
                                    defaultValue=""
                                    onChange={(e) => {
                                      if (e.target.value) {
                                        requestRoleChange(e.target.value);
                                      }
                                    }}
                                    className="
                                    appearance-none
                                    min-w-[110px]
                                    rounded-lg
                                    border border-gray-200
                                    bg-white
                                    py-2 pl-3 pr-8
                                    text-[11px]
                                    font-semibold
                                    text-gray-700
                                    shadow-sm
                                    outline-none
                                    cursor-pointer
                                    transition-all
                                    duration-150
                                    hover:border-gray-300
                                    hover:bg-gray-50
                                    focus:border-gray-400
                                    focus:ring-2
                                    focus:ring-gray-100
                                  "
                                  >
                                    <option value="" disabled>
                                      Request Role
                                    </option>
                                    <option value="admin">ADMIN</option>
                                    <option value="super_admin">
                                      SUPER ADMIN
                                    </option>
                                  </select>
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                    <svg
                                      className="h-4 w-4 fill-current"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                  </div>
                                </div>
                              ))}
                        </td>

                        {isAdmin && (
                          <>
                            <td className="px-4 py-4 text-center">
                              {employee.status === "active" ? (
                                <button
                                  onClick={() => deactivateUser(employee.id)}
                                  type="button"
                                  className="whitespace-nowrap rounded-full border border-amber-600 bg-amber-500 px-2.5 py-1 text-[10px] text-white transition hover:bg-amber-600"
                                >
                                  DEACTIVATE
                                </button>
                              ) : (
                                <button
                                  onClick={() => activateUser(employee.id)}
                                  type="button"
                                  className="whitespace-nowrap rounded-full border border-green-700 bg-green-600 px-2.5 py-1 text-[10px] text-white transition hover:bg-green-700"
                                >
                                  ACTIVATE
                                </button>
                              )}
                            </td>

                            <td className="px-4 py-4 text-center">
                              <button
                                onClick={() =>
                                  console.log(
                                    "Delete feature to be followed for ID:",
                                    employee.id,
                                  )
                                }
                                type="button"
                                className="whitespace-nowrap rounded-full border border-red-600 bg-red-500 px-2.5 py-1 text-[10px] text-white transition hover:bg-red-600"
                              >
                                DELETE
                              </button>
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
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
