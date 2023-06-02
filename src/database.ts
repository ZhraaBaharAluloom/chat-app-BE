import { DataSource } from "typeorm";
import Chat from "./entities/chat";

const database = new DataSource({
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: "postgres",
  host: "localhost",
  type: "postgres",
  port: 5432,
  entities: [Chat],
  synchronize: true,
});

export default database;
