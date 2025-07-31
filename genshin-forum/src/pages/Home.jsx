import { Link } from "react-router-dom";
import PostList from "../components/PostList";
import SearchAndSort from "../components/SearchAndSort";

export default function Home() {
  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Genshin Impact Community</h1>
        <Link to="/create" className="create-post-btn">
          Create New Post
        </Link>
      </div>

      <SearchAndSort />
      <PostList />
    </div>
  );
}
