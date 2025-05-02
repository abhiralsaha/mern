// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { loginUser } from "@/lib/auth-service";
import { serialize } from "cookie";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const result = await loginUser(data);

    if (!result.success || !result.user) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 401 }
      );
    }

    // Create the serialized cookie
    const serialized = serialize("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    const response = NextResponse.json(
      { success: true, message: "Login successful", user: result.user },
      { status: 200 }
    );

    response.headers.set("Set-Cookie", serialized);
    return response;

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Login failed" },
      { status: 500 }
    );
  }
}
