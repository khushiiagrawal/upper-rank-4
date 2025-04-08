import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { writeFile } from 'fs/promises';
import path from 'path';

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
    
    // Parse the request body
    const formData = await request.formData();
    
    // Extract text fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') as string;
    const platformUsage = formData.get('platformUsage') as string;
    
    // Handle image file
    const imageFile = formData.get('image') as File | null;
    let imageUrl = '';
    
    if (imageFile) {
      // Create a unique filename
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      try {
        await writeFile(path.join(uploadDir, 'dummy.txt'), '');
      } catch (error) {
        // Directory doesn't exist, create it
        await writeFile(path.join(uploadDir, 'dummy.txt'), '');
      }
      
      // Generate a unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
      const filename = `${uniqueSuffix}-${imageFile.name}`;
      const filepath = path.join(uploadDir, filename);
      
      // Write the file
      await writeFile(filepath, buffer);
      
      // Set the image URL
      imageUrl = `/uploads/${filename}`;
    }
    
    // Convert tags string to array
    const tagsArray = tags
      ? tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '')
      : [];
    
    // Create post object
    const post = {
      title,
      description,
      imageUrl,
      tags: tagsArray,
      platformUsage,
      author: {
        name: "User", // This would come from user authentication
        avatar: "https://ui-avatars.com/api/?name=User&background=0D9488&color=fff",
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      comments: 0,
      commentList: []
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