import { User } from "@/app/interfaces/user";
import { apiGet } from "../database";

export const getUserByEmailId = async (emailId: string) => {
  try {
    const users = await apiGet(`SELECT * FROM users WHERE emailId = ?`, [
      emailId,
    ]);
    const user = (users as User[])[0]; // Get the first user from the result
    return user; // Return the user directly
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null; // Return null if there's an error
  }
};
