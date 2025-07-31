import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "../context/AuthContext";

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(username)")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching post:", error);
    } else {
      setPost(data);
    }
  };

  const fetchComments = async () => {
    const { data, error } = await supabase
      .from("comments")
      .select("*, profiles(username)")
      .eq("post_id", id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data);
    }
  };

  const handleUpvote = async () => {
    if (!user) return;

    const newUpvotes = post.upvotes + 1;
    const { error } = await supabase
      .from("posts")
      .update({ upvotes: newUpvotes })
      .eq("id", id);

    if (!error) {
      setPost({ ...post, upvotes: newUpvotes });
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    const { error } = await supabase.from("comments").insert([
      {
        content: newComment,
        post_id: id,
        user_id: user.id,
      },
    ]);

    if (error) {
      alert(error.message);
    } else {
      setNewComment("");
      fetchComments();
    }
  };

  const handleDeletePost = async () => {
    if (!user || user.id !== post.user_id) return;

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (!error) {
      window.location.href = "/";
    }
  };

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail">
      <div className="post-content">
        <div className="post-header">
          <span className="username">
            {post.profiles?.username || "Anonymous"}
          </span>
          <span className="time">
            {formatDistanceToNow(new Date(post.created_at), {
              addSuffix: true,
            })}
          </span>
          {user?.id === post.user_id && (
            <button onClick={handleDeletePost} className="delete-button">
              Delete Post
            </button>
          )}
        </div>
        <h2>{post.title}</h2>
        {post.image_url && (
          <img src={post.image_url} alt="Post visual" className="post-image" />
        )}
        <p>{post.content}</p>
        <div className="post-footer">
          <button onClick={handleUpvote}>Upvote ({post.upvotes})</button>
        </div>
      </div>

      <div className="comments-section">
        <h3>Comments</h3>
        {user ? (
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <button type="submit">Submit</button>
          </form>
        ) : (
          <p>Please login to comment</p>
        )}

        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <span className="username">
                  {comment.profiles?.username || "Anonymous"}
                </span>
                <span className="time">
                  {formatDistanceToNow(new Date(comment.created_at), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
