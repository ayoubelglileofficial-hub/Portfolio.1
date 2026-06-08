import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST() {
  const cookieStore = await cookies()
  
  // Delete the auth session cookie
  cookieStore.delete("auth_session")
  
  return NextResponse.json({ success: true, message: "Logged out successfully" })
}

// Also support GET for direct link logout
export async function GET() {
  const cookieStore = await cookies()
  cookieStore.delete("auth_session")
  
  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_WEB_ADDRESS || "http://localhost:3000"))
}