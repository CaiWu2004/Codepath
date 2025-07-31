import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../context/PostContext";

export default function CreatePost() {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const { createPost } = useContext(PostContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPost = await createPost(postData);
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="create-post">
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={postData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={postData.content}
            onChange={handleChange}
            rows="5"
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL (optional)</label>
          <input
            type="text"
            id="image"
            name="image"
            value={postData.image}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit">Create Post</button>
          <button type="button" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
