import { Navigate, Outlet, Route, Routes, useParams } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import SignupPage from "./pages/SignupPage"
import SigninPage from "./pages/SigninPage"
import LandingPage from "./pages/LandingPage"
import { useAuth } from "./hooks/useAuth"
import { Toaster } from "react-hot-toast"
import TeamsPage from "./pages/TeamsPage"
import MembersPage from "./pages/MembersPage"
import FileViewer from "./pages/FileViewer"
import WorkspaceProvider from "./contexts/WorkspaceProvider"

// ✅ Protect routes — only authenticated users can access
const PrivateRoute = () => {
  const { user } = useAuth();

  // if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

function WorkspaceBoundary() {
  const { workspaceName } = useParams();
  return (
    <WorkspaceProvider workspaceName={workspaceName}>
      <Outlet />
    </WorkspaceProvider>
  )
}

function App() {
  
  return (
    <div className="min-h-screen">
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="register" element={<SignupPage />} />
        <Route path="login" element={<SigninPage />} />

        {/* Protected Routes */}
            <Route path="dashboard" element={<PrivateRoute />}>
              <Route path=":workspaceName" element={<WorkspaceBoundary />}>
                <Route index element={<Dashboard />} />
                <Route path="folder/:folderId" element={<Dashboard />} />
                <Route path="members" element={<MembersPage />} />
                <Route path="teams" element={<TeamsPage />} />
                <Route path="file/:fileId" element={<FileViewer />} />
              </Route>
            </Route>


        {/* need to  set a useEffect for params so that if one change them - it will immediately check if it exists or not, also check is there the need of doing this */}

        <Route path="*" element={<p>404. Page not found</p>} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
