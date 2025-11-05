import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  UserCircle,
  FolderIcon,
  FoldersIcon,
  FolderPenIcon,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Sidebar from '@/layouts/Sidebar';
import WorkspaceSelector from '@/components/WorkspaceSelector';
import CreateTeamModal from '@/components/CreateTeamModal';
import InviteModal from '@/components/InviteModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useWorkspace } from '@/hooks/useWorkspace';
import TeamServices from '@/services/team.api';
import toast from 'react-hot-toast';
import { SpinnerColor } from '@/components/Spinner';
import type { Folder } from '@/contexts/WorkspaceContext';
import MoreOptions from '@/components/MoreOptions';
import FileServices from '@/services/files.api';
import { useNavigate, useParams } from 'react-router-dom';
import ManageFolders from '@/components/ManageFolders';

// Mock data for teams with members
interface Team {
  id: string
  name: string
  description: string
  memberCount: number
  createdAt: string
  color: string
  members: Member[]
}

interface Member {
  id: number
  name: string
  email: string
  avatar: string
  role: string
  department: string
  joinedAt: string
  lastActive: string
  status: string
}
const initialTeams = [
  {
    id: 1,
    name: 'Design Team',
    description: 'UI/UX Design and Brand Assets',
    memberCount: 8,
    createdAt: '2024-01-15',
    color: 'bg-purple-500',
    members: [
      {
        id: 1,
        name: 'Sarah Chen',
        email: 'sarah.chen@company.com',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        role: 'Admin',
        department: 'Design',
        joinedAt: '2024-01-15',
        lastActive: '2 hours ago',
        status: 'active'
      },
      {
        id: 2,
        name: 'Mike Johnson',
        email: 'mike.johnson@company.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        role: 'Editor',
        department: 'Design',
        joinedAt: '2024-01-20',
        lastActive: '1 day ago',
        status: 'active'
      },
      {
        id: 3,
        name: 'Emily Watson',
        email: 'emily.watson@company.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        role: 'Viewer',
        department: 'Design',
        joinedAt: '2024-02-01',
        lastActive: '3 days ago',
        status: 'inactive'
      }
    ]
  },
  {
    id: 2,
    name: 'Engineering',
    description: 'Frontend and Backend Development',
    memberCount: 12,
    createdAt: '2024-02-01',
    color: 'bg-blue-500',
    members: [
      {
        id: 4,
        name: 'John Doe',
        email: 'john.doe@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'Admin',
        department: 'Engineering',
        joinedAt: '2024-02-01',
        lastActive: '1 hour ago',
        status: 'active'
      },
      {
        id: 5,
        name: 'Alex Rodriguez',
        email: 'alex.rodriguez@company.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        role: 'Editor',
        department: 'Engineering',
        joinedAt: '2024-02-05',
        lastActive: '30 minutes ago',
        status: 'active'
      },
      {
        id: 6,
        name: 'Lisa Park',
        email: 'lisa.park@company.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
        role: 'Editor',
        department: 'Engineering',
        joinedAt: '2024-02-10',
        lastActive: '2 hours ago',
        status: 'active'
      }
    ]
  },
  {
    id: 3,
    name: 'Marketing',
    description: 'Brand Strategy and Content Creation',
    memberCount: 6,
    createdAt: '2024-02-15',
    color: 'bg-green-500',
    members: [
      {
        id: 7,
        name: 'David Kim',
        email: 'david.kim@company.com',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
        role: 'Admin',
        department: 'Marketing',
        joinedAt: '2024-02-15',
        lastActive: '4 hours ago',
        status: 'active'
      },
      {
        id: 8,
        name: 'Rachel Green',
        email: 'rachel.green@company.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        role: 'Editor',
        department: 'Marketing',
        joinedAt: '2024-02-20',
        lastActive: '1 day ago',
        status: 'active'
      }
    ]
  },
  {
    id: 4,
    name: 'Sales',
    description: 'Customer Relations and Business Development',
    memberCount: 5,
    createdAt: '2024-03-01',
    color: 'bg-orange-500',
    members: [
      {
        id: 9,
        name: 'Tom Wilson',
        email: 'tom.wilson@company.com',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        role: 'Admin',
        department: 'Sales',
        joinedAt: '2024-03-01',
        lastActive: '6 hours ago',
        status: 'active'
      }
    ]
  }
];


export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<"Members"|"Folders">("Members");
  const { activeWorkspace } = useWorkspace();
  const [folders, setFolders] = useState<Folder[]>([])
  const [files, setFiles] = useState<File[]>([]);
  const navigate = useNavigate();
  const { workspaceName } = useParams()
  // const teamColors = [
  //   'bg-purple-500',
  //   'bg-blue-500', 
  //   'bg-green-500',
  //   'bg-orange-500',
  //   'bg-red-500',
  //   'bg-indigo-500',
  //   'bg-pink-500',
  //   'bg-teal-500'
  // ];


  const handleDeleteTeam = (teamId: string) => {
    setTeams(prev => prev.filter(team => team.id !== teamId));
    if (selectedTeam?.id === teamId) {
      setSelectedTeam(null);
    }
  };

  const selectedTeamData = selectedTeam ? teams.find(team => team.id === selectedTeam.id) : null;

  const handleTeamSelection = async (team: Team) => {
    try {
      if (selectedData === "Members") {
        const members = await TeamServices.getMembers(
          activeWorkspace?.id,
          team.id
        );
        setSelectedTeam(() => {
          team.members = members;
          return team;
        });
      }
        const folders = await TeamServices.getFolders(
          activeWorkspace?.id,
          team.id
        );
        setFolders(folders);
      
    } catch (error) {
      toast.error(error.message);
    }
  }

  useEffect(() => {
    if(activeWorkspace?.id)
      TeamServices.getTeams(activeWorkspace.id)
        .then(teams => setTeams(teams))
        .catch(error => toast.error(error.message))
  }, [])

  // Show empty state if no teams
  if (teams.length === 0) {
    return (
        <div className="flex bg-gray-100 min-h-screen p-4 font-sans">
        {/* Container with a subtle shadow and rounded corners */}
      
        <div className="flex flex-1 bg-white rounded-[40px] font-sans shadow-lg max-sm:overflow-x-auto">
          {/* Sidebar */}
          <Sidebar activeTab='Teams' />
        <div className='flex-1 flex flex-col p-10'>
        <div className='flex justify-between'>
        <h2 className='text-3xl font-semibold mt-0 pt-0'>Teams</h2>
          <div className="flex items-center gap-4 text-gray-500">
                <WorkspaceSelector />
                <button className="flex items-center gap-2 p-2 rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-200">
                  <UserCircle size={32} />
                  <span>DB</span>
                </button>
              </div>
        </div>
        {/* Empty State */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No teams yet</h2>
            <p className="text-gray-600 mb-8">Create your first team to start collaborating with your workspace members.</p>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto"
            >
              <Plus className="h-5 w-5" />
              <span>Create Team</span>
            </Button>
          </div>
        </div>

        {/* Create Team Modal */}
        <CreateTeamModal isCreateModalOpen={isCreateModalOpen} setIsCreateModalOpen={setIsCreateModalOpen} setTeams={setTeams} />
      </div>
       {/* {loading && <SpinnerColor /> }  */}
      </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen p-4 font-sans">
      {/* Container with a subtle shadow and rounded corners */}

      <div className="flex flex-1 bg-white rounded-[40px] font-sans shadow-lg max-sm:overflow-x-auto">
        {/* Sidebar */}
        <Sidebar activeTab="Teams" />
        <main className="flex-1 overflow-auto p-4">
          {/* Header */}
          <header className="flex items-center justify-between m-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                {selectedTeamData ? selectedTeamData.name : "All Teams"}
              </h2>
              {selectedTeamData && (
                <p className="text-gray-600 mt-1">
                  {selectedTeamData.description}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {selectedTeamData && (
                <Button
                  onClick={() => setIsInviteModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Member</span>
                </Button>
              )}
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                variant="outline"
                className="px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Team</span>
              </Button>
              {/* Right Icons */}
              {/* <WorkspaceSelector memberships={workspaces} /> */}
              <button className="flex items-center gap-2 p-2 rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-200">
                <UserCircle size={32} />
              </button>
            </div>
          </header>

          <div className="p-4">
            {!selectedTeamData ? (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your Teams ({teams.length})
                  </h3>
                  <p className="text-gray-600">
                    Select a team to view and manage its members
                  </p>
                </div>

                <div className='flex justify-end' onClick={() => setIsModalOpen(true)}>
                  <h3 className="flex text-lg font-semibold text-gray-900 p-2 gap-2 rounded-lg hover:bg-gray-100">
                    <FolderPenIcon /> Add
                  </h3>
                </div>

                {/* Teams Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teams.map((team) => (
                    <Card
                      key={team.id}
                      className={`group hover:shadow-lg transition-all duration-200 cursor-pointer ${
                        selectedTeam?.id === team.id
                          ? "ring-2 ring-blue-500"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedTeam(team);
                        handleTeamSelection(team);
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
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTeam(null)}
                    className="mb-4"
                  >
                    ← Back to Teams
                  </Button>
                  <div>
                    {selectedData === "Members" ? (
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            Team Members ({selectedTeamData.memberCount})
                          </h3>
                          <p className="text-gray-600">
                            Manage members and their roles in{" "}
                            {selectedTeamData.name}
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
                            Team Folders ({selectedTeamData.memberCount})
                          </h3>
                          <p className="text-gray-600">
                            Manage folders in {selectedTeamData.name}
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
                      {selectedTeamData.members?.map((member) => (
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
                                    className={`flex items-center space-x-1 ${
                                      member.status === "active"
                                        ? "text-green-600"
                                        : "text-gray-400"
                                    }`}
                                  >
                                    <div
                                      className={`w-2 h-2 rounded-full ${
                                        member.status === "active"
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
                    {folders.map((folder) => (
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
        </main>
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

        {/* Invite Member Modal */}
        <InviteModal
          type={"Team"}
          isInviteModalOpen={isInviteModalOpen}
          setIsInviteModalOpen={setIsInviteModalOpen}
          selectedTeam={selectedTeam}
        />
      </div>
    </div>
  );
}
