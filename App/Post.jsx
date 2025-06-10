const Post = (props) => {
  return (
    <div className="Post">
      <h3>{props.name}</h3>
      <p>This is my post information :)</p>
      <p>&#10084; {props.numLikes}</p>
    </div>
  );
};

export default Post;
