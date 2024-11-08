// src/app/api/migrate.ts
// http://localhost:3000/api/migrate
import { db } from './database';

function createPostsTable() {
  db.run(
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
      if (err) console.error('Error creating Posts table:', err.message);
      else console.log('Posts table created successfully.');
    },
  );
}

function createCategoriesTable() {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );
    `,
    (err: Error) => {
      if (err) console.error('Error creating Categories table:', err.message);
      else console.log('Categories table created successfully.');
    },
  );
}

function createUsersTable() {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      emailId TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    );
    `,
    (err: Error) => {
      if (err) console.error('Error creating Users table:', err.message);
      else console.log('Users table created successfully.');
    },
  );
}

function createAccountsTable() {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      provider TEXT NOT NULL,
      providerAccountId TEXT NOT NULL,
      access_token TEXT,
      refresh_token TEXT,
      expires_at TEXT,
      FOREIGN KEY (userId) REFERENCES users(id)
    );
    `,
    (err: Error) => {
      if (err) console.error('Error creating Accounts table:', err.message);
      else console.log('Accounts table created successfully.');
    },
  );
}

function createSessionsTable() {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sessionToken TEXT NOT NULL UNIQUE,
      userId INTEGER NOT NULL,
      expires TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES users(id)
    );
    `,
    (err: Error) => {
      if (err) console.error('Error creating Sessions table:', err.message);
      else console.log('Sessions table created successfully.');
    },
  );
}

function createVerificationTokensTable() {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS verification_tokens (
      identifier TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires TEXT NOT NULL
    );
    `,
    (err) => {
      if (err) console.error('Error creating Verification Tokens table:', err.message);
      else console.log('Verification Tokens table created successfully.');
    },
  );
}

export const migrate = () => {
  // (method) Database.serialize(callback?: () => void): void
  db.serialize(() => {
    console.log('Starting database migration...');
    createPostsTable();
    createCategoriesTable();
    createUsersTable();
    createAccountsTable();
    createSessionsTable();
    createVerificationTokensTable();
    console.log('Database migration completed.');
  });
};
