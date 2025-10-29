import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Crown, Mail, Search, Shield, User, UserCheck } from 'lucide-react';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useWorkspace } from '@/hooks/useWorkspace';
import toast from 'react-hot-toast';
import WorkspaceServices from '@/services/workspace.api';
import { SpinnerColor } from './Spinner';
import debounce from "lodash.debounce"

interface Team {
  id: number
  name: string
  description: string
  memberCount: number
  createdAt: string
  color: string
  members: Member[]
}

interface Member {
  id: string
  name: string
  email: string
  avatar: string
  role: string
  joinedAt: string
  lastActive: string
  status: string
}

interface props {
    type: "Team" | "Workspace"
    isInviteModalOpen: boolean
    setIsInviteModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    modalName: string
}


// Mock search results for invite modal
const mockSearchResults = [
  {
    id: 101,
    name: 'Jessica Brown',
    email: 'jessica.brown@company.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    department: 'Product'
  },
  {
    id: 102,
    name: 'Michael Davis',
    email: 'michael.davis@company.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    department: 'Operations'
  },
  {
    id: 103,
    name: 'Amanda Taylor',
    email: 'amanda.taylor@company.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    department: 'HR'
  }
];

interface User {
  id: string;
  name: string
  email: string
  avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face';
}


function InviteModal({ type, isInviteModalOpen, setIsInviteModalOpen, modalName}: props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [inviteRole, setInviteRole] = useState('VIEWER');
  const { activeWorkspace } = useWorkspace();
  const [loading, setLoading] = useState(false);

  

const handleSearch = async (query: string) => {
  setSearchQuery(query);
  if (query.trim() === '') {
    setSearchResults([]);
    return;
  }
  setLoading(true);
  try {
    let users;
    if(type === "Workspace")
      users = await WorkspaceServices.getInviteUsers(activeWorkspace?.id, query);
    else 
      users = await WorkspaceServices.getMembers(activeWorkspace?.id, query);
    setSearchResults(users);
  } catch (error: any) {
    toast.error(error.response?.data?.message || "An error occurred")
  } finally {
    setLoading(false);
  }
}

  const debouncedHandleSearch = debounce(handleSearch, 500);

  const toggleUserSelection = (user: User) => {
    setSelectedUsers(prev => 
      prev.some(u => u.id === user.id) ?
        prev.filter(u => u.id === user.id) : [...prev, user]
    );
  };

  const handleInviteUsers = async () => {
    if (modalName === "Workspace") {
      const newMemberIds = selectedUsers.map(user => user.id);

      await WorkspaceServices.inviteMembers(activeWorkspace!.id, newMemberIds, inviteRole)

    } else {
      const usersToInvite = searchResults.filter(user => selectedUsers.includes(user.id));
      const newMembers = usersToInvite.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: inviteRole,
        joinedAt: new Date().toISOString().split('T')[0],
        lastActive: 'Just joined',
        status: 'active'
      }));
    } 

      setIsInviteModalOpen(false);
      setSelectedUsers([]);
      setSearchQuery('');
      setInviteRole('Viewer');
    
  };
  return (
    <Dialog open={isInviteModalOpen} onOpenChange={setIsInviteModalOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Mail className="w-5 h-5" />
              <span>Add Members to {modalName}</span>
            </DialogTitle>
            <DialogDescription>
              Search and add new members to collaborate in this {type?.toLowerCase()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Search for people</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => debouncedHandleSearch(e.target.value)}
                  placeholder="Search by name or email..."
                  className="pl-10"
                />
              </div>
            </div>

            {/* Search Results */}
            {loading && <SpinnerColor />}
            {!loading && searchResults.length > 0 && searchQuery && (
              <div className="space-y-2">
                <label className="text-sm font-medium">People found ({searchResults.length})</label>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {searchResults.map((user) => (
                    <div 
                      key={user.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedUsers.some(u => u.id === user.id) 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                      onClick={() => toggleUserSelection(user)}
                    >
                      {/* <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar> */}
                      
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>

                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedUsers.some(u => u.id === user.id)
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedUsers.some(u => u.id === user.id) && (
                          <UserCheck className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Role Selection */}
            {selectedUsers.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Assign role to selected members</label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">
                      <div className="flex items-center space-x-2">
                        <Crown className="w-4 h-4 text-yellow-600" />
                        <div>
                          <div className="font-medium">Admin</div>
                          <div className="text-xs text-gray-500">Full access to team settings and members</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="MEMBER">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-blue-600" />
                        <div>
                          <div className="font-medium">Member</div>
                          <div className="text-xs text-gray-500">Can edit files and manage team content</div>
                        </div>
                      </div>
                    </SelectItem>
                    <SelectItem value="VIEWER">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-600" />
                        <div>
                          <div className="font-medium">Viewer</div>
                          <div className="text-xs text-gray-500">Can view and comment on team content</div>
                        </div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsInviteModalOpen(false);
                  setSelectedUsers([]);
                  setSearchQuery('');
                  setInviteRole('Viewer');
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleInviteUsers}
                disabled={selectedUsers.length === 0}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Invite {selectedUsers.length} {selectedUsers.length === 1 ? 'Member' : 'Members'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
  )
}

export default InviteModal