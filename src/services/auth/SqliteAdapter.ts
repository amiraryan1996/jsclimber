import { Adapter, AdapterUser, AdapterSession, VerificationToken } from 'next-auth/adapters';
import { apiGet, apiPost } from '@/app/api/database';
import { v4 as uuid } from 'uuid';

function parseDate(value: string | Date | undefined): Date | undefined {
  return value ? new Date(value) : undefined;
}

export function SQLiteAdapter(): Adapter {
  return {
    async createUser(user) {
      const id = uuid();
      const query = 'INSERT INTO users (id, name, emailId) VALUES (?, ?, ?)';
      await apiPost(query, [id, user.name ?? '', user.email ?? '']);
      return { ...user, id };
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      const query = 'SELECT * FROM users WHERE id = ?';
      const rows = await apiGet<AdapterUser>(query, [id]);
      return rows[0] || null;
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const query = 'SELECT * FROM users WHERE emailId = ?';
      const rows = await apiGet<AdapterUser>(query, [email]);
      return rows[0] || null;
    },

    async getUserByAccount({ provider, providerAccountId }): Promise<AdapterUser | null> {
      const query = `
        SELECT users.* FROM users
        JOIN accounts ON accounts.userId = users.id
        WHERE accounts.provider = ? AND accounts.providerAccountId = ?
      `;
      const rows = await apiGet<AdapterUser>(query, [provider, providerAccountId]);
      return rows[0] || null;
    },

    async updateUser(user: AdapterUser): Promise<AdapterUser> {
      const query = 'UPDATE users SET name = ?, emailId = ? WHERE id = ?';
      await apiPost(query, [user.name ?? '', user.email ?? '', user.id]);
      return user;
    },

    async linkAccount(account) {
      const query = `
        INSERT INTO accounts (userId, provider, providerAccountId, access_token, refresh_token, expires_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const expirationDate = account.expires_at ? new Date(account.expires_at * 1000) : undefined;
      const isoStringExpirationDate = expirationDate?.toISOString() ?? '';
      await apiPost(query, [
        account.userId,
        account.provider,
        account.providerAccountId,
        account.access_token ?? '',
        account.refresh_token ?? '',
        isoStringExpirationDate,
      ]);
      return account;
    },

    async createSession(session: AdapterSession): Promise<AdapterSession> {
      const query = `
        INSERT INTO sessions (sessionToken, userId, expires)
        VALUES (?, ?, ?)
      `;
      await apiPost(query, [
        session.sessionToken,
        session.userId,
        parseDate(session.expires)?.toISOString() ?? '',
      ]);
      return session;
    },

    async getSessionAndUser(
      sessionToken: string,
    ): Promise<{ session: AdapterSession; user: AdapterUser } | null> {
      const query = `
        SELECT sessions.*, users.* FROM sessions
        JOIN users ON users.id = sessions.userId
        WHERE sessions.sessionToken = ?
      `;
      const rows = await apiGet<{
        sessionToken: string;
        userId: string;
        expires: string;
        id: string;
        name: string;
        emailId: string;
      }>(query, [sessionToken]);

      if (!rows[0]) return null;

      const { sessionToken: token, userId, expires, id, name, emailId } = rows[0];
      const session = {
        sessionToken: token,
        userId,
        expires: parseDate(expires),
      } as AdapterSession;
      const user = { id, name, email: emailId, emailVerified: null } as AdapterUser;
      return { session, user };
    },

    async updateSession(session: AdapterSession): Promise<AdapterSession | null> {
      const query = 'UPDATE sessions SET expires = ? WHERE sessionToken = ?';
      await apiPost(query, [parseDate(session.expires)?.toISOString() ?? '', session.sessionToken]);
      return session;
    },

    async deleteSession(sessionToken: string): Promise<void> {
      const query = 'DELETE FROM sessions WHERE sessionToken = ?';
      await apiPost(query, [sessionToken]);
    },

    async createVerificationToken(token: VerificationToken): Promise<VerificationToken> {
      const query = `
        INSERT INTO verification_tokens (identifier, token, expires)
        VALUES (?, ?, ?)
      `;
      await apiPost(query, [
        token.identifier,
        token.token,
        parseDate(token.expires)?.toISOString() ?? '',
      ]);
      return token;
    },

    async useVerificationToken({ identifier, token }): Promise<VerificationToken | null> {
      const query = `
        SELECT * FROM verification_tokens WHERE identifier = ? AND token = ?
      `;
      const rows = await apiGet<VerificationToken>(query, [identifier, token]);
      if (!rows[0]) return null;

      await apiPost('DELETE FROM verification_tokens WHERE identifier = ? AND token = ?', [
        identifier,
        token,
      ]);
      return rows[0];
    },
  };
}
