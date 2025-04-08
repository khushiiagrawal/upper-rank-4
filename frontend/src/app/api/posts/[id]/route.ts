import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET /api/posts/[id] - Get a single post
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('3rvision');
    
    const post = await db.collection('posts').findOne({
      _id: new ObjectId(params.id)
    });
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}

// PATCH /api/posts/[id] - Update a post (e.g., like a post)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db('3rvision');
    
    const { action, userId, text } = await request.json();
    
    let updateOperation = {};
    
    if (action === 'like') {
      updateOperation = {
        $inc: { likes: 1 }
      };
    } else if (action === 'unlike') {
      updateOperation = {
        $inc: { likes: -1 }
      };
    } else if (action === 'addComment') {
      updateOperation = {
        $inc: { comments: 1 },
        $push: {
          commentList: {
            userId,
            text,
            createdAt: new Date().toISOString()
          }
        }
      };
    }
    
    const result = await db.collection('posts').updateOne(
      { _id: new ObjectId(params.id) },
      updateOperation
    );
    
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
} 