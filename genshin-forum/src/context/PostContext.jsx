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
      if (!user) throw new Error("User must be logged in");
      if (!postData?.title?.trim()) throw new Error("Title is required");

      // Check if profile exists, create if not
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, username")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        // Create profile automatically
        const username =
          user.email?.split("@")[0] || `user_${user.id.slice(0, 8)}`;
        const { error: createError } = await supabase.from("profiles").insert([
          {
            id: user.id,
            username: username,
            avatar_url: null,
          },
        ]);

        if (createError) throw new Error("Failed to setup profile");
      }

      // Upload image if provided
      let imageUrl = null;
      if (imageFile) {
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
            user_id: user.id,
            upvotes: 0,
            comments: [],
          },
        ])
        .select();

      if (error) throw error;

      await fetchPostsWithProfiles();
      return data[0];
    } catch (error) {
      console.error("Error creating post:", error);
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
        uploadImage,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
