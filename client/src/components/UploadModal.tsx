import React from "react";
import { X, UploadCloud } from "lucide-react";
import type { Upload } from "@/pages/Dashboard";
import FileServices from "@/services/files.api";
import { useWorkspace } from "@/hooks/useWorkspace";
import toast from "react-hot-toast";

interface props {
  setUploads: React.Dispatch<React.SetStateAction<Upload[]>>;
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal = ({
  setUploads,
  isOpen,
  onClose,
}: props) => {

  const { activeWorkspace, activeFolder } = useWorkspace();
  
  if (!isOpen) return null;

  const handleFileUpload = async (files: FileList) => {
    // Array.from(files).forEach((file) => {
    //   startUpload(file);
    // });

    const uploadsArray = Array.from(files).map(file => ({ 
      id: Date.now() + Math.random() + "",
      name: file.name, 
      type: file.type, 
      status: 'pending', 
      progress: 0,
      controller: new AbortController(),
    }));
    setUploads(uploadsArray);

     uploadsArray.forEach(async (uploads, index) => {
        try {
          await FileServices.upload(activeWorkspace?.id, activeFolder?.id, files[index], (percent) => {
            setUploads(prev => {
              const copy = [...prev];
              copy[index] = { ...copy[index], progress: percent };
              if(percent > 0)
                copy[index].status = 'uploading';
              return copy;
            });
          },
          uploads.controller.signal
        );
        setUploads(prev => {
          const copy = [...prev];
          copy[index].status = "completed";
          return copy;
        });
      } catch (error) {
        if (error instanceof Error) {
          if(error.name === "CanceledError") {
          setUploads(prev => {
            const copy = [...prev];
            copy[index].status = "cancelled";
            return copy;
          });
        } else {
          toast.error(error.message);
        }
       } else {
          console.error("Upload failed:", error);
        }
      }
      })
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileUpload(e.dataTransfer.files);
    onClose();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files.length > 0)
    handleFileUpload(e.target.files);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Upload Files</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div
          className="p-12 m-6 border-2 border-dashed border-blue-400 rounded-xl text-center cursor-pointer hover:bg-blue-50 transition-colors"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <UploadCloud size={48} className="mx-auto mb-4 text-blue-500" />
          <p className="text-lg font-semibold text-gray-800">
            Drag and drop files here
          </p>
          <p className="text-sm text-gray-500 mb-6">
            or click the button below to browse.
          </p>

          <label
            htmlFor="file-upload-input"
            className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Browse Files
          </label>
          <input
            id="file-upload-input"
            type="file"
            className="hidden"
            onChange={handleFileInput}
          />
        </div>

        <div className="p-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
