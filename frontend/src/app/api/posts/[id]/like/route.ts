import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

// MongoDB connection function
async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }
  const client = await MongoClient.connect(uri);
  const db = client.db("3rvision");
  return { client, db };
}

// Define an interface for the Post document
interface Post {
  _id: ObjectId;
  likes: number;
  // Add other post fields as needed
}

export async function POST(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const { client, db } = await connectToDatabase();

    const result = await db.collection<Post>("posts").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { likes: 1 } },
      { returnDocument: "after" }
    );

    if (!result.value) {
      await client.close();
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    await client.close();

    return NextResponse.json({
      _id: result.value._id.toString(),
      likes: result.value.likes,
    });
  } catch (error) {
    console.error("Error liking post:", error);
    return NextResponse.json(
      { error: "Failed to like post" },
      { status: 500 }
    );
  }
}
