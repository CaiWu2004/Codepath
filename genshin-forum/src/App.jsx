import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostPage from "./pages/PostPage";
import CreatePost from "./components/CreatePost";
import { PostProvider } from "./context/PostContext";
import "./App.css"; // Fixed import path

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <PostProvider>
      <div className={`app ${darkMode ? "dark" : "light"}`}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </div>
    </PostProvider>
  );
}

export default App;
