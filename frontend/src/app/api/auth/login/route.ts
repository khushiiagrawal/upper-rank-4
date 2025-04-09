import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { signToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();
    const users = db.collection('users');

    // Find user
    const user = await users.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = signToken({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role || 'user'
    });

    // Create response with cookie
    const response = NextResponse.json({
      success: true,
      user: { 
        id: user._id.toString(),
        name: user.name, 
        email: user.email,
        role: user.role || 'user'
      }
    });
    
    // Set HTTP-only cookie
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Something went wrong during login' },
      { status: 500 }
    );
  }
}