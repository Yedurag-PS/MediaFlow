require("dotenv").config();

const express = require("express");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

require("./src/startups/db")();
require("./src/startups/prod")(app);
require("./src/startups/routes")(app);
require("./src/startups/socket")(io);

server.listen(PORT, () => console.log(`Server is running on port - ${PORT}...`));
