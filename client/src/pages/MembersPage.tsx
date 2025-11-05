import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  MoreHorizontal,
  UserPlus,
  Crown,
  Shield,
  Mail,
  Calendar,
  X,
  UserCircle,
  UserIcon,
  UserCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import WorkspaceServices from '@/services/workspace.api';
import { useWorkspace } from '@/hooks/useWorkspace';
import toast from 'react-hot-toast';
import { type User } from '@/contexts/AuthContext';
import Sidebar from '@/layouts/Sidebar';
import WorkspaceSelector from '@/components/WorkspaceSelector';
import { SpinnerColor } from '@/components/Spinner';
import InviteModal from '@/components/InviteModal';

const roleIcons = {
  Admin: Crown,
  Editor: Shield,
  Viewer: UserIcon
};

// const roleColors = {
//   Admin: 'bg-purple-100 text-purple-800',
//   Member: 'bg-blue-100 text-blue-800',
//   Viewer: 'bg-green-100 text-green-800'
// };

interface Member extends User {
  avatar: string
  status: string;
  role: string;
  joinedAt: string;
  lastActive: string
}

function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { activeWorkspace } = useWorkspace();

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoleChange = (memberId: string, newRole: string) => {
    setMembers(prev => prev.map(member =>
      member.id === memberId ? { ...member, role: newRole } : member
    ));
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(prev => prev.filter(member => member.id !== memberId));
  };

  useEffect(() => {
    const fetchMembers = async () => {
      if(activeWorkspace) {
        setLoading(true);
        try {
          const members = await WorkspaceServices.getMembers(activeWorkspace.id, "");
          setMembers(members);
        } catch (error: any) {
          toast.error(error.response?.data?.message || "An error occurred")
        } finally {
          setLoading(false);
        }
      }
    }

    fetchMembers();
  }, [])


  return (
    <div className="flex bg-gray-100 h-screen p-4 font-sans">
      {/* Header */}
      <div className="flex flex-1 bg-white rounded-[40px] shadow-lg overflow-hidden">
          {/* Sidebar */}
          <Sidebar activeTab="Members" />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col p-10">
            {/* Top Search and User Bar */}
            <header className="flex items-center justify-between mb-8">
              {/* Search Bar */}
              <div className="mr-8">
                <h2 className='text-2xl font-semibold text-gray-900'>Members</h2>
              </div>
              {/* Right Icons */}
              <div className="flex items-center gap-4 text-gray-500">
                <WorkspaceSelector />
                <button className="p-2 rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-200">
                  <UserCircle size={32} />
                </button>
              </div>
            </header>

      <div className="p-2">
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
          <div className='flex'>
            <Button onClick={() => setIsInviteModalOpen(true)}> <Plus size={10} /> <span>Invite</span></Button>
          </div>
        </div>

        {/* Members List */}
        {loading ? <SpinnerColor /> : 
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Workspace Members ({filteredMembers.length})
            </h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {filteredMembers.map((member) => {
              const RoleIcon = roleIcons[member.role as keyof typeof roleIcons];
              return (
                <div key={member.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-sm font-medium text-gray-900">{member.name}</h3>
                          {/* <Badge className={roleColors[member.role as keyof typeof roleColors]}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {member.role}
                          </Badge> */}
                          {member.status === 'inactive' && (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
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
                            <span>Joined {member.joinedAt}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Last active: {member.lastActive}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Select
                        value={member.role}
                        onValueChange={(value) => handleRoleChange(member.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
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
                            onClick={() => handleRemoveMember(member.id)}
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
        }
      </div>

      {/* Invite Member Modal */}
      <InviteModal type='Workspace' isInviteModalOpen={isInviteModalOpen} setIsInviteModalOpen={setIsInviteModalOpen} />
      {/* <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Invite Member</span>
            </DialogTitle>
            <DialogDescription>
              Search for a user to invite to your workspace
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                placeholder="Search by email..."
              />
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">People found ({searchResults.length})</label>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {searchResults.map((user) => (
                    <div 
                      key={user.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedUsers.includes(user.id) 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => toggleUserSelection(user.id)}
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>

                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedUsers.includes(user.id)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedUsers.includes(user.id) && (
                          <UserCheck className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Assign Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">
                      <div className="flex items-center space-x-2">
                        <Crown className="w-4 h-4" />
                        <span>Admin - Full access</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Editor">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4" />
                        <span>Editor - Can edit files</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Viewer">
                      <div className="flex items-center space-x-2">
                        <UserIcon className="w-4 h-4" />
                        <span>Viewer - View only</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            

            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsInviteModalOpen(false);
                  setEmail('');
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => handleInviteMember()}
                disabled={!email && !email.endsWith('.com') && !email.endsWith('.in')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Invite Member
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog> */}
      </main>
      </div>
    </div>
  );
}

export default MembersPage;