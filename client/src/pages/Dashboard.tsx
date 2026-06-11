import {
  Grid,
  List,
  ChevronDown,
  FolderIcon,
  FilePlus,
  Share,
  UploadCloudIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { File, Folder } from "@/contexts/WorkspaceContext";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Button } from "@/components/ui/button";
import FileServices from "@/services/files.api";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import CreateFolderForm from "@/components/CreateFolderForm";
import MoreOptions from "@/components/MoreOptions";
import { UploadModal } from "@/components/UploadModal";
import { UploadStatusCard } from "@/components/UploadStatusCard";
import { Spinner } from "@/components/ui/spinner";

export interface Upload {
  id: string;
  name: string;
  type: string;
  status: string;
  progress: number;
  controller: AbortController | null
}

const Dashboard = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const { activeWorkspace, setFolder, loading } = useWorkspace();

  const { workspaceName, folderId } = useParams(); // from route :workspaceName
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("Name");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [path, setPath] = useState<{ id: string; name: string }[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploads, setUploads] = useState<Upload[]>([]);

  useEffect(() => {
    if (!activeWorkspace) return;

    const showData = async () => {
      const workspaceId = activeWorkspace.id;
      if (folderId) {
        try {
          const folder = await FileServices.showFolder(workspaceId, folderId);
          const path = await FileServices.getPath(workspaceId, folderId);

          setPath(path);
          setFolder(folder);
          setFiles(folder.files);
          setFolders(folder.subFolders);
        } catch (error) {
          if (error instanceof Error) toast.error(error.message);
        }
      } else {
        setPath([]); // workspace root
        setFiles(activeWorkspace.files);
        setFolders(activeWorkspace.folders);
      }
    };

    showData();
  }, [activeWorkspace, folderId]);

  const filteredFolders = folders.sort((a, b) => {
    if (sortBy === "Name") return a.name.localeCompare(b.name);
    return 0; // Default or fallback
  });

  const filteredFiles = files.sort((a, b) => {
    if (sortBy === "Name") return a.filename.localeCompare(b.filename);
    if (sortBy === "Modified") return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    return 0;
  });

  const totalItems = filteredFolders.length + filteredFiles.length;

  return (
    <div className={`relative flex flex-col flex-1 h-full min-h-0 ${loading ? "opacity-50 pointer-events-none" : ""}`}>

      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs path={path} />
      </div>

      {/* Results Header and Filters */}
      <div className="flex flex-col">
        <h2 className="text-gray-800 text-2xl font-bold mb-4">
          {totalItems} items
        </h2>
        {/* Filters */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center space-x-2">
                  <span>Sort by {sortBy}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSortBy("Name")}>Sort by Name</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("Size")}>Sort by Size</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("Modified")}>Sort by Modified</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("grid")}
                className={`rounded-none hover:text-gray-600 ${viewMode === "grid" ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-500"}`}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode("list")}
                className={`rounded-none hover:text-gray-600 ${viewMode === "list" ? "bg-blue-500 hover:bg-blue-600 text-white" : "text-gray-500"}`}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="py-2 px-4 rounded-lg flex items-center"
                  onClick={() => setIsModalOpen(true)}
                >
                  <UploadCloudIcon className="h-4 w-4" /> Upload
                </Button>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg flex items-center"
                  onClick={() => setOpenForm(true)}
                >
                  <FilePlus className="h-4 w-4" /> Create
                </Button>
              </div>
          </div>
        </div>

        <CreateFolderForm
          openForm={openForm}
          setOpenForm={setOpenForm}
          setFolders={setFolders}
        />
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-y-auto pb-6 min-h-0">
          {filteredFolders.length > 0 &&
            filteredFolders.map((folder) => (
              <div
                key={folder.id}
                className="bg-gray-50 p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                onClick={() =>
                  navigate(
                    `/dashboard/${workspaceName}/folder/${folder.id}`
                  )
                }
              >
                <div className="relative">
                  <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-3">
                    <FolderIcon className="h-12 w-12 text-blue-400" />

                    <div className="absolute right-3 top-3">
                      <MoreOptions type="folder" item={folder} />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  {folder.name}
                </p>
              </div>
            ))}
          {filteredFiles.length > 0 &&
            filteredFiles.map((file) => (
              <div
                key={file.id}
                className="bg-gray-50 p-4 rounded-xl shadow-md cursor-pointer hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                onClick={() =>
                  activeWorkspace &&
                  FileServices.showFolder(activeWorkspace.id, file.id)
                }
              >
                <div className="relative">
                  <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center mb-3">
                    <div className="text-2xl">
                      📄
                      <div className="absolute right-3 top-3">
                        <MoreOptions type="file" item={file} />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  {file.filename}
                </p>
              </div>
            ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden min-h-0">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0">
            <div className="col-span-6 md:col-span-5">Name</div>
            <div className="col-span-3 hidden md:block">Owner</div>
            <div className="col-span-3">Modified</div>
            <div className="col-span-3 md:col-span-1 text-right">Actions</div>
          </div>
          <div className="divide-y divide-gray-50 overflow-y-auto min-h-0">
            {/* Folders in list view */}
            {filteredFolders.map((folder) => (
              <div
                key={folder.id}
                className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 items-center transition-colors duration-150 cursor-pointer"
                onClick={() =>
                  navigate(`/dashboard/${workspaceName}/folder/${folder.id}`)
                }
              >
                <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                  <FolderIcon className="h-6 w-6 text-blue-500 fill-blue-100" />
                  <span className="font-medium text-gray-800 line-clamp-1">{folder.name}</span>
                </div>
                <div className="col-span-3 hidden md:block text-sm text-gray-500">—</div>
                <div className="col-span-3 text-sm text-gray-500">—</div>
                <div className="col-span-3 md:col-span-1 flex justify-end">
                  <MoreOptions type="folder" item={folder} />
                </div>
              </div>
            ))}

            {/* Files in list view */}
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50 items-center transition-colors duration-150 cursor-pointer"
                onClick={() =>
                  activeWorkspace &&
                  FileServices.showFolder(activeWorkspace.id, file.id)
                }
              >
                <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
                    📄
                  </div>
                  <span className="font-medium text-gray-800 line-clamp-1">{file.filename}</span>
                </div>
                <div className="col-span-3 hidden md:block">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-[10px] bg-purple-100 text-purple-700">
                        {file.uploader?.name?.split(" ").map((n) => n[0]).join("") || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600 line-clamp-1">
                      {file.uploadedBy || file.uploader?.name}
                    </span>
                  </div>
                </div>
                <div className="col-span-3 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(file.updatedAt).toLocaleDateString()}
                </div>
                <div className="col-span-3 md:col-span-1 flex justify-end gap-2 items-center">
                  <Share className="h-4 w-4 text-gray-400 hover:text-blue-500 transition-colors" />
                  <MoreOptions type="file" item={file} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <UploadModal
        setUploads={setUploads}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadComplete={(file: File) => setFiles(prev => [...prev, file])}
      />

      <UploadStatusCard
        uploads={uploads}
        setUploads={setUploads}
      />
      {loading && (
        <div className="flex justify-center items-center gap-2 absolute inset-0">
          <Spinner className="size-8 text-blue-200" />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
