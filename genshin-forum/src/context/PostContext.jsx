import { createContext, useState, useContext } from "react";
import { supabase } from "../lib/supabaseClient";
import { AuthContext } from "./AuthContext";

export const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchPostsWithProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select(
          `
          *,
          profile:user_id (username, avatar_url)
        `
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    if (!user) throw new Error("User not authenticated");
    if (!file) return null;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("post_images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("post_images").getPublicUrl(data.path);

    return publicUrl;
  };

  const createPost = async (postData, imageFile = null) => {
    try {
      // First, verify user authentication
      console.log("Checking authentication...");
      if (!user) {
        throw new Error("User must be logged in");
      }

      // Double-check with Supabase auth
      const {
        data: { user: currentUser },
        error: authError,
      } = await supabase.auth.getUser();
      console.log("Current authenticated user:", currentUser);
      console.log("Auth error:", authError);

      if (authError || !currentUser) {
        throw new Error("User not authenticated");
      }

      // Validate post data
      if (!postData?.title?.trim()) {
        throw new Error("Title is required");
      }

      console.log("Checking if profile exists...");
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .eq("id", currentUser.id)
        .single();

      console.log("Profile query result:", profile);
      console.log("Profile query error:", profileError);

      // If profile doesn't exist, create it
      if (!profile || profileError?.code === "PGRST116") {
        console.log("Profile doesn't exist, creating new profile...");
        const username =
          currentUser.email?.split("@")[0] ||
          `user_${currentUser.id.slice(0, 8)}`;

        const { data: newProfile, error: createError } = await supabase
          .from("profiles")
          .insert([
            {
              id: currentUser.id,
              username: username,
              avatar_url: null,
            },
          ])
          .select()
          .single();

        console.log("Created profile:", newProfile);
        console.log("Create profile error:", createError);

        if (createError) {
          throw new Error(`Failed to setup profile: ${createError.message}`);
        }
      } else if (profileError && profileError.code !== "PGRST116") {
        // Some other error occurred
        throw new Error(`Profile check failed: ${profileError.message}`);
      }

      console.log("Profile setup successful, creating post...");

      // Upload image if provided
      let imageUrl = null;
      if (imageFile) {
        console.log("Uploading image...");
        imageUrl = await uploadImage(imageFile);
      }

      // Create the post
      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            title: postData.title,
            content: postData.content || null,
            image: imageUrl || postData.image || null,
            user_id: currentUser.id,
            upvotes: 0,
            comments: [],
          },
        ])
        .select();

      if (error) {
        console.error("Post creation error:", error);
        throw new Error(`Failed to create post: ${error.message}`);
      }

      console.log("Post created successfully:", data[0]);
      await fetchPostsWithProfiles();
      return data[0];
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  const upvotePost = async (postId) => {
    try {
      if (!user) {
        throw new Error("User must be logged in to upvote");
      }

      // Get current post data
      const { data: currentPost, error: fetchError } = await supabase
        .from("posts")
        .select("upvotes")
        .eq("id", postId)
        .single();

      if (fetchError) throw fetchError;

      // Increment upvotes
      const newUpvotes = (currentPost.upvotes || 0) + 1;

      const { error } = await supabase
        .from("posts")
        .update({ upvotes: newUpvotes })
        .eq("id", postId);

      if (error) throw error;

      // Update local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, upvotes: newUpvotes } : post
        )
      );

      return newUpvotes;
    } catch (error) {
      console.error("Error upvoting post:", error);
      throw error;
    }
  };

  const addComment = async (postId, commentText) => {
    try {
      if (!user) {
        throw new Error("User must be logged in to comment");
      }

      if (!commentText?.trim()) {
        throw new Error("Comment cannot be empty");
      }

      // Get current post data
      const { data: currentPost, error: fetchError } = await supabase
        .from("posts")
        .select("comments")
        .eq("id", postId)
        .single();

      if (fetchError) throw fetchError;

      // Create new comment object
      const newComment = {
        id: Date.now().toString(), // Simple ID generation
        text: commentText.trim(),
        author: user.email?.split("@")[0] || "Anonymous",
        author_id: user.id,
        created_at: new Date().toISOString(),
      };

      // Add to existing comments
      const updatedComments = [...(currentPost.comments || []), newComment];

      const { error } = await supabase
        .from("posts")
        .update({ comments: updatedComments })
        .eq("id", postId);

      if (error) throw error;

      // Update local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, comments: updatedComments } : post
        )
      );

      return newComment;
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  const updatePost = async (postId, updates) => {
    try {
      if (!user) {
        throw new Error("User must be logged in to update posts");
      }

      const { error } = await supabase
        .from("posts")
        .update(updates)
        .eq("id", postId)
        .eq("user_id", user.id); // Ensure user can only update their own posts

      if (error) throw error;

      // Update local state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, ...updates } : post
        )
      );

      return true;
    } catch (error) {
      console.error("Error updating post:", error);
      throw error;
    }
  };

  const deletePost = async (postId) => {
    try {
      if (!user) {
        throw new Error("User must be logged in to delete posts");
      }

      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", user.id); // Ensure user can only delete their own posts

      if (error) throw error;

      // Update local state
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));

      return true;
    } catch (error) {
      console.error("Error deleting post:", error);
      throw error;
    }
  };

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        fetchPosts: fetchPostsWithProfiles,
        createPost,
        upvotePost,
        addComment,
        updatePost,
        deletePost,
        uploadImage,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
