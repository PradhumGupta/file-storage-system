import { Search } from "lucide-react";
import WorkspaceSelector from "@/components/WorkspaceSelector";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="flex items-center justify-between mb-8">
      {/* Search Bar */}
      <div className="relative flex-1 mr-8 hidden md:block">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search"
          className="w-full max-w-md pl-12 pr-4 py-3 rounded-2xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-sm border border-gray-200"
        />
      </div>
      {/* Search Bar Mobile placeholder to keep flex structure */}
      <div className="md:hidden flex-1"></div>

      {/* Right Icons */}
      <div className="flex items-center gap-4 text-gray-500">
        <WorkspaceSelector />
        <button className="flex items-center gap-2 p-1 rounded-full text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-200">
          <Avatar className="w-10 h-10 border border-gray-200 shadow-sm">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-blue-600 text-white font-semibold">
              {user?.name?.split(" ").map((n) => n[0]).join("") || "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    </header>
  );
}
