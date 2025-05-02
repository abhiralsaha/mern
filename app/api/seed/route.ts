import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { generateMockData } from "@/lib/mock-data"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Generate mock data
    const { users, topics, courses, goals, assignments } = await generateMockData()

    // Clear existing collections
    await Promise.all([
      db.collection("users").deleteMany({}),
      db.collection("topics").deleteMany({}),
      db.collection("courses").deleteMany({}),
      db.collection("goals").deleteMany({}),
      db.collection("assignments").deleteMany({}),
    ])

    // Insert mock data
    await db.collection("users").insertMany(users)
    await db.collection("topics").insertMany(topics)
    await db.collection("courses").insertMany(courses)
    await db.collection("goals").insertMany(goals)
    await db.collection("assignments").insertMany(assignments)

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully!",
      counts: {
        users: users.length,
        topics: topics.length,
        courses: courses.length,
        goals: goals.length,
        assignments: assignments.length,
      },
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      { success: false, message: "Failed to seed database", error: String(error) },
      { status: 500 },
    )
  }
}
