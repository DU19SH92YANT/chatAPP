const express = require("express");

const cookieParser = require("cookie-parser");
// const userRoutes = require('./routes/userRoutes');
const postRoutes = require("./router/post.router.js");

// Routes
// app.use('/api/users', userRoutes);

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//routes import
const userRouter = require("./router/auth.routes.js");
// import healthcheckRouter from "./routes/healthcheck.routes.js"
// import tweetRouter from "./routes/tweet.routes.js"
// import subscriptionRouter from "./routes/subscription.routes.js"
// import videoRouter from "./routes/video.routes.js"
// import commentRouter from "./routes/comment.routes.js"
// import likeRouter from "./routes/like.routes.js"
// import playlistRouter from "./routes/playlist.routes.js"
// import dashboardRouter from "./routes/dashboard.routes.js"

const chatRoutes = require("./router/chat.routes.js");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware.js");
// //routes declaration
app.use("/v1/auth", userRouter);
app.use("/v1/posts", postRoutes);
// app.use("/api/v1/users", userRouter)
// app.use("/api/v1/tweets", tweetRouter)
// app.use("/api/v1/subscriptions", subscriptionRouter)
// app.use("/api/v1/videos", videoRouter)
// app.use("/api/v1/comments", commentRouter)
// app.use("/api/v1/likes", likeRouter)
// app.use("/api/v1/playlist", playlistRouter)
// app.use("/api/v1/dashboard", dashboardRouter)

// http://localhost:8000/api/v1/users/register

app.use("/v1/chat", chatRoutes);

app.use(notFound);
// app.use(errorHandler);

module.exports = { app };
