import { NextResponse } from "next/server";
import { getUserByEmailId } from "../../users/getUserByEmailId";

export async function POST(req: Request) {
  const body = await req.json();
  const { emailId } = body;
  console.log("Checking if user exists with email:", emailId);

  const user = await getUserByEmailId(emailId);

  if (user) {
    console.log("User found:", user);
    return NextResponse.json({ userExists: true });
  } else {
    console.log("User not found for email:", emailId);
    return NextResponse.json({ userExists: false });
  }
}
