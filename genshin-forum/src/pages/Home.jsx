import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import PostList from "../components/PostList";
import CreatePost from "../components/CreatePost";
import Auth from "../components/Auth";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, [sortBy, searchTerm]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("posts")
        .select("*, profiles(username)")
        .order(sortBy === "newest" ? "created_at" : "upvotes", {
          ascending: sortBy !== "newest",
        });

      if (searchTerm) {
        query = query.ilike("title", `%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async (postId, newUpvotes) => {
    try {
      const { error } = await supabase
        .from("posts")
        .update({ upvotes: newUpvotes })
        .eq("id", postId);

      if (!error) {
        setPosts(
          posts.map((post) =>
            post.id === postId ? { ...post, upvotes: newUpvotes } : post
          )
        );
      }
    } catch (error) {
      console.error("Error upvoting post:", error);
    }
  };

  const handleDelete = async (postId) => {
    try {
      const { error } = await supabase.from("posts").delete().eq("id", postId);

      if (!error) {
        setPosts(posts.filter((post) => post.id !== postId));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="home">
      <Auth />
      <div className="controls">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          disabled={loading}
        >
          <option value="newest">Newest First</option>
          <option value="upvotes">Most Upvoted</option>
        </select>
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>
      <CreatePost onPostCreated={fetchPosts} />
      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : (
        <PostList
          posts={posts}
          sortBy={sortBy}
          searchTerm={searchTerm}
          onUpvote={handleUpvote}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
