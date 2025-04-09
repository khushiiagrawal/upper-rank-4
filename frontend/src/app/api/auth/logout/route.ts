import { NextResponse } from 'next/server';

export async function POST() {
  // Create response
  const response = NextResponse.json({ success: true });
  
  // Clear the auth cookie
  response.cookies.set({
    name: 'token',
    value: '',
    httpOnly: true,
    path: '/',
    expires: new Date(0), // Expire immediately
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });
  
  return response;
}