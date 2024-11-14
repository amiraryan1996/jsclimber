import { User } from 'next-auth';

export async function verifyCredentials(
  credentials: Record<'email' | 'password', string> | undefined,
  baseUrl: string | undefined,
): Promise<User | null> {
  console.log('Authorizing user with credentials:', credentials);
  try {
    const response = await fetch(`${baseUrl}/api/auth/verify-credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials?.email,
        password: credentials?.password,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error(data.message, data.error);
      return null;
    }
    const { user } = data;
    console.log('User found:', user);
    return user ? { id: user.id, name: user.name, email: user.email } : null;
  } catch (error) {
    console.error('Authorization request error:', error);
    return null;
  }
}
