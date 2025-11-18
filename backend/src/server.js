import "dotenv/config";
import connectDB from "./config/db.js"; 
import app from "./app.js";             

// Connect to MongoDB
await connectDB();

// Handle uncaught exceptions (sync error)
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  console.log(err.stack);
  process.exit(1);
});

// Start server

const PORT = 3222;
const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend Server ready at http://localhost:${PORT}`);
});

// Handle unhandled promise rejections (async error)
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
