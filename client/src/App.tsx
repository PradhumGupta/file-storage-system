import { Navigate, Outlet, Route, Routes } from "react-router-dom"
import Dashboard from "./pages/Dashboard"
import SignupPage from "./pages/SignupPage"
import SigninPage from "./pages/SigninPage"
import LandingPage from "./pages/LandingPage"
import { useAuth } from "./hooks/useAuth"
import { Toaster } from "react-hot-toast"
import TeamsPage from "./pages/TeamsPage"
import MembersPage from "./pages/MembersPage"

// ✅ Protect routes — only authenticated users can access
const PrivateRoute = () => {
  const { user } = useAuth();

  // if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

function App() {
  

  return (
    <div className="min-h-screen">
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path="register" element={<SignupPage />} />
        <Route path="login" element={<SigninPage />} />

        {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="dashboard"> 
                <Route index element={<Dashboard />} />
                <Route path=":workspaceName" element={<Dashboard />} />
                <Route path=":workspaceName/folder/:folderId" element={<Dashboard />} />
                <Route path=":workspaceName/members" element={<MembersPage />} />
                <Route path=":workspaceName/teams" element={<TeamsPage />} />
              </Route>
            </Route>


        <Route path="*" element={<p>404. Page not found</p>} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
