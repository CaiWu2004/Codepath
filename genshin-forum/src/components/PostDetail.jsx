import { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PostContext } from "../context/PostContext";
import Comment from "./Comment";
import { FaArrowUp, FaEdit, FaTrash } from "react-icons/fa";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts, updatePost, deletePost, addComment, upvotePost } =
    useContext(PostContext);
  const [commentText, setCommentText] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    image: "",
  });

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
      content: post.content,
      image: post.image,
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await updatePost(post.id, editData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deletePost(post.id);
      navigate("/");
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div className="post-detail">
      <div className="post-content">
        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="edit-form">
            <input
              type="text"
              value={editData.title}
              onChange={(e) =>
                setEditData({ ...editData, title: e.target.value })
              }
              required
            />
            <textarea
              value={editData.content}
              onChange={(e) =>
                setEditData({ ...editData, content: e.target.value })
              }
            />
            <input
              type="text"
              value={editData.image}
              onChange={(e) =>
                setEditData({ ...editData, image: e.target.value })
              }
              placeholder="Image URL (optional)"
            />
            <div className="edit-actions">
              <button type="submit">Save</button>
              <button type="button" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="post-header">
              <span className="post-date">
                {new Date(post.createdAt).toLocaleDateString()}
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
                <FaArrowUp /> Upvote ({post.upvotes})
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
        <h3>Comments ({post.comments.length})</h3>

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
          {post.comments.length === 0 ? (
            <p>No comments yet. Be the first to comment!</p>
          ) : (
            post.comments.map((comment) => (
              <Comment key={comment.id} comment={comment} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
