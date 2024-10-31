import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getUserByEmailId } from "../../users/getUserByEmailId";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    console.log("Invalid request method:", req.method);
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 405 }
    );
  }
  const body = await req.json();
  const { emailId, password } = body;
  console.log("Verifying credentials for email:", emailId);

  const user = await getUserByEmailId(emailId);
  if (!user) {
    console.log("User not found for email:", emailId);
    return NextResponse.json(
      { message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const passwordMatches = bcrypt.compareSync(password, user.password);
  console.log("Password validation result:", passwordMatches);

  if (passwordMatches) {
    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.emailId,
      },
      { status: 200 }
    );
  } else {
    return NextResponse.json({ message: "Invalid email or password" });
  }
}
