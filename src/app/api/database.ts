// path module:
// path module provides utilities for working with file and directory paths.
// ref: https://nodejs.org/api/path.html.
import path from 'path';
import sqlite3 from 'sqlite3';

// process.cwd() :
// The process.cwd() method returns the current working directory of the Node.js process.
// console.log(`Current directory: ${process.cwd()}`).
const dbPath = path.join(process.cwd(), 'profile.db');

// syntax: new sqlite3.Database(filename [, mode] [, callback]).
// ref: https://github.com/TryGhost/node-sqlite3/wiki/API.
export const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE | sqlite3.OPEN_FULLMUTEX,
  (err) => {
    if (err) {
      console.error('Failed to connect to the database:', err.message);
    }
    console.log('Connected to the profile database at path:', dbPath);
  },
);

// C.R.U.D operations to the db:
// Read
export const apiGet = async (query: string, params: unknown[] = []) => {
  return await new Promise((resolve, reject) => {
    // syntax: all(sql [, param, ...] [, callback]).
    // retrieves all result rows and stores them in memory.
    db.all(query, params, (err: Error, rows: unknown) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(rows);
    });
  });
};

// Create
export const apiPost = async (query: string, params: string[]) => {
  return await new Promise((resolve, reject) => {
    // run(sql [, param, ...] [, callback])
    // 1- The SQL query to run.
    // 2-  bind parameters: These will be bound to the SQL query.
    db.run(query, params, function (err) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(null);
    });
  });
};
