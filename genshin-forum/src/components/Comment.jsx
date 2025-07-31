export default function Comment({ comment }) {
  return (
    <div className="comment">
      <div className="comment-content">
        <p>{comment.text}</p>
      </div>
      <div className="comment-meta">
        <span>{new Date(comment.createdAt).toLocaleString()}</span>
      </div>
    </div>
  );
}
