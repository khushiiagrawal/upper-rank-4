### frontend folder

## Community Feature Setup

The community feature allows users to share their experiences with waste management, recycling, and reselling through the 3RVision platform.

### MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas (cloud service)
2. Copy `.env.local.example` to `.env.local`
3. Update the `MONGODB_URI` in `.env.local` with your MongoDB connection string
4. Install the required dependencies:
   ```bash
   npm install mongodb
   ```

### Database Structure

The community feature uses the following collections in the MongoDB database:

- `posts`: Stores user posts with the following schema:
  ```json
  {
    "_id": "ObjectId",
    "title": "String",
    "description": "String",
    "imageUrl": "String",
    "tags": ["String"],
    "platformUsage": "String",
    "author": {
      "name": "String",
      "avatar": "String"
    },
    "createdAt": "Date",
    "likes": "Number",
    "comments": "Number",
    "commentList": [
      {
        "userId": "String",
        "text": "String",
        "createdAt": "Date"
      }
    ]
  }
  ```

### API Routes

The community feature includes the following API routes:

- `GET /api/posts`: Get all posts
- `POST /api/posts`: Create a new post
- `GET /api/posts/[id]`: Get a single post
- `PATCH /api/posts/[id]`: Update a post (like, unlike, add comment)
