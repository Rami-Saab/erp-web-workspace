import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { RegisterPage } from "./components/RegisterPage";
import { ForgotPasswordPage } from "./components/ForgotPasswordPage";
import { RegisterSuccessPage } from "./components/RegisterSuccessPage";
import { ERPDashboard } from "./components/ERPDashboard";
import { useAuth } from "./hooks/useAuth";
import { ERPProvider } from "./contexts/ERPContext";

// NotFound Component
function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-gray-600 mb-4">Page not found</p>
        <Navigate to="/login" replace />
      </div>
    </div>
  );
}

export default function App() {
  const { currentUser, login, logout, register } = useAuth();

  const handleLogin = (email: string, name: string) => {
    login(email, name);
  };

  const handleLogout = () => {
    logout();
  };

  const handleRegister = (email: string, name: string) => {
    register(email, name);
  };

  return (
    <ERPProvider>
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
              />
            }
          />
          <Route
            path="/register"
            element={
              <RegisterPage
                onRegister={handleRegister}
                onNavigateToLogin={() => <Navigate to="/login" replace />}
                onNavigateToDashboard={() => <Navigate to="/dashboard" replace />}
              />
            }
          />
          <Route
            path="/forgot-password"
            element={
              <ForgotPasswordPage
                onNavigateToLogin={() => <Navigate to="/login" replace />}
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
                  onContinue={() => <Navigate to="/dashboard" replace />}
                />
              ) : (
                <Navigate to="/register" replace />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              currentUser ? (
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
            element={<NotFound />}
          />
        </Routes>
      </div>
    </ERPProvider>
  );
}