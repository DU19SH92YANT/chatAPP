const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./src/db/index.js");
const http = require("http"); // Import the http module
const cors = require("cors");
require("dotenv").config({ path: "./.env" });
const { app } = require("./src/app.js");
const path = require("path");

// Create an HTTP server
const server = http.createServer(app);

// Setup Socket.io with the created HTTP server
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    // origin: "http://localhost:3000", // Ensure this matches your frontend URL
    methods: ["GET", "POST"],
  },
});

// Enable CORS for the Express app
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());

// Middleware to parse JSON
app.use(express.json());

// Serve static files for frontend (optional)
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "frontend", "build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

// Connect to MongoDB and start the server
connectDB()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("MongoDB connection failed!", err);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Setup Socket.io connection
io.on("connection", (socket) => {
  console.log("🔌 Connected to Socket.io");

  socket.on("setup", (userData) => {
    if (!userData || !userData._id) {
      console.log("Invalid user data received during setup.");
      return;
    }
    socket.userId = userData._id; // Save userId to the socket
    socket.join(userData._id);
    socket.emit("connection", { data: "true" });
    console.log(`User ${userData._id} connected and joined their room.`);
  });

  socket.on("join chat", (room) => {
    if (!room) {
      console.log("No room specified for join chat.");
      return;
    }
    // Array.from(socket.rooms).forEach((joinedRoom) => {
    //   if (joinedRoom !== socket.id) {
    //     socket.leave(joinedRoom);
    //     console.log(`User ${socket.userId} left Room: ${joinedRoom}`);
    //   }
    // });
    socket.join(room);
    console.log(`User joined Room: ${room}`);
  });

  socket.on("typing", (room) => {
    if (room) {
      socket.in(room).emit("typing", room);
    }
  });

  socket.on("stop typing", (room) => {
    if (room) {
      socket.in(room).emit("stop typing", room);
    }
  });

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived?.chat;
    if (!chat?.users) {
      console.log("Chat or Chat.users not defined");
      return;
    }

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return; // Skip the sender
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.on("disconnect", () => {
    console.log("USER disconnected");
    console.log("🔌 Socket disconnected");
    if (socket.userId) {
      socket.leave(socket.userId);
      console.log(`User ${socket.userId} left their room.`);
    }
  });
});
// Start the server and listen on a port
server.listen(process.env.PORT || 8000, () => {
  console.log(`⚙️ Server is running at port: ${process.env.PORT || 8000}`);
});
