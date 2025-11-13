import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useWorkspace } from "@/hooks/useWorkspace";
import FileServices from "@/services/files.api";
import {
  Edit3,
  Trash2,
  Download,
  SquareArrowOutUpRightIcon,
  MoreVertical,
} from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

interface props {
  type: "folder" | "file";
  item: {
    id: string;
    filename?: string;
  };
}

export default function MoreOptions({ type, item }: props) {
  const { activeWorkspace } = useWorkspace();

  if(!activeWorkspace) {
    return;
  }

  const handleEdit = () => {
    toast.success(`Editing`);
  };

  const handleDelete = async () => {
    if (type == "folder") {
      FileServices.deleteFolder(activeWorkspace.id, item.id)
        .then((message) => toast.success(message))
        .catch(() => toast.error("An error occurred"));
    }
    toast.error(`Deleting`);
  };

  // const handleFileOpen = async () => {
  //   const res = await FileServices.downloadFile(activeWorkspace.id, item.id);
  //   if (res.downloadUrl) {
  //     window.open(res.downloadUrl, "_blank");
  //   } else {
  //     alert("Failed to generate download link");
  //   }
  // };

  const handleFileDownload = async () => {
    const file = await FileServices.downloadFile(activeWorkspace.id, item.id);
    if (file) {
      const url = window.URL.createObjectURL(new Blob([file]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", item.filename);
      document.body.appendChild(link);
      link.click();

      console.log(link);

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);

      // // Create a temporary link and click it
      // const link = document.createElement('a');

      // // Append the download query parameter to force download
      // link.href = `${res.downloadUrl}&download`;
      // link.click();
    } else {
      alert("Failed to download");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 hover:bg-gray-100"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48">
        <DropdownMenuItem>
          <Link
            to={`/dashboard/${type}/${item.id}`}
            className="flex gap-2 items-center"
          >
            <SquareArrowOutUpRightIcon className="w-4 h-4 mr-2" />
            <span>Open</span>
          </Link>
        </DropdownMenuItem>

        {/* Download action - only for files */}
        {type === "file" && (
          <DropdownMenuItem onClick={() => handleFileDownload()}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {/* Edit action - available for both */}

        <DropdownMenuItem onClick={() => handleEdit()}>
          <Edit3 className="w-4 h-4 mr-2" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Star/Favorite action - available for both */}
        {/* {onStar && (
          <DropdownMenuItem onClick={(e) => handleAction(onStar, e)}>
            <Star className="w-4 h-4 mr-2" />
            Add to Favorites
          </DropdownMenuItem>
        )} */}

        <DropdownMenuItem
          onClick={() => handleDelete()}
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
