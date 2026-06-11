import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  return (
    <div className="flex bg-gray-100 h-screen p-4 font-sans overflow-hidden">
      <div className="flex flex-1 bg-white rounded-[40px] shadow-lg overflow-hidden border border-gray-100">
        <Sidebar activeTab="All files" />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex flex-col p-6 md:p-10 overflow-hidden">
            <Topbar />

            {/* Page Content */}
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
