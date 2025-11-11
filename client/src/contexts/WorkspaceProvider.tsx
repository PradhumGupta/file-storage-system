import { useEffect, useState, type ReactNode } from "react";
import { WorkspaceContext, type Folder, type Membership, type Workspace } from "./WorkspaceContext";
import { useNavigate, useParams } from "react-router-dom";
import { slugify } from "@/utils/slugify";
import WorkspaceServices from "@/services/workspace.api";
import toast from "react-hot-toast";

const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [activeWorkspace, setActiveWorkspace] = useState<Workspace | null>(null);
  const [activeFolder, setActiveFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [memberships, setMemberships] = useState<Membership[]>([]);

  const setWorkspace = (workspace: Workspace) => {
    setActiveWorkspace(workspace);
    setActiveFolder(null); // reset folder when switching workspace
  };

  const clearWorkspace = () => {
    setActiveWorkspace(null);
    setActiveFolder(null);
  };

  const { workspaceName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {

    const fetchWorkspace = async () => {
      console.log("workspace", workspaceName)
      if (!workspaceName) {
        navigate("/dashboard/personal");
        return;
      }

      setLoading(true);

      try {
        const memberships: Membership[] = await WorkspaceServices.fetchWorkspaces();
        setMemberships(memberships);
        const found = memberships.find(
          (m) =>
            slugify(m.workspace.name) === workspaceName ||
            m.workspace.type === workspaceName.toUpperCase()
        );

        if (found) {
          const res = await WorkspaceServices.fetchData(found.workspace.id);
          setWorkspace(res.workspace);
          setRole(found.role);
        } else {
          // Handle case where workspace is not found, e.g., redirect or show error
          toast.error("Workspace not found");
          // Optionally, navigate to a default or error page
          navigate('/dashboard');
        }
      } catch (error) {
        if (error instanceof Error) toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    // keep calling and running useEffect everytime makes unnecessary calls

    fetchWorkspace();
  }, [workspaceName, navigate]);

  return (
    <WorkspaceContext.Provider
      value={{ activeWorkspace, activeFolder, setWorkspace, setFolder: setActiveFolder, clearWorkspace, loading, setLoading, role, setRole, memberships }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export default WorkspaceProvider