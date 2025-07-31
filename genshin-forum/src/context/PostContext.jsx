// src/context/PostContext.jsx
import { createContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export const PostContext = createContext();

export function PostProvider({ children }) {
  // ... existing state declarations ...

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order(sortBy, { ascending: sortBy === "created_at" ? false : true });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      // Handle RLS error specifically
      if (error.code === "42501") {
        console.warn("Row Level Security violation - check your policies");
      }
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (file) => {
    try {
      const user = supabase.auth.user();
      if (!user) throw new Error("User not authenticated");

      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("post_images")
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL with cache-busting
      const {
        data: { publicUrl },
      } = supabase.storage.from("post_images").getPublicUrl(data.path, {
        download: false,
        transform: {
          width: 800,
          height: 600,
          quality: 80,
        },
      });

      return publicUrl;
    } catch (error) {
      console.error("Detailed storage error:", error);
      throw new Error("Image upload failed. Please try again.");
    }
  };

  const createPost = async (postData, imageFile = null) => {
    try {
      const user = supabase.auth.user();
      if (!user) throw new Error("User must be logged in");

      let imageUrl = postData.image || null;

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
            upvotes: 0,
            comments: [],
            user_id: user.id, // Critical for RLS
          },
        ])
        .select();

      if (error) throw error;
      return data[0];
    } catch (error) {
      console.error("Detailed create error:", error);
      throw new Error(error.message || "Failed to create post");
    }
  };

  // ... rest of your existing methods ...
}
