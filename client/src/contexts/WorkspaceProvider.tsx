import { useState, type ReactNode } from "react";
import { WorkspaceContext, type Folder, type Workspace } from "./WorkspaceContext";

const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [activeFolder, setActiveFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");

  const setWorkspace = (workspace: Workspace) => {
    setActiveWorkspace(workspace);
    setActiveFolder(null); // reset folder when switching workspace
  };

  const clearWorkspace = () => {
    setActiveWorkspace(null);
    setActiveFolder(null);
  };

  return (
    <WorkspaceContext.Provider
      value={{ activeWorkspace, activeFolder, setWorkspace, setFolder: setActiveFolder, clearWorkspace, loading, setLoading, role, setRole }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceProvider