import { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { RegisterSuccessPage } from "./components/RegisterSuccessPage";
import { ERPDashboard } from "./components/ERPDashboard";

export default function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    name: string;
    avatarUrl?: string | null;
  } | null>(null);

  const handleLogin = (email: string, name: string) => {
    setIsAuthenticated(true);
    setCurrentUser({ email, name });
    navigate("/dashboard", { replace: true });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const handleRegister = (email: string, name: string) => {
    setIsAuthenticated(true);
    setCurrentUser({ email, name });
    navigate("/register-success", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={
            <LoginPage
              onLogin={handleLogin}
              onNavigateToRegister={() => navigate("/register")}
              onNavigateToForgotPassword={() => navigate("/forgot-password")}
            />
          }
        />
        <Route
          path="/register"
          element={
            <RegisterPage
              onRegister={handleRegister}
              onNavigateToLogin={() => navigate("/login")}
            />
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ForgotPasswordPage
              onNavigateToLogin={() => navigate("/login")}
            />
          }
        />
        <Route
          path="/register-success"
          element={
            currentUser ? (
              <RegisterSuccessPage
                userName={currentUser.name}
                userEmail={currentUser.email}
                onContinue={() => navigate("/dashboard")}
              />
            ) : (
              <Navigate to="/register" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated && currentUser ? (
              <ERPDashboard
                user={currentUser}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="*"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </div>
  );
}