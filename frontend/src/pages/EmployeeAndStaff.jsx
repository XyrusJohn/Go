import Sidebar from "./../components/Sidebar";
import Navbar from "./../components/Navbar";

const EmployeeAndStaff = () => {
  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans text-gray-900 overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />
      <Navbar />
    </div>
  );
};

export default EmployeeAndStaff;
