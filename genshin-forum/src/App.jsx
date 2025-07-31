import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import PostDetail from "./pages/PostDetails";
import Login from "./pages/Login";
import CreatePost from "./components/CreatePost"; // Add this line
import Signup from "./pages/Signup";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/create-post" element={<CreatePost />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
