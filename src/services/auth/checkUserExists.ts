export async function checkUserExists(email: string, baseUrl: string): Promise<boolean> {
  console.log(`Attempting to fetch user existence from: ${baseUrl}/check-user`);
  try {
    const response = await fetch(`${baseUrl}/api/auth/check-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailId: email }),
    });

    const data = await response.json();
    if (response.status === 404) {
      console.log(`User with ${email} does not exist.`);
      return false;
    } else if (!response.ok) {
      throw new Error(data.message || 'Failed to check user existence');
    }
    console.log(data.message);
    return data.userExists;
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw error;
  }
}
