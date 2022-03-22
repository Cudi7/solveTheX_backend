import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function connectDB() {
  try {
    const db = await open({
      filename: "./database.sqlite3",
      driver: sqlite3.Database,
    });
    return db;
  } catch (error) {
    console.log(error);
  }
}
export default connectDB;
