import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { cookies } from 'next/headers'; // Add this import
import { verifyToken } from '@/lib/jwt'; // Add this import (assuming you have this function)

// GET /api/posts - Get all posts
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('3rvision');
    
    const posts = await db.collection('posts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

// POST /api/posts - Create a new post
export async function POST(req: Request) {
  try {
    // Get user from JWT token in cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    // Get user data from token
    let user = null;
    if (token) {
      try {
        user = verifyToken(token);
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
    
    const userData = await req.json();
    
    // Ensure the author field is set from the authenticated user
    const postData = {
      ...userData,
      author: (user && typeof user === 'object' && 'name' in user ? user.name : undefined) || userData.author || "Anonymous",
      timestamp: new Date().toISOString(),
    };
    
    const client = await clientPromise;
    const db = client.db('3rvision');
    
    // Insert post into database
    const result = await db.collection('posts').insertOne(postData);
    
    // Return the created post with its ID
    return NextResponse.json({
      ...postData,
      _id: result.insertedId
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}