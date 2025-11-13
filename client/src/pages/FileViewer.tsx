import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useWorkspace } from "@/hooks/useWorkspace";
import FileServices from "@/services/files.api";

const FileViewer = () => {
  const [fileUrl, setFileUrl] = useState("");
  const { activeWorkspace } = useWorkspace();
  const { fileId } = useParams();
  useEffect(() => {
    if(!activeWorkspace) {
      return;
    }
    const fetchFile = async () => {
      try {
        const file = await FileServices.downloadFile(
          activeWorkspace?.id,
          fileId!
        );

        const url = URL.createObjectURL(file);
        setFileUrl(url);
      } catch (err) {
        console.error("Error fetching file:", err);
      }
    };

    if (fileId) {
      fetchFile();
    }

    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileId]);

  if (!fileUrl) {
    return <div>Loading file...</div>;
  }

  return (
    <iframe src={fileUrl} width="100%" height="700px" title="File Viewer" />
  );
};

export default FileViewer;
