let posts = [
  {
    id: "1",
    title: "Best Team Comp for Spiral Abyss",
    content:
      "What teams are you all using for the current Spiral Abyss rotation? I'm struggling with floor 12!",
    image: "https://i.imgur.com/XYZ123.jpg",
    upvotes: 15,
    createdAt: "2023-05-15T10:30:00Z",
    comments: [
      {
        id: "1",
        text: "I used Hu Tao, Xingqiu, Zhongli, and Albedo. Worked great!",
        createdAt: "2023-05-15T11:45:00Z",
      },
      {
        id: "2",
        text: "National team still works wonders for me",
        createdAt: "2023-05-15T12:20:00Z",
      },
    ],
  },
  {
    id: "2",
    title: "Nahida Build Guide",
    content:
      "Here's my complete guide for building Nahida as a main DPS or support. Let me know your thoughts!",
    image: "https://i.imgur.com/ABC456.jpg",
    upvotes: 28,
    createdAt: "2023-05-10T09:15:00Z",
    comments: [
      {
        id: "1",
        text: "Great guide! Have you tried her with Yae Miko?",
        createdAt: "2023-05-10T10:30:00Z",
      },
    ],
  },
];

export const getPosts = async () => {
  return [...posts];
};

export const getPostById = async (id) => {
  return posts.find((post) => post.id === id);
};

export const createPost = async (postData) => {
  const newPost = {
    id: Date.now().toString(),
    title: postData.title,
    content: postData.content || "",
    image: postData.image || "",
    upvotes: 0,
    createdAt: new Date().toISOString(),
    comments: [],
  };
  posts.unshift(newPost);
  return newPost;
};

export const updatePost = async (id, updatedData) => {
  const postIndex = posts.findIndex((post) => post.id === id);
  if (postIndex === -1) throw new Error("Post not found");

  const updatedPost = {
    ...posts[postIndex],
    title: updatedData.title || posts[postIndex].title,
    content: updatedData.content || posts[postIndex].content,
    image: updatedData.image || posts[postIndex].image,
  };

  posts[postIndex] = updatedPost;
  return updatedPost;
};

export const deletePost = async (id) => {
  posts = posts.filter((post) => post.id !== id);
};

export const addComment = async (postId, commentText) => {
  const postIndex = posts.findIndex((post) => post.id === postId);
  if (postIndex === -1) throw new Error("Post not found");

  const newComment = {
    id: Date.now().toString(),
    text: commentText,
    createdAt: new Date().toISOString(),
  };

  const updatedPost = {
    ...posts[postIndex],
    comments: [...posts[postIndex].comments, newComment],
  };

  posts[postIndex] = updatedPost;
  return updatedPost;
};

export const upvotePost = async (postId) => {
  const postIndex = posts.findIndex((post) => post.id === postId);
  if (postIndex === -1) throw new Error("Post not found");

  const updatedPost = {
    ...posts[postIndex],
    upvotes: posts[postIndex].upvotes + 1,
  };

  posts[postIndex] = updatedPost;
  return updatedPost;
};
