import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  return (
    <div className="flex bg-gray-100 h-screen p-4 font-sans overflow-hidden">
      {/* Main Container */}
      <div className="flex flex-1 bg-white rounded-[40px] shadow-lg overflow-hidden border border-gray-100">

        {/* Left Sidebar */}
        <Sidebar activeTab="All files" />

        {/* Central Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex flex-col p-6 md:p-10 overflow-hidden">
            {/* Topbar inside the scrollable area or fixed at top? Usually fixed is better, but following the original flow */}
            <Topbar />

            {/* Page Content */}
            <Outlet />
          </div>
        </main>

        {/* Right Sidebar */}
        {/* <RightSidebar /> */}

      </div>
    </div>
  );
}
