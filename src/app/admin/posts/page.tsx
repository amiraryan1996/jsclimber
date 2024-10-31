// src/app/admin/posts/page.tsx
"use client";
import { useState, useEffect } from "react";

export default function PostsPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const response = await fetch("/api/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  // Other CRUD functions: handleCreate, handleEdit, handleDelete

  return (
    <div>
      {/* <h1>Manage Posts</h1>
      <Button onClick={() => handleCreatePost()}>Create New Post</Button>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.name} - {post.categoryName}
            <Button onClick={() => handleEditPost(post.id)}>Edit</Button>
            <Button onClick={() => handleDeletePost(post.id)}>Delete</Button>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
