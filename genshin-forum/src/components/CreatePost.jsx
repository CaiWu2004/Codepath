import { useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PostContext } from "../context/PostContext";

export default function CreatePost() {
  const [postData, setPostData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { createPost, uploadImage } = useContext(PostContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPostData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPostData((prev) => ({ ...prev, image: "" })); // Clear URL if file is selected

      // Preview image
      const reader = new FileReader();
      reader.onload = (event) => {
        // You can use this for preview if needed
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      const newPost = await createPost(postData, imageFile);
      navigate(`/post/${newPost.id}`);
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
            {imageFile ? "Change Image" : "Select Image"}
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
                  ×
                </button>
              </div>
              <span className="file-name">{imageFile.name}</span>
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
          />
        </div>

        {isUploading && (
          <div className="upload-progress">
            <progress value={uploadProgress} max="100" />
            <span>Uploading: {uploadProgress}%</span>
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={isUploading}>
            {isUploading ? "Creating..." : "Create Post"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/")}
            disabled={isUploading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
