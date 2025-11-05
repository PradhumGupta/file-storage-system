import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Users } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { Folder } from "@/contexts/WorkspaceContext";
import TeamServices from "@/services/team.api";
import toast from "react-hot-toast";
import { useWorkspace } from "@/hooks/useWorkspace";

interface Team {
  id: string
  name: string
  desc: string
  workspaceId: string
  folders: Folder[]
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
    isCreateModalOpen: boolean 
    setIsCreateModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    setTeams: React.Dispatch<React.SetStateAction<Team[]>>
}

function CreateTeamModal({isCreateModalOpen, setIsCreateModalOpen, setTeams}: props) {
    
    const [newTeamName, setNewTeamName] = useState('');
    const [newTeamDescription, setNewTeamDescription] = useState('');
    const { activeWorkspace } = useWorkspace()
    
  const handleCreateTeam = async () => {
    if (newTeamName.trim()) {
      try {
        const newTeam = await TeamServices.createTeam(activeWorkspace!.id, newTeamName, newTeamDescription);
        toast.success(`Team ${newTeamName} created`);
        setTeams((prev) => [...prev, newTeam])
      } catch (error) {
        toast.error(error?.message)
        console.log(error)
      }
      setIsCreateModalOpen(false);
      setNewTeamName('');
      setNewTeamDescription('');
    }
  };
  return (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Create New Team</span>
              </DialogTitle>
              <DialogDescription>
                Create a team to organize and collaborate with your workspace members
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Team Name</label>
                <Input
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="Enter team name..."
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description </label>
                <Input
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  placeholder="What does this team do?"
                  className="w-full"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreateModalOpen(false);
                    setNewTeamName('');
                    setNewTeamDescription('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateTeam}
                  disabled={!newTeamName.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Team
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
  )
}

export default CreateTeamModal