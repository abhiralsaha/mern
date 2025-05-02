"use server"

import { connectToDatabase } from "@/lib/mongodb"

export async function fetchUsers() {
  try {
    const { db } = await connectToDatabase()
    const users = await db.collection("users").find({}).project({ password: 0 }).toArray()
    return users
  } catch (error) {
    console.error("Fetch users error:", error)
    return []
  }
}
