const cors = require('cors')
const express = require('express')

const logger = require("../config/logger")
const userRoutes = require('../modules/user/user.routes')
const postRoutes = require('../modules/post/post.routes')
const chatRoutes = require('../modules/chat/chat.routes')


module.exports = function (app) {
    app.use(cors());
    app.use(express.json());
    
    app.use("/api/user", userRoutes);
    app.use("/api/posts", postRoutes);
    app.use("/api/chats", chatRoutes);
    
    // Custom erroe handler
    app.use((error, req, res, next) => {
      console.log(error);
      // log the error in file or in database
      logger.error(error.message, {
        method: req.method,
        path: req.originalUrl,
        stack: error.stack,
      });
      return res.status(500).json({
        message: "Oops! Something went wrong on our side. We're working on it.",
      });
    });
}