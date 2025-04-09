import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

// MongoDB connection function
async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }
  const client = await MongoClient.connect(uri);
  const db = client.db("upper-rank");
  return { client, db };
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { client, db } = await connectToDatabase();

    // Update the post's likes count
    const result = await db.collection("posts").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { likes: 1 } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // Close the database connection
    await client.close();

    return NextResponse.json({
      _id: result._id.toString(),
      likes: result.likes,
    });
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json(
      { error: "Failed to like post" },
      { status: 500 }
    );
  }
} 