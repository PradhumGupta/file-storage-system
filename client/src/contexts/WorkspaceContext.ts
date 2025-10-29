import { createContext } from "react";

export interface Workspace {
  id: string;
  name: string;
  type: "PERSONAL" | "ORGANIZATION";
  createdAt: string;
  updatedAt: string;
  folders: Folder[];
  files: File[];
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string | null;
}

export interface File {
  id: string;
  filename: string;
  type: string;
  path: string;
  workspaceId: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  folderId: string;
}

export interface Membership {
  workspace: Workspace;
  role: "ADMIN" | "MEMBER" | "VIEWER";
}

export interface WorkspaceContextType {
  activeWorkspace: Workspace | null;
  activeFolder: Folder | null;
  setWorkspace: (workspace: Workspace) => void;
  setFolder: (folder: Folder | null) => void;
  clearWorkspace: () => void;
}

export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);




