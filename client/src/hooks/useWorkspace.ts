import { WorkspaceContext } from "@/contexts/WorkspaceContext";
import { useContext } from "react";

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context)
    throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return context;
};
