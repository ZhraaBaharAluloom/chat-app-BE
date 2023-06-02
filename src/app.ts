import express from "express";
import { attachControllers } from "@decorators/express";
import ChatController from "./controllers/chatController";
import database from "./database";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json()); // Add this line to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Middleware to parse JSON request body

database
  .initialize()
  .then(() => {
    console.log("db is connected");
  })
  .catch((error) => {
    console.log("🚀 ~ file: app.ts:14 ~ database.initialize ~ error:", error);
  });

app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`);
});

attachControllers(app, [ChatController]).then(() => {
  console.log("Controller attached");
});
