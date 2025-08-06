import { Link } from "react-router-dom";
import { FaArrowUp, FaComment } from "react-icons/fa";

export default function Post({ post }) {
  return (
    <div className="post-card">
      <Link to={`/post/${post.id}`} className="post-link">
        <div className="post-header">
          <span className="post-date">
            {new Date(post.created_at).toLocaleDateString()}
          </span>
          <h3 className="post-title">{post.title}</h3>
        </div>

        {post.image && (
          <div className="post-image-preview">
            <img src={post.image} alt={post.title} />
          </div>
        )}
      </Link>

      <div className="post-footer">
        <div className="post-stats">
          <span className="upvotes">
            <FaArrowUp /> {post.upvotes || 0}
          </span>
          <span className="comments">
            <FaComment /> {post.comments?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
