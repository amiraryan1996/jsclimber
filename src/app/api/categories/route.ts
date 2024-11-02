import { apiGet, apiPost } from '../database';
import { NextResponse } from 'next/server';

// Get all categories
export async function GET() {
  const query = `SELECT * FROM categories;`;

  try {
    const categories = await apiGet(query);
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ message: 'Error fetching categories' }, { status: 400 });
  }
}

// Add a new category
export async function POST(req: Request) {
  const { name } = await req.json();
  const query = `INSERT INTO categories (name) VALUES (?);`;

  try {
    await apiPost(query, [name]);
    return NextResponse.json({ message: 'Category created successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ message: 'Error creating category' }, { status: 400 });
  }
}
