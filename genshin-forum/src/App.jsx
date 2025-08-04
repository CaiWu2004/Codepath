import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";
import CreatePost from "./components/CreatePost";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { PostProvider } from "./context/PostContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./App.css";

// Protected Route component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading-spinner">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

function AppContent() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route path="/post/:id" element={<PostPage />} />
      </Routes>
    </div>
  );
}

// Main App wrapper
export default function App() {
  return (
    <AuthProvider>
      <PostProvider>
        <AppContent />
      </PostProvider>
    </AuthProvider>
  );
}
