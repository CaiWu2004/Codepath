import { createContext, useState, useEffect } from "react";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  addComment,
  upvotePost,
} from "../services/posts";

export const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsData = await getPosts();
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const handleCreatePost = async (postData) => {
    try {
      const newPost = await createPost(postData);
      setPosts([newPost, ...posts]);
      return newPost;
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  const handleUpdatePost = async (id, updatedData) => {
    try {
      const updatedPost = await updatePost(id, updatedData);
      setPosts(posts.map((post) => (post.id === id ? updatedPost : post)));
      return updatedPost;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  };

  const handleDeletePost = async (id) => {
    try {
      await deletePost(id);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  };

  const handleAddComment = async (postId, comment) => {
    try {
      const updatedPost = await addComment(postId, comment);
      setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)));
      return updatedPost;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  const handleUpvote = async (postId) => {
    try {
      const updatedPost = await upvotePost(postId);
      setPosts(posts.map((post) => (post.id === postId ? updatedPost : post)));
    } catch (error) {
      console.error("Error upvoting post:", error);
      throw error;
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return b.upvotes - a.upvotes;
    }
  });

  return (
    <PostContext.Provider
      value={{
        posts: sortedPosts,
        loading,
        searchTerm,
        setSearchTerm,
        sortBy,
        setSortBy,
        createPost: handleCreatePost,
        updatePost: handleUpdatePost,
        deletePost: handleDeletePost,
        addComment: handleAddComment,
        upvotePost: handleUpvote,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
