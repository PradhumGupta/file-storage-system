import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  FolderCheck,
  FolderKanbanIcon,
  FolderIcon,
} from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useWorkspace } from "@/hooks/useWorkspace";
import toast from "react-hot-toast";
import { SpinnerColor } from "./Spinner";
import debounce from "lodash.debounce";
import TeamServices from "@/services/team.api";
import type { Folder } from "@/contexts/WorkspaceContext";
import FileServices from "@/services/files.api";
import { Label } from "./ui/label";

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: string;
  color: string;
}

interface props {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  teams: Team[];
}

function ManageFolders({ isModalOpen, setIsModalOpen, teams }: props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Folder[]>([]);
  const [selectedFolders, setSelectedFolders] = useState<Folder[]>([]);
  const { activeWorkspace } = useWorkspace();
  const [loading, setLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState("");

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }
  };

  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      try {
        const folders = await FileServices.getPublicFolders(
          activeWorkspace!.id
        );
        setSearchResults(folders);
      } catch (error) {
        if(error instanceof Error) toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    if (isModalOpen) fetchFolders();
  }, [isModalOpen]);

  const debouncedHandleSearch = debounce(handleSearch, 500);

  const toggleFolderSelection = (folder: Folder) => {
    setSelectedFolders((prev) =>
      prev.some((u) => u.id === folder.id)
        ? prev.filter((u) => u.id === folder.id)
        : [...prev, folder]
    );
  };

  const assignFoldersToTeam = async () => {
    setLoading(true);
    try {
      const folderIds = selectedFolders.map((folder) => folder.id);
      await TeamServices.assignFolder(
        activeWorkspace!.id,
        selectedTeam,
        folderIds
      );
    } catch (error) {        
      if(error instanceof Error) toast.error(error.message);
    }

    setIsModalOpen(false);
    setSelectedFolders([]);
    setSearchQuery("");
    setLoading(false);
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="max-sm:max-w-xl max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FolderKanbanIcon className="w-5 h-5" />
            <span>ADD Folders</span>
          </DialogTitle>
          <DialogDescription>public folders to add in teams</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search for folders</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={(e) => debouncedHandleSearch(e.target.value)}
                placeholder="Search by name ..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Search Results */}
          {loading && <SpinnerColor />}
          {!loading && searchResults?.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                folders found ({searchResults.length})
              </label>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {searchResults.map((folder) => (
                  <div
                    key={folder.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedFolders.some((u) => u.id === folder.id)
                        ? "bg-blue-50 border-blue-200"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                    onClick={() => toggleFolderSelection(folder)}
                  >
                    <FolderIcon className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{folder.name}</p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedFolders.some((u) => u.id === folder.id)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedFolders.some((u) => u.id === folder.id) && (
                        <FolderCheck className="w-3 h-3 text-white" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {teams.length > 0 && (
            <div className="space-y-2">
              <Label>select a team</Label>
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem value={team.id}>
                      <div className="flex items-center space-x-2">
                        {team.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedFolders([]);
                setSearchQuery("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={assignFoldersToTeam}
              disabled={selectedFolders.length === 0 || selectedTeam === ""}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ManageFolders;
