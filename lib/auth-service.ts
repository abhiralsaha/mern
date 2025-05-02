"use server"

import { cookies } from "next/headers"
import bcrypt from "bcryptjs"
import { signJwtToken, verifyJwtToken } from "@/lib/jwt"
import { connectToDatabase } from "@/lib/mongodb"

interface RegisterData {
  name: string
  email: string
  password: string
}

interface LoginData {
  email: string
  password: string
}

interface AuthResponse {
  success: boolean
  message: string
  token?: string
  user?: {
    _id: string
    name: string
    email: string
    isAdmin: boolean
  }
}

export async function registerUser(data: RegisterData): Promise<AuthResponse> {
  try {
    const { db } = await connectToDatabase()

    const existingUser = await db.collection("users").findOne({ email: data.email })
    if (existingUser) {
      return {
        success: false,
        message: "User with this email already exists",
      }
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password, salt)

    const result = await db.collection("users").insertOne({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      isAdmin: true,
      createdAt: new Date(),
    })

    return {
      success: true,
      message: "User registered successfully",
      user: {
        _id: result.insertedId.toString(),
        name: data.name,
        email: data.email,
        isAdmin: true,
      },
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: "An error occurred during registration",
    }
  }
}

export async function loginUser(data: LoginData): Promise<AuthResponse> {
  try {
    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({ email: data.email })
    if (!user) {
      return {
        success: false,
        message: "Invalid credentials",
      }
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)
    if (!isPasswordValid) {
      return {
        success: false,
        message: "Invalid credentials",
      }
    }

    const token = signJwtToken({
      userId: user._id.toString(),
      email: user.email,
      isAdmin: user.isAdmin || false,
    })

    const cookieStore = await cookies()
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    })

    return {
      success: true,
      message: "Login successful",
      token, // ✅ Included here
      user: {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || false,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      message: "An error occurred during login",
    }
  }
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("token")
}

export async function checkAuth(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    if (!token) {
      return false
    }

    await verifyJwtToken(token)
    return true
  } catch (error) {
    return false
  }
}
