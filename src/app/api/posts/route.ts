  import { NextResponse } from "next/server";
import { apiGet, apiPost } from "../database";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  const query = `
    SELECT posts.*, categories.name as categoryName 
    FROM posts 
    LEFT JOIN categories ON posts.categoryId = categories.id;
  `;

  try {
    const posts = await apiGet(query);
    // ?NextResponse: Produce a response with the given JSON body.
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { message: "Error fetching posts" },
      { status: 400 }
    );
  }
}

// Add a new post
export async function POST(req: Request) {
  const {
    name,
    description,
    imageUrl,
    articleUrl,
    slug,
    date,
    categoryId,
    summary,
  } = await req.json();

  const query = `
    INSERT INTO posts (name, description, imageUrl, articleUrl, slug, date, categoryId, summary)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?);
  `;
  const values = [
    name,
    description,
    imageUrl,
    articleUrl,
    slug,
    date,
    categoryId,
    summary,
  ];

  try {
    await apiPost(query, values);
    return NextResponse.json(
      { message: "Post created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { message: "Error creating post" },
      { status: 400 }
    );
  }
}

// Additional DELETE and PATCH functions can be defined similarly
