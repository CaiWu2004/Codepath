import Post from "./Post";
import { useContext } from "react";
import { PostContext } from "../context/PostContext";
import LoadingSpinner from "./LoadingSpinner";

export default function PostList() {
  const { posts, loading } = useContext(PostContext);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="post-list">
      {posts.length === 0 ? (
        <div className="no-posts">
          <p>No posts found. Be the first to create one!</p>
        </div>
      ) : (
        posts.map((post) => <Post key={post.id} post={post} />)
      )}
    </div>
  );
}
