import LoginPage from "./pages/LoginPage.tsx";
import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup.tsx";
import { Dashboard } from "./pages/Dashboard.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { AuthProvider } from "./components/AuthContext.tsx";
import ShowProperties from "./pages/ShowProperties.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import MyProperties from "./pages/Myproperties.tsx";
import NotFound from "./components/NotFound.tsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/showproperties"
          element={
            <ProtectedRoute>
              <ShowProperties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myproperties"
          element={
            <ProtectedRoute>
              <MyProperties />
            </ProtectedRoute>
          }
        />
        <Route path="/notfound" element={<NotFound />} />
        <Route path="*" element={<NotFound />} /> {/* Wildcard route */}
      </Routes>
    </AuthProvider>
  );
}

export default App;