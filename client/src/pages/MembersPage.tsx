import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  MoreHorizontal,
  Mail,
  Calendar,
  X,
  UserIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import WorkspaceServices from "@/services/workspace.api";
import { useWorkspace } from "@/hooks/useWorkspace";
import toast from "react-hot-toast";
import { type User } from "@/contexts/AuthContext";
import InviteModal from "@/components/InviteModal";
import { Spinner } from "@/components/ui/spinner";

interface Member extends User {
  avatar: string;
  status: string;
  role: string;
  joinedAt: string;
  lastActive: string;
}

function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { activeWorkspace, role } = useWorkspace();

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = async (memberId: string, newRole: string) => {
    if(!activeWorkspace) {
      return;
    }
    try {
      await WorkspaceServices.changeRole(activeWorkspace?.id, memberId, newRole);
    } catch (error) {
      if(error instanceof Error) {
        toast.error(error.message);
      } else {
        console.log(error);
      }
    }
    setMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, role: newRole } : member
      )
    );
  };

  const handleRemoveMember = async (memberId: string, name: string) => {
    if(!activeWorkspace) {
      return;
    }
    try {
      await WorkspaceServices.removeMember(activeWorkspace.id, memberId);
    } catch (error) {
      if(error instanceof Error) {
        toast.error(`failed to remove ${name}`);
      } else {
        console.log(error);
      }
    }
    setMembers((prev) => prev.filter((member) => member.id !== memberId));
  };

  useEffect(() => {
    const fetchMembers = async () => {
      if (activeWorkspace) {
        setLoading(true);
        try {
          const members = await WorkspaceServices.getMembers(
            activeWorkspace.id,
            ""
          );
          setMembers(members);
        } catch (error) {
          if (error instanceof Error) toast.error(error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className={`relative flex flex-col flex-1 h-full min-h-0 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">Members</h2>
      </div>

          <div className="mb-6 flex justify-between">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg"
                placeholder="Search members..."
              />
            </div>
            <div className="flex">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2" onClick={() => setIsInviteModalOpen(true)}>
                 <Plus size={10} /> Invite
              </Button>
            </div>
          </div>

          {/* Members List */}
          {loading ? (
            <div className="absolute inset-0 left-1/10 flex justify-center items-center gap-2">
              <Spinner className="size-8 text-gray-800" />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col flex-1 min-h-0">
            <div className="p-6 border-b border-gray-200 shrink-0">
                <h2 className="text-lg font-semibold text-gray-900">
                  Workspace Members ({filteredMembers.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-200 overflow-y-auto min-h-0">
                {filteredMembers.map((member) => {
                  return (
                    <div key={member.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={member.avatar}
                              alt={member.name}
                            />
                            <AvatarFallback>
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-sm font-medium text-gray-900">
                                {member.name}
                              </h3>
                              {/* <Badge className={roleColors[member.role as keyof typeof roleColors]}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {member.role}
                          </Badge> */}
                              {member.status === "inactive" && (
                                <Badge
                                  variant="secondary"
                                  className="bg-gray-100 text-gray-600"
                                >
                                  Inactive
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 mt-1">
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Mail className="w-3 h-3" />
                                <span>{member.email}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Calendar className="w-3 h-3" />
                                <span>
                                  Joined {member.joinedAt.split("T")[0]}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              Last active: {member.lastActive}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Select
                            value={member.role}
                            onValueChange={(value) =>
                              handleRoleChange(member.id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger> 
                            <SelectContent hidden={role !== "OWNER" && role !== "ADMIN"}>
                              <SelectItem value="ADMIN">Admin</SelectItem>
                              <SelectItem value="MEMBER">Member</SelectItem>
                              <SelectItem value="VIEWER">Viewer</SelectItem>
                            </SelectContent>
                          </Select>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <UserIcon className="w-4 h-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                hidden={role !== "ADMIN" && role !== "OWNER"}
                                onClick={() => handleRemoveMember(member.id, member.name)}
                              >
                                <X className="w-4 h-4 mr-2" />
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Invite Member Modal */}
          <InviteModal
            type="Workspace"
            isInviteModalOpen={isInviteModalOpen}
            setIsInviteModalOpen={setIsInviteModalOpen}
          />
    </div>
  );
}

export default MembersPage;
