import { useState, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import Comment from "./Comment";
import { FaArrowUp, FaEdit, FaTrash, FaTimes } from "react-icons/fa";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, updatePost, deletePost, addComment, upvotePost, uploadImage } =
    useContext(PostContext);
  const [commentText, setCommentText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const post = posts.find((p) => p.id === id);

  if (!post) {
    return <div className="post-not-found">Post not found</div>;
  }

  const handleUpvote = () => {
    upvotePost(post.id);
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText("");
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({
      title: post.title,
      content: post.content || "",
      image: post.image || "",
    });
    setImageFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setEditData((prev) => ({ ...prev, image: "" })); // Clear URL if file is selected
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);
      await updatePost(post.id, editData, imageFile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(post.id);
        navigate("/");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <div className="post-detail">
      <div className="post-content">
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="edit-form">
            <div className="form-group">
              <label>Title*</label>
              <input
                type="text"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label>Content</label>
              <textarea
                value={editData.content}
                onChange={(e) =>
                  setEditData({ ...editData, content: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Upload New Image (optional)</label>
              <input
                type="file"
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
                      <FaTimes />
                    </button>
                  </div>
                  <span className="file-name">{imageFile.name}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Or enter image URL (optional)</label>
              <input
                type="text"
                value={editData.image}
                onChange={(e) =>
                  setEditData({ ...editData, image: e.target.value })
                }
                disabled={imageFile}
              />
            </div>

            <div className="edit-actions">
              <button type="submit" disabled={isUploading}>
                {isUploading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isUploading}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="post-header">
              <span className="post-date">
                {new Date(post.created_at).toLocaleDateString()}
              </span>
              <h2>{post.title}</h2>
            </div>

            {post.image && (
              <div className="post-image">
                <img src={post.image} alt={post.title} />
              </div>
            )}

            {post.content && (
              <div className="post-text">
                <p>{post.content}</p>
              </div>
            )}

            <div className="post-actions">
              <button onClick={handleUpvote} className="upvote-btn">
                <FaArrowUp /> Upvote ({post.upvotes || 0})
              </button>

              <div className="post-admin-actions">
                <button onClick={handleEdit} className="edit-btn">
                  <FaEdit /> Edit
                </button>
                <button onClick={handleDelete} className="delete-btn">
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="post-comments">
        <h3>Comments ({post.comments?.length || 0})</h3>

        <form onSubmit={handleAddComment} className="comment-form">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            required
          />
          <button type="submit">Post Comment</button>
        </form>

        <div className="comments-list">
          {post.comments?.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            post.comments?.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
