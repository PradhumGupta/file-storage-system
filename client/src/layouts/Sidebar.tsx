import { Folder, HardDrive, Users, Menu, Clock, Star } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Sidebar({ activeTab = 'All files' }: { activeTab?: string }) {
  const { workspaceName } = useParams();
  const { activeWorkspace, activeFolder } = useWorkspace();
  const navigate = useNavigate();

  const isPersonal = workspaceName === "personal";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="mb-10 flex items-center gap-2 px-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 600 450"
          role="img"
          aria-label="Zenith logo"
        >
          <path
            d="M100 350 L300 150 L500 350 L430 350 L300 220 L170 350 Z"
            fill="#000000"
          />
          <circle cx="300" cy="80" r="35" fill="#000000" />
        </svg>
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Zenith</h1>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        {/* Quick Access */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            Quick Access
          </h3>
          <nav className="space-y-1">
            <button
              onClick={() => navigate(`/dashboard/${workspaceName}`)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${activeTab === "All files"
                ? "bg-blue-100 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
            >
              <HardDrive size={18} className={activeTab === "All files" ? "text-blue-600" : "text-gray-500"} />
              All files
            </button>
            <button
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <Clock size={18} className="text-gray-500" />
              Recent
            </button>
            <button
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            >
              <Star size={18} className="text-gray-500" />
              Starred
            </button>
          </nav>
        </div>

        {/* Folders */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
            Folders
          </h3>
          <div className="space-y-1">
            {activeWorkspace?.folders?.length === 0 ? (
              <p className="text-sm text-gray-500 px-2">No folders</p>
            ) : (
              activeWorkspace?.folders?.map((folder) => (
                <div key={folder.id}>
                  <button
                    onClick={() => navigate(`/dashboard/${workspaceName}/folder/${folder.id}`)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 ${activeFolder?.id === folder.id
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                  >
                    <Folder
                      size={18}
                      className={activeFolder?.id === folder.id ? "text-blue-600" : "text-gray-400"}
                      fill={activeFolder?.id === folder.id ? "currentColor" : "none"}
                    />
                    <span className="truncate">{folder.name}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Teams (Hidden for personal) */}
        {!isPersonal && (
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-2">
              Teams
            </h3>
            <nav className="space-y-1">
              <button
                onClick={() => navigate(`/dashboard/${workspaceName}/teams`)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${activeTab === "Teams"
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
              >
                <Users size={18} className={activeTab === "Teams" ? "text-blue-600" : "text-gray-500"} />
                Teams
              </button>
              <button
                onClick={() => navigate(`/dashboard/${workspaceName}/members`)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${activeTab === "Members"
                  ? "bg-blue-100 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
              >
                <Users size={18} className={activeTab === "Members" ? "text-blue-600" : "text-gray-500"} />
                Members
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden flex items-center p-4 bg-white border-b border-gray-200 sticky top-0 z-20">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="-ml-2">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-6">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <span className="ml-2 font-bold text-lg text-gray-800">Zenith</span>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 lg:w-72 h-full bg-gray-50 flex-shrink-0 p-6 border-r border-gray-200 flex-col transition-all duration-300">
        <SidebarContent />
      </aside>
    </>
  );
}