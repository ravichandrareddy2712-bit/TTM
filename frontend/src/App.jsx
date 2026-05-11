import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ProjectsPage from "./pages/ProjectsPage";
import TasksPage from "./pages/TasksPage";
import TeamPage from "./pages/TeamPage";

const AppLayout = ({ children }) => (
  <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
    {/* Animated Background for entire app */}
    <div className="bg-blobs">
      <div className="blob blob-1 opacity-5"></div>
      <div className="blob blob-2 opacity-5"></div>
    </div>

    <Sidebar />
    <div className="flex flex-1 flex-col overflow-hidden">
      <Topbar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  </div>
);

const App = () => (
  <>
    <Toaster position="top-right" />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><AppLayout><ProjectsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><AppLayout><TasksPage /></AppLayout></ProtectedRoute>} />
      <Route path="/team" element={<ProtectedRoute><AppLayout><TeamPage /></AppLayout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

export default App;
