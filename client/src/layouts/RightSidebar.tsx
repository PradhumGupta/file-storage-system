import { useEffect, useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HardDrive, Users, Folder, Settings } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import WorkspaceServices from "@/services/workspace.api";
import toast from "react-hot-toast";
import { Badge } from "@/components/ui/badge";

export default function RightSidebar() {
  const { activeWorkspace, activeFolder } = useWorkspace();
  const [members, setMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (activeWorkspace) {
        setLoadingMembers(true);
        try {
          const fetchedMembers = await WorkspaceServices.getMembers(
            activeWorkspace.id,
            ""
          );
          setMembers(fetchedMembers);
        } catch (error) {
          if (error instanceof Error) toast.error(error.message);
        } finally {
          setLoadingMembers(false);
        }
      }
    };

    fetchMembers();
  }, [activeWorkspace, activeFolder]);

  if (!activeWorkspace) return null;

  const isFolderView = !!activeFolder;
  const title = isFolderView ? activeFolder.name : activeWorkspace.name;

  const usedStorage = isFolderView ? 15 : 45; // GB
  const totalStorage = isFolderView ? 100 : 100; // GB
  const percentage = (usedStorage / totalStorage) * 100;

  return (
    <aside className="w-80 h-full bg-gray-50 flex-shrink-0 p-6 border-l border-gray-200 flex flex-col hidden lg:flex overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
          {isFolderView ? <Folder size={24} /> : <HardDrive size={24} />}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800 line-clamp-1">{title}</h2>
          <p className="text-sm text-gray-500">
            {isFolderView ? "Folder Details" : "Workspace Overview"}
          </p>
        </div>
      </div>

      {/* Storage Stats */}
      <div className="mb-8 bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <HardDrive size={16} /> Storage
          </h3>
          <span className="text-xs font-medium text-gray-500">{percentage}%</span>
        </div>
        <Progress value={percentage} className="h-2 mb-3 bg-gray-100" />
        <div className="flex justify-between text-xs text-gray-500 font-medium">
          <span>{usedStorage} GB used</span>
          <span>{totalStorage} GB total</span>
        </div>
      </div>

      {/* Team Members */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Users size={16} /> {isFolderView ? "Access" : "Members"}
          </h3>
          <Badge variant="secondary" className="bg-gray-200 text-gray-700 text-xs">
            {members.length}
          </Badge>
        </div>

        {loadingMembers ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-3 overflow-y-auto pr-2">
            {members.slice(0, 10).map((member) => (
              <div key={member.id} className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="text-xs bg-purple-100 text-purple-700">
                      {member.name.split(" ").map((n: string) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
            {members.length > 10 && (
              <p className="text-xs text-center text-gray-500 mt-2 font-medium cursor-pointer hover:text-blue-600">
                View all members
              </p>
            )}
          </div>
        )}
      </div>

      {/* Quick Settings */}
      {!isFolderView && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-gray-100 text-gray-700 transition-colors font-medium text-sm">
            <Settings size={18} />
            Workspace Settings
          </button>
        </div>
      )}
    </aside>
  );
}
