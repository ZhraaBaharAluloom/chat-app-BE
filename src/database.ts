import { DataSource } from "typeorm";
import Chat from "./entities/chat";
import User from "./entities/user";
import ChatRoom from "./entities/chatRoom";

const database = new DataSource({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: "postgres",
  host: "localhost",
  type: "postgres",
  port: 5432,
  entities: [Chat, User, ChatRoom],
  synchronize: true,
});

export default database;
