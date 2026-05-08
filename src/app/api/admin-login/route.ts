import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const correctPassword = process.env.ADMIN_PASSWORD;

    console.log("User typed:", password, "| Server expects:", correctPassword);

    if (!correctPassword) {
      return NextResponse.json({ error: "Server password not configured" }, { status: 500 });
    }

    if (password === correctPassword) {
      // Because you are on Next.js 15, cookies() is a Promise!
      const cookieStore = await cookies(); 
      
      // Give the user a secure "VIP Wristband" cookie that lasts for 7 days
      cookieStore.set("admin_session", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      return NextResponse.json({ success: true }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid password" }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}