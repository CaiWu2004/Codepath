import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";
import CharacterSelector from "./CharacterSelector";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [character, setCharacter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("Please log in to create posts");
      return;
    }

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("posts").insert({
        title: title.trim(),
        content: content.trim(),
        image_url: imageUrl.trim() || null,
        character_name: character.trim() || null,
        user_id: user.id,
        upvotes: 0,
      });

      if (error) throw error;

      // Reset form
      setTitle("");
      setContent("");
      setImageUrl("");
      setCharacter("");
      navigate("/");
    } catch (err) {
      setError(err.message || "Failed to create post");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="create-post">
        <h3>Create a Post</h3>
        <p>Please log in to create posts</p>
      </div>
    );
  }

  return (
    <div className="create-post">
      <h3>Create a Post</h3>
      {error && (
        <div
          className="error-message"
          style={{ color: "red", marginBottom: "1rem" }}
        >
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Post Title *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <textarea
          placeholder="Content (optional)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
        <input
          type="url"
          placeholder="Image URL (optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          disabled={isSubmitting}
        />
        <CharacterSelector onSelect={setCharacter} disabled={isSubmitting} />
        <button type="submit" disabled={isSubmitting || !title.trim()}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
