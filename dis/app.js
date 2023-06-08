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
const config_1 = __importDefault(require("./config"));
const userController_1 = __importDefault(require("./controllers/userController"));
const { localStrategy, jwtStrategy } = require("./middleware/passport");
const passport = require("passport");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(passport.initialize());
passport.use(localStrategy);
passport.use(jwtStrategy);
app.use(body_parser_1.default.json()); // Add this line to parse JSON bodies
database_1.default
    .initialize()
    .then(() => {
    console.log("db is connected");
})
    .catch((error) => {
    console.log("🚀 ~ file: app.ts:14 ~ database.initialize ~ error:", error);
});
app.listen(config_1.default.server.port, () => {
    return console.log(`[server]: Server is running on ${config_1.default.server.port}`);
});
(0, express_2.attachControllers)(app, [chatController_1.default, userController_1.default]).then(() => {
    console.log("Controller attached");
});
