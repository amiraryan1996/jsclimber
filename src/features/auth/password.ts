// src/auth/password.ts
import { hash, verify } from 'argon2';

export const hashPassword = async (password: string) => {
  // hash fn: Hashes a password with Argon2, producing an encoded hash
  return await hash(password);
};

export const verifyPasswordHash = async (hash: string, password: string) => {
  // verify fn: returns — true if the digest parameters matches the hash generated from plain, otherwise false
  return await verify(hash, password);
};
