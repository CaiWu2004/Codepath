import { useEffect } from "react";
import Post from "./Post";
import { useAuth } from "../context/AuthContext";

export default function PostList({
  posts,
  onUpvote,
  onDelete,
  sortBy,
  searchTerm,
}) {
  const { user } = useAuth();

  // Filter and sort posts based on props
  const processedPosts = () => {
    let filteredPosts = [...posts];

    // Apply search filter
    if (searchTerm) {
      filteredPosts = filteredPosts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    if (sortBy === "newest") {
      filteredPosts.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    } else if (sortBy === "upvotes") {
      filteredPosts.sort((a, b) => b.upvotes - a.upvotes);
    }

    return filteredPosts;
  };

  return (
    <div className="post-list">
      {processedPosts().length === 0 ? (
        <div className="no-posts">
          <p>No posts found. Be the first to create one!</p>
        </div>
      ) : (
        processedPosts().map((post) => (
          <Post
            key={post.id}
            post={post}
            onUpvote={() => onUpvote(post.id, post.upvotes + 1)}
            onDelete={() => onDelete(post.id)}
          />
        ))
      )}
    </div>
  );
}
