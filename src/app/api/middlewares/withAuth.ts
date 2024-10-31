/* eslint-disable @typescript-eslint/no-unused-vars */
import { headers } from "next/headers";
import jwt from "jsonwebtoken";

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export async function withAuth(request: Request, handler: Function) {
  const unauthorizedResponse = new Response(
    JSON.stringify({ message: "Resource unauthorized" }),
    { status: 401, headers: { "Content-Type": "application/json" } }
  );
  const headersList = headers();
  const authorization = headersList.get("Authorization")?.split(" ")[1];
  const jwtSecret = process.env.JWT_SECRET;

  if (!authorization || !jwtSecret) {
    return unauthorizedResponse;
  }

  try {
    const isAuthenticated = jwt.verify(authorization, jwtSecret);
    if (!isAuthenticated) {
      return unauthorizedResponse;
    }

    return handler(request);
  } catch (error) {
    return unauthorizedResponse;
  }
}
