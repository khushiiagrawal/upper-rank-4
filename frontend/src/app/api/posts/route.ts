import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

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
export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db('3rvision');
    
    // Parse the request body as JSON
    const data = await request.json();
    
    // Extract fields from the request body
    const {
      title,
      description,
      tags,
      platformUsage,
      category,
      postType,
      linkUrl,
      image
    } = data;
    
    // Create post object
    const post = {
      title,
      description,
      image,
      tags: Array.isArray(tags) ? tags : [],
      platformUsage,
      category,
      postType: postType || 'text',
      linkUrl,
      author: "Anonymous", // This would come from user authentication
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: [],
      totalVotes: 0,
      userVote: null
    };
    
    // Insert post into database
    const result = await db.collection('posts').insertOne(post);
    
    // Return the created post with its ID
    return NextResponse.json({
      ...post,
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