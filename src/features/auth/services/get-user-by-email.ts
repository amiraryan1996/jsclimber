import * as z from 'zod';

const emailSchema = z.string().email();

export async function getUserByEmail({ email, baseUrl = '' }: { email: string; baseUrl?: string }) {
  // Validate the email format
  if (!emailSchema.safeParse(email).success) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl && baseUrl}/api/user/get-user-by-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    if (response.ok) {
      // Checks for 200-299 status code
      const data = await response.json();
      const user = data?.user ?? null;
      console.log('getUserByEmail service result:', data.message, user);
      return user;
    } else {
      console.warn(`getUserByEmail service received non-OK response: ${response.status}`);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user by email:', error);
    return null;
  }
}
