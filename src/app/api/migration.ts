// http://localhost:3000/api/migrate

import { db } from "./database";
export const migrate = () => {
  // (method) Database.serialize(callback?: () => void): void
  db.serialize(() => {
    db.run(
      // posts table:
      `
       CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        imageUrl TEXT NOT NULL,
        articleUrl TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        date TEXT NOT NULL,
        categoryId INTEGER,
        summary TEXT,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      );
    `,
      (err: Error) => {
        if (err) {
          console.error("Error creating Posts table:", err.message);
        } else {
          console.log("Posts table created successfully.");
        }
      }
    );

    // categories table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      );
    `,
      (err: Error) => {
        if (err) {
          console.error("Error creating categories table:", err.message);
        } else {
          console.log("Categories table created successfully.");
        }
      }
    );

    db.run(
      // users table:
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        emailId TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `,
      (err: Error) => {
        if (err) {
          console.error("Error creating users table:", err.message);
        } else {
          console.log("Users table created successfully.");
        }
      }
    );
  });
};
