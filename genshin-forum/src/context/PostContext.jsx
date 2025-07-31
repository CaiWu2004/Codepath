// src/context/PostContext.jsx
import { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../lib/supabaseClient";
import { AuthContext } from "./AuthContext";

export const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
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

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("post_images")
      .upload(fileName, file);

    if (error) throw error;

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("post_images").getPublicUrl(data.path);

    return publicUrl;
  };

  const createPost = async (postData, imageFile = null) => {
    try {
      if (!user) throw new Error("User must be logged in");

      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const { data, error } = await supabase
        .from("posts")
        .insert([
          {
            title: postData.title,
            content: postData.content,
            image: imageUrl,
            user_id: user.id,
          },
        ])
        .select();

      if (error) throw error;
      await fetchPosts(); // Refresh posts after creation
      return data[0];
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  // Add similar error handling for other methods (upvote, etc.)

  return (
    <PostContext.Provider
      value={{
        posts,
        loading,
        fetchPosts,
        createPost,
        uploadImage,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
