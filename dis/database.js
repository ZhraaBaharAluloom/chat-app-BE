"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const chat_1 = __importDefault(require("./entities/chat"));
const database = new typeorm_1.DataSource({
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: "postgres",
    host: "localhost",
    type: "postgres",
    port: 5432,
    entities: [chat_1.default],
    synchronize: true,
});
exports.default = database;
