import express from "express";
import { attachControllers } from "@decorators/express";
import ChatController from "./controllers/chatController";
import database from "./database";
import cors from "cors";
import bodyParser from "body-parser";
import config from "./config";
import UserController from "./controllers/userController";

const { localStrategy, jwtStrategy } = require("./middleware/passport");
const passport = require("passport");

const app = express();

app.use(cors());
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);
app.use(bodyParser.json()); // Add this line to parse JSON bodies

database
  .initialize()
  .then(() => {
    console.log("db is connected");
  })
  .catch((error) => {
    console.log("🚀 ~ file: app.ts:14 ~ database.initialize ~ error:", error);
  });

app.listen(config.server.port, () => {
  return console.log(`[server]: Server is running on ${config.server.port}`);
});

attachControllers(app, [ChatController, UserController]).then(() => {
  console.log("Controller attached");
});
