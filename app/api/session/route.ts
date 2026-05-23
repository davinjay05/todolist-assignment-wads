import { getAdminAuth } from "../../../lib/firebase-admin";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authorization = req.headers.get("Authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const idToken = authorization.split("Bearer ")[1];

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    return NextResponse.json({ error: "Firebase not configured" }, { status: 500 });
  }

  const adminAuth = getAdminAuth();
  await adminAuth.verifyIdToken(idToken, true);

  const response = NextResponse.json({ status: "success" });

  response.cookies.set("session", idToken, {
    httpOnly: true,
    secure: true,
    path: "/",
  });

  return response;
}