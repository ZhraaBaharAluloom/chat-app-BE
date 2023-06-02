"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_2 = require("@decorators/express");
const chatController_1 = __importDefault(require("./controllers/chatController"));
const database_1 = __importDefault(require("./database"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json()); // Add this line to parse JSON bodies
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json()); // Middleware to parse JSON request body
database_1.default
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
(0, express_2.attachControllers)(app, [chatController_1.default]).then(() => {
    console.log("Controller attached");
});
