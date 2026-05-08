import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Users,
  MoreHorizontal,
  Calendar,
  User,
  Settings,
  Trash2,
  Search,
  Crown,
  Shield,
  MessageCircle,
  Eye,
  UserMinus,
  FolderIcon,
  Building,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CreateTeamModal from "@/components/CreateTeamModal";
import InviteModal from "@/components/InviteModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWorkspace } from "@/hooks/useWorkspace";
import TeamServices from "@/services/team.api";
import toast from "react-hot-toast";
import type { Folder } from "@/contexts/WorkspaceContext";
import MoreOptions from "@/components/MoreOptions";
import { useNavigate, useParams } from "react-router-dom";
import ManageFolders from "@/components/ManageFolders";
import { Spinner } from "@/components/ui/spinner";

export interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
  color: string;
  members: Member[];
  folders: Folder[]
}

interface Member {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  joinedAt: string;
  lastActive: string;
  status: string;
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<"Members" | "Folders">(
    "Members"
  );
  const { activeWorkspace } = useWorkspace();
  // const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { workspaceName } = useParams();

  const handleDeleteTeam = (teamId: string) => {
    setTeams((prev) => prev.filter((team) => team.id !== teamId));
    if (selectedTeam?.id === teamId) {
      setSelectedTeam(null);
    }
  };

  const selectedTeamData = selectedTeam
    ? teams.find((team) => team.id === selectedTeam.id)
    : null;

  const handleTeamSelection = async (teamId: string) => {
    if (!activeWorkspace) return;
    try {
      setLoading(true);
      const team = await TeamServices.getTeam(
        activeWorkspace.id,
        teamId
      );
      team.members = team.members.map((member: { role: string, createdAt: string, user: { name: string, email: string } }) => ({
        name: member.user.name,
        email: member.user.email,
        joinedAt: member.createdAt?.split('T')[0],
        role: member.role
      }));

      setSelectedTeam(team);
    } catch (error) {
      console.error(error)
      if (error instanceof Error) toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeWorkspace) {
      return;
    }

    const fetchTeams = async () => {
      try {
        const teams = await TeamServices.getTeams(activeWorkspace.id);
        setTeams(teams);
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [activeWorkspace]);

  return (
    <div className={`relative flex flex-col flex-1 h-full min-h-0 ${loading ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Header Area */}
      { selectedTeamData && (
        <Button
          variant="ghost"
          onClick={() => setSelectedTeam(null)}
          className="mb-4 w-fit"
        >
          ← Back to Teams
        </Button>
      )}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            {selectedTeamData ? selectedTeamData.name : `Teams (${teams.length})`}
          </h2>
          <p className="text-gray-600 mt-1">
            {selectedTeamData ? selectedTeamData.description : "Select a team to view and manage its members"}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {selectedTeamData ? 
            (
            <Button
              onClick={() => setIsInviteModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Member</span>
            </Button>
          ) : (
          <div className="flex gap-2">
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            variant="outline"
            className="px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create</span>
          </Button>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="outline"
            className="px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Building className="h-4 w-4" />
            <span>Work</span>
          </Button>
          </div>
          )}
        </div>
      </div>

      {teams.length === 0 ? (
        (!loading && 
          <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
            <div className="text-center max-w-md">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                No teams yet
              </h2>
              <p className="text-gray-600 mb-8">
                Create your first team to start collaborating with your workspace members.
              </p>
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Create Team</span>
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className="p-4">
          {!selectedTeam ? (
            <>
              {/* Teams Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto">
                {teams.map((team) => (
                  <Card
                    key={team.id}
                    className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
                    onClick={() => {
                      handleTeamSelection(team.id);
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div
                          className={`w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-2`}
                        >
                          <Users className="h-6 w-6 text-white" />
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Settings className="w-4 h-4 mr-2" />
                              Team Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setSelectedTeam(team)}
                            >
                              <User className="w-4 h-4 mr-2" />
                              Manage Members
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteTeam(team.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="mb-4">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {team.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {team.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <Badge variant="secondary" className="text-xs">
                          {team.memberCount}{" "}
                          {team.memberCount === 1 ? "member" : "members"}
                        </Badge>
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          <span>Created {team.createdAt}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Back to Teams Button */}
              <div className="mb-6">
                <div>
                  {selectedData === "Members" ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Team Members ({selectedTeam.members.length})
                        </h3>
                        <p className="text-gray-600">
                          Manage members and their roles in{" "}
                          {selectedTeam.name}
                        </p>
                      </div>
                      <h3
                        className="text-lg font-semibold text-gray-700 hover:text-blue-900 hover:underline cursor-pointer"
                        onClick={() => setSelectedData("Folders")}
                      >
                        Show Folders
                      </h3>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Team Folders ({selectedTeam.members.length})
                        </h3>
                        <p className="text-gray-600">
                          Manage folders in {selectedTeam.name}
                        </p>
                      </div>
                      <h3
                        className="text-lg font-semibold text-gray-700 hover:text-blue-900"
                        onClick={() => setSelectedData("Members")}
                      >
                        Show Members
                      </h3>
                    </div>
                  )}
                </div>
              </div>

              {/* Members List */}
              {selectedData === "Members" && (
                <div className="bg-white rounded-lg border border-gray-200">
                  <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search members..."
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {selectedTeam.members?.map((member) => (
                      <div key={member.id} className="p-4 hover:bg-gray-50">
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

                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className="font-medium text-gray-900">
                                  {member.name}
                                </h4>
                              </div>
                              <p className="text-sm text-gray-600">
                                {member.email}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                <span>•</span>
                                <span>Joined {member.joinedAt}</span>
                                <span>•</span>
                                <span
                                  className={`flex items-center space-x-1 ${member.status === "active"
                                      ? "text-green-600"
                                      : "text-gray-400"
                                    }`}
                                >
                                  <div
                                    className={`w-2 h-2 rounded-full ${member.status === "active"
                                        ? "bg-green-500"
                                        : "bg-gray-400"
                                      }`}
                                  ></div>
                                  <span>{member.lastActive}</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Select defaultValue={member.role}>
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="TEAM_ADMIN">
                                  <div className="flex items-center space-x-2">
                                    <Crown className="w-4 h-4 text-yellow-600" />
                                    <span>Admin</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="TEAM_MEMBER">
                                  <div className="flex items-center space-x-2">
                                    <Shield className="w-4 h-4 text-blue-600" />
                                    <span>Member</span>
                                  </div>
                                </SelectItem>
                                <SelectItem value="TEAM_VIEWER">
                                  <div className="flex items-center space-x-2">
                                    <User className="w-4 h-4 text-gray-600" />
                                    <span>Viewer</span>
                                  </div>
                                </SelectItem>
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
                                  <MessageCircle className="w-4 h-4 mr-2" />
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <UserMinus className="w-4 h-4 mr-2" />
                                  Remove Member
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedData === "Folders" && (
                <div className="flex space-y-2 gap-6 overflow-y-auto">
                  {/* Folders in list view */}
                  {selectedTeam?.folders.map((folder) => (
                    <div
                      key={folder.id}
                      className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/dashboard/${workspaceName}/folder/${folder.id}`
                        )
                      }
                    >
                      <FolderIcon className="h-8 w-8 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {folder.name}
                        </p>
                        <p className="text-sm text-gray-500">Folder</p>
                      </div>
                      <div className="text-sm text-gray-500">—</div>
                      <div className="text-sm text-gray-500">—</div>
                      <MoreOptions type="folder" item={folder} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center z-auto">
          <Spinner className="size-8 text-gray-900" />
        </div>
      )}
      {/* Invite Member Modal */}
      <InviteModal
        type={"Team"}
        isInviteModalOpen={isInviteModalOpen}
        setIsInviteModalOpen={setIsInviteModalOpen}
        selectedTeam={selectedTeam!}
      />
      <ManageFolders
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        teams={teams}
      />
      <CreateTeamModal
        isCreateModalOpen={isCreateModalOpen}
        setIsCreateModalOpen={setIsCreateModalOpen}
        setTeams={setTeams}
      />
    </div>
  );
}
