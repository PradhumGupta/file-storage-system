import {
  Search,
  Grid,
  List,
  UserCircle,
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
import Sidebar from "../layouts/Sidebar";
import WorkspaceSelector from "@/components/WorkspaceSelector";
import { useEffect, useState } from "react";
import WorkspaceServices from "@/services/workspace.api";
import toast from "react-hot-toast";
import type { File, Folder, Membership } from "@/contexts/WorkspaceContext";
import { useNavigate, useParams } from "react-router-dom";
import { useWorkspace } from "@/hooks/useWorkspace";
import { slugify } from "@/utils/slugify";
import { Button } from "@/components/ui/button";
import FileServices from "@/services/files.api";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateFolderForm from "@/components/CreateFolderForm";
import MoreOptions from "@/components/MoreOptions";
import { SpinnerColor } from "@/components/Spinner";
import { UploadModal } from "@/components/UploadModal";
import { UploadStatusCard } from "@/components/UploadStatusCard";

export interface Upload {
  id: string;
  name: string;
  type: string;
  status: string;
  progress: number;
  intervalId: any;
}

const Dashboard = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [files, setFiles] = useState<File[]>([]);

  const [loading] = useState(false);
  const { activeWorkspace, setWorkspace, activeFolder, setFolder } = useWorkspace();

  const { workspaceName, folderId } = useParams(); // from route :workspaceName
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState("Type");
  const [peopleFilter, setPeopleFilter] = useState("People");
  const [imageProperties, setImageProperties] = useState("Image properties");
  const [sortBy, setSortBy] = useState("Most relevant");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [path, setPath] = useState<{ id: string; name: string }[]>([]);
  const [openForm, setOpenForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploads, setUploads] = useState<Upload[]>([]);
  

  useEffect(() => {
    if (!workspaceName) {
      navigate('/dashboard/personal');
      return;
    }

    WorkspaceServices.fetchWorkspaces().then((memberships: Membership[]) => {
      const found = memberships.find(
        (m) =>
          slugify(m.workspace.name) === workspaceName ||
          m.workspace.type === workspaceName.toUpperCase()
      )?.workspace;

      if (found) {
        WorkspaceServices.fetchData(found.id)
          .then((res) => setWorkspace(res.workspace))
          .catch((error) =>
            toast.error(error.response?.data?.message || "An error occurred")
          );
      }
    });
  }, [workspaceName]);

  useEffect(() => {
    if (!activeWorkspace) return;

    const showData = async () => {
      const workspaceId = activeWorkspace.id;

      if (folderId) {
        const folder = await FileServices.showFolder(workspaceId, folderId);
        const path = await FileServices.getPath(workspaceId, folderId);
        setPath(path);
        setFolder(folder);
        setFiles(folder.files);
        setFolders(folder.subFolders);
      } else {
        setPath([]); // workspace root
        setFiles(activeWorkspace.files);
        setFolders(activeWorkspace.folders);
      }
    };

    showData();
  }, [activeWorkspace, folderId]);

  // // Simulate file upload process
  // const startUpload = (file) => {
  //   // 1. Add file to uploads list as 'pending'
  //   const newUpload = {
  //     id: Date.now() + Math.random() + "",
  //     name: file.name,
  //     type: file.type,
  //     progress: 0,
  //     status: 'pending',
  //   };
  //   setUploads(prev => [...prev, newUpload]);

  //   // 2. Start simulated upload after a short delay
  //   setTimeout(() => {
  //     setUploads(prev => prev.map(u => u.id === newUpload.id ? { ...u, status: 'uploading' } : u));
  //     let progress = 0;
  //     const interval = setInterval(() => {
  //       progress += 10;
  //       setFiles(prev => prev.map(u => u.id === newUpload.id ? { ...u, progress: Math.min(progress, 100) } : u));
        
  //       if (progress >= 100) {
  //         clearInterval(interval);
  //         // Simulate success or failure
  //         const finalStatus = Math.random() > 0.1 ? 'complete' : 'failed'; // 10% fail rate
  //         setFiles(prev => prev.map(u => u.id === newUpload.id ? { ...u, status: finalStatus, progress: 100 } : u));
  //       }
  //     }, 300);
      
  //     // Store the interval ID for cancellation
  //     newUpload.intervalId = interval;
  //     setFiles(prev => prev.map(u => u.id === newUpload.id ? { ...u, intervalId: interval } : u));
  //   }, 500);
  // };

  // const handleFileUpload = (fileList) => {
  //   Array.from(fileList).forEach(file => {
  //     startUpload(file);
  //   });
  // };
  
  // const handleCancelUpload = (id) => {
  //     setUploads(prev => {
  //         const uploadToCancel = prev.find(u => u.id === id);
  //         if (uploadToCancel && uploadToCancel.intervalId) {
  //             clearInterval(uploadToCancel.intervalId);
  //         }
  //         return prev.filter(u => u.id !== id);
  //     });
  // };

  // const handleClearAll = () => {
  //     // Clear all completed/failed uploads, but keep active ones if any
  //     const activeUploads = uploads.filter(u => u.status === 'uploading' || u.status === 'pending');
  //     setUploads(activeUploads);
  // };


  return (
    <div className="flex bg-gray-100 h-screen p-4 font-sans">
      {/* Container with a subtle shadow and rounded corners */}
      {loading ? (
        <SpinnerColor />
      ) : (
        <div className="relative flex flex-1 bg-white rounded-[40px] shadow-lg overflow-hidden">
          {/* Sidebar */}
          <Sidebar activeTab="All files" />

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col p-10">
            {/* Top Search and User Bar */}
            <header className="flex items-center justify-between mb-8">
              {/* Search Bar */}
              <div className="relative flex-1 mr-8">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Show me photos from the race yesterday"
                  className="w-5/7 pl-12 pr-4 py-3 rounded-2xl bg-gray-100 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 shadow-md"
                />
              </div>
              {/* Right Icons */}
              <div className="flex items-center gap-4 text-gray-500">
                <WorkspaceSelector />
                <button className="flex items-center gap-2 p-2 rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition-colors duration-200">
                  <UserCircle size={32} />
                  <span>DB</span>
                </button>
              </div>
            </header>

            {/* Breadcrumbs */}
            <div className="mb-6">
              <Breadcrumbs path={path} />
            </div>

            {/* Results Header and Filters */}
            <div className="flex flex-col">
              <h2 className="text-gray-800 text-2xl font-bold mb-2">
                215+ results
              </h2>
              {/* Filters */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <span>{typeFilter}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setTypeFilter("All types")}
                      >
                        All types
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTypeFilter("Images")}>
                        Images
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setTypeFilter("Documents")}
                      >
                        Documents
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTypeFilter("Videos")}>
                        Videos
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <span>{peopleFilter}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setPeopleFilter("Anyone")}
                      >
                        Anyone
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPeopleFilter("Only me")}
                      >
                        Only me
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setPeopleFilter("Shared with me")}
                      >
                        Shared with me
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <span>{imageProperties}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setImageProperties("Any size")}
                      >
                        Any size
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setImageProperties("Large")}
                      >
                        Large
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setImageProperties("Medium")}
                      >
                        Medium
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setImageProperties("Small")}
                      >
                        Small
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center space-x-2"
                      >
                        <span>{sortBy}</span>
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setSortBy("Most relevant")}
                      >
                        Most relevant
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("Name")}>
                        Name
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("Modified")}>
                        Modified
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("Size")}>
                        Size
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <div className="flex border rounded-lg">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="rounded-r-none"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="rounded-l-none"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="default"
                        className="flex items-center space-x-2"
                      >
                        <FilePlus className="h-4 w-4" />
                        <span>Add</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setOpenForm(true)}
                      >
                        Folder
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSortBy("Name")}>
                        <div className="flex justify-center gap-2" onClick={() => setIsModalOpen(true)}>
                          <UploadCloudIcon size={20} />
                          <span>Upload</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CreateFolderForm openForm={openForm} setOpenForm={setOpenForm} setFolders={setFolders} />

              {/* Relevance indicator */}
              <div className="mb-6">
                <span className="text-sm text-gray-500">Relevance</span>
              </div>

              </div>

              

              {viewMode === 'grid' ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 overflow-y-auto">
                {folders.length > 0 &&
                  folders.map((folder) => (
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
                          <FolderIcon className="h-12 w-12 text-blue-600" />
                          
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
                {files.length > 0 &&
                  files.map((file) => (
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
                            <MoreOptions type="folder" item={file} />
                          </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 font-medium">
                        {file.filename}
                      </p>
                    </div>
                  ))}
              </div> ) : (
              <div className="space-y-2">
                {/* Folders in list view */}
                {folders.map((folder) => (
                  <div key={folder.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer" onClick={() =>
                        navigate(
                          `/dashboard/${workspaceName}/folder/${folder.id}`
                        )
                      }>
                    <FolderIcon className="h-8 w-8 text-blue-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{folder.name}</p>
                      <p className="text-sm text-gray-500">Folder</p>
                    </div>
                    <div className="text-sm text-gray-500">—</div>
                    <div className="text-sm text-gray-500">—</div>
                    <MoreOptions type="folder" item={folder} />
                  </div>
                ))}
                
                {/* Files in list view */}
                {files.map((file) => (
                  <div key={file.id} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center">
                      <span className="text-sm">📄</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{file.filename}</p>
                      <p className="text-sm text-gray-500">{file.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={file.uploaderAvatar} alt={file.uploadedBy} />
                        <AvatarFallback className="text-xs">{file.uploadedBy.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-600">{file.uploadedBy}</span>
                    </div>
                    <div className="text-sm text-gray-500 min-w-20">{file.updatedAt}</div>
                    <Share className="h-4 w-4" />
                    <MoreOptions type="file" item={file}/>
                  </div>
                ))}
            </div> 
          )}
          </main>
          {/* Renders the Upload Modal */}
      <UploadModal 
        uploads={uploads}
        setUploads={setUploads}
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
      />
      
      {/* Renders the Upload Status Card */}
      <UploadStatusCard 
        uploads={uploads} 
        setUploads={setUploads}
        setFiles={setFiles}
      />
      
        </div>
      )}
    </div>
  );
};

export default Dashboard;