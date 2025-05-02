import { connectToDatabase } from "../lib/mongodb.js"
import { generateMockData } from "../lib/mock-data.js"

async function seedDatabase() {
  try {
    console.log("Connecting to database...")
    const { db } = await connectToDatabase()

    console.log("Generating mock data...")
    const { users, topics, courses, goals, assignments } = await generateMockData()

    console.log("Clearing existing collections...")
    await Promise.all([
      db.collection("users").deleteMany({}),
      db.collection("topics").deleteMany({}),
      db.collection("courses").deleteMany({}),
      db.collection("goals").deleteMany({}),
      db.collection("assignments").deleteMany({}),
    ])

    console.log("Inserting users...")
    await db.collection("users").insertMany(users)

    console.log("Inserting topics...")
    await db.collection("topics").insertMany(topics)

    console.log("Inserting courses...")
    await db.collection("courses").insertMany(courses)

    console.log("Inserting goals...")
    await db.collection("goals").insertMany(goals)

    console.log("Inserting assignments...")
    await db.collection("assignments").insertMany(assignments)

    console.log("Database seeded successfully!")
    console.log(`
    Created:
    - ${users.length} users
    - ${topics.length} topics
    - ${courses.length} courses
    - ${goals.length} goals
    - ${assignments.length} assignments
    `)

    console.log("\nAdmin login credentials:")
    console.log("Email: admin@panini8.com")
    console.log("Password: admin123")

    process.exit(0)
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()
