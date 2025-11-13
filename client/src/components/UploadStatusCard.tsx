import type { File } from "@/contexts/WorkspaceContext";
import type { Upload } from "@/pages/Dashboard";
import { Check, Clock, FileText, RotateCw, X } from "lucide-react";
import { Progress } from "./ui/progress";

interface props {
  uploads: Upload[];
  setUploads: React.Dispatch<React.SetStateAction<Upload[]>>;
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export function UploadStatusCard({ uploads, setUploads, setFiles }: props) {
  const activeUploads = uploads.filter(
    (u) => u.status === "uploading" || u.status === "pending"
  );
  const completedUploads = uploads.filter(
    (u) => u.status === "completed" || u.status === "failed"
  );

  if (activeUploads.length === 0 && completedUploads.length === 0) return null;

  const renderStatusIcon = (file: Upload) => {
    switch (file.status) {
      case "pending":
        return <Clock size={16} className="text-gray-500" />;
      case "uploading":
        return <RotateCw size={16} className="text-blue-500 animate-spin" />;
      case "completed":
        setFiles((prev) => [...prev]);
        return <Check size={16} className="text-green-500" />;
      case "failed":
        return <X size={16} className="text-red-500" />;
      default:
        return <X size={16} className="text-gray-500" />;
    }
  };

  const handleCancelUpload = (id: string) => {
    setUploads((prev) => {
      const uploadToCancel = prev.find((u) => u.id === id);
      if (uploadToCancel && uploadToCancel.controller) {
        uploadToCancel.controller.abort();
        uploadToCancel.status = 'cancelled';
      }
      return prev;
    });
  };

  const handleClearAll = () => {
    const activeUploads = uploads.filter(
      (u) => u.status === "uploading" || u.status === "pending"
    );
    setUploads(activeUploads);
  };

  const totalActive = activeUploads.length;

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-2xl z-40 p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-4 pb-2 border-b">
        <h4 className="text-lg font-bold text-gray-800">
          {totalActive > 0
            ? `${totalActive} item(s) uploading`
            : "Uploads Complete"}
        </h4>
        <button
          onClick={handleClearAll}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          {totalActive > 0 ? "Hide" : "Clear All"}
        </button>
      </div>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {uploads.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
          >
            <FileText size={24} className="text-gray-500" />

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {file.name}
              </p>
              {file.status === "uploading" && (
                // <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                //   <div
                //     className="bg-blue-600 h-1.5 rounded-full"
                //     style={{ width: `${upload.progress}%` }}
                //   ></div>
                // </div>
                <Progress value={file.progress} className="w-[60%]" />
              )}
              <p className="text-xs text-gray-500">
                {file.status === "uploading" ?
                  `Uploading... ${file.progress}%` :
                file.status}
              </p>
            </div>

            {renderStatusIcon(file)}

            {file.status === "uploading" && (
              <button
                onClick={() => handleCancelUpload(file.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <X size={16} />  {/* close */}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
