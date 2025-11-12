# FakBok Chula Backend

Backend service for the FakBok Chula anonymous board application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp src/.env.example src/.env
```
Edit the `.env` file with your configuration.

3. Make sure MongoDB is running locally or update the MONGODB_URI in `.env`

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Posts
- `POST /api/posts` - Create a new post
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a specific post
- `DELETE /api/posts/:id` - Delete a post (requires token)

### Comments
- `POST /api/comments/:postId` - Create a comment on a post
- `GET /api/comments/:postId` - Get all comments for a post
- `DELETE /api/comments/:id` - Delete a comment (requires token)

## Authentication

The system uses a simple token-based system where:
- When creating a post/comment, a token is generated and returned
- The token is required to delete the corresponding post/comment
- Store the token securely if you want to manage your posts/comments later