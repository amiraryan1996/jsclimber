export async function registerUser(
  profile: {
    name?: string | null;
    email?: string | null;
  },
  baseUrl: string,
) {
  try {
    const response = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: profile?.name,
        emailId: profile?.email,
        password: '', // Empty password for GitHub user
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Signup error:', data);
      throw new Error(data.message);
    }

    console.log('User registered successfully:', data.message);
    return true;
  } catch (error) {
    console.error('Error registering user:', error);
    return false;
  }
}
