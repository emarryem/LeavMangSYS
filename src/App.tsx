import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LeaveProvider } from "@/contexts/LeaveContext";
import AuthPage from "./pages/AuthPage";
import WelcomePage from "./pages/WelcomePage";
import Dashboard from "./pages/Dashboard";
import ApplyLeave from "./pages/ApplyLeave";
import AdminPanel from "./pages/AdminPanel";
import ProfilePage from "./pages/ProfilePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/auth" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return !user ? <>{children}</> : <Navigate to="/welcome" />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/auth" element={
      <PublicRoute>
        <AuthPage />
      </PublicRoute>
    } />
    <Route path="/welcome" element={
      <ProtectedRoute>
        <WelcomePage />
      </ProtectedRoute>
    } />
    <Route path="/dashboard" element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    } />
    <Route path="/apply-leave" element={
      <ProtectedRoute>
        <ApplyLeave />
      </ProtectedRoute>
    } />
    <Route path="/admin" element={
      <ProtectedRoute>
        <AdminPanel />
      </ProtectedRoute>
    } />
    <Route path="/profile" element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    } />
    <Route path="/analytics" element={
      <ProtectedRoute>
        <AnalyticsPage />
      </ProtectedRoute>
    } />
    <Route path="/" element={<Navigate to="/auth" />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <LeaveProvider>
            <AppRoutes />
          </LeaveProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
