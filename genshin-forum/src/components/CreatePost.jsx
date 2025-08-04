import { useState, useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import { useAuth } from "../context/AuthContext";
import { FaTimes, FaArrowLeft, FaImage } from "react-icons/fa";

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { createPost } = useContext(PostContext);

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/create" } });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB");
        return;
      }
      setError(null);
      setImageFile(file);
      setPostData((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("You must be logged in to create posts");
      return;
    }

    if (!postData.title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setIsUploading(true);
      const newPost = await createPost(postData, imageFile);
      navigate(`/post/${newPost.id}`);
    } catch (err) {
      console.error("Error creating post:", err);
      setError(
        err.message.includes("profile")
          ? "We had trouble setting up your account. Please try again."
          : err.message || "Failed to create post. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!user) return null;

  return (
    <div className="create-post">
      <button onClick={() => navigate(-1)} className="back-button">
        <FaArrowLeft /> Back
      </button>

      <h2>Create New Post</h2>

      {error && (
        <div className="error-message">
          {error}
          {error.includes("account") && (
            <button onClick={handleSubmit} style={{ marginLeft: "10px" }}>
              Retry
            </button>
          )}
        </div>
      )}

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
            maxLength={100}
            placeholder="Enter post title"
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
            placeholder="Share your thoughts about Genshin Impact..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="image-upload">Upload Image (optional)</label>
          <input
            type="file"
            id="image-upload"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <button
            type="button"
            className="upload-btn"
            onClick={() => fileInputRef.current.click()}
          >
            <FaImage /> {imageFile ? "Change Image" : "Select Image"}
          </button>

          {imageFile && (
            <div className="image-preview-container">
              <div className="image-preview">
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="Preview"
                  className="preview-image"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={removeImage}
                >
                  <FaTimes />
                </button>
              </div>
              <span className="file-name">
                {imageFile.name} ({(imageFile.size / 1024 / 1024).toFixed(2)}MB)
              </span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="image">Or enter image URL (optional)</label>
          <input
            type="text"
            id="image"
            name="image"
            value={postData.image}
            onChange={handleChange}
            disabled={imageFile}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isUploading}
            className={isUploading ? "loading" : ""}
          >
            {isUploading ? "Creating..." : "Create Post"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            disabled={isUploading}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
