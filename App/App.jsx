import React from "react";
import Post from "./Post";

export function App(props) {
  //   const getName = () => {
  //     return "hi!";
  //   };

  return (
    <div className="App">
      <h1>Welcome to Web 102!</h1>
      <Post name="Harry Wu" numLikes="3" />
      <Post name="Christopher" numLikes="23" />
    </div>
  );
}
