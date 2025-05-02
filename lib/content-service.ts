"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

// Topic interfaces
interface TopicData {
  name: string
  description: string
}

// Course interfaces
interface CourseData {
  name: string
  description: string
  topics?: string[]
}

// Goal interfaces
interface GoalData {
  name: string
  description: string
  courses?: string[]
}

// Assignment interfaces
interface AssignmentData {
  userId: string
  goalId: string
  courseId: string
  topicId: string
}

interface ServiceResponse {
  success: boolean
  message: string
  data?: any
}

// Topic functions
export async function createTopic(data: TopicData): Promise<ServiceResponse> {
  try {
    const { db } = await connectToDatabase()

    const result = await db.collection("topics").insertOne({
      name: data.name,
      description: data.description,
      createdAt: new Date(),
    })

    return {
      success: true,
      message: "Topic created successfully",
      data: { _id: result.insertedId },
    }
  } catch (error) {
    console.error("Create topic error:", error)
    return {
      success: false,
      message: "An error occurred while creating the topic",
    }
  }
}

export async function fetchTopics() {
  try {
    const { db } = await connectToDatabase()
    const topics = await db.collection("topics").find({}).toArray()
    return topics
  } catch (error) {
    console.error("Fetch topics error:", error)
    return []
  }
}

export async function fetchTopicsByCourse(courseId: string) {
  try {
    const { db } = await connectToDatabase()

    // Find the course
    const course = await db.collection("courses").findOne({ _id: new ObjectId(courseId) })

    if (!course || !course.topicIds || course.topicIds.length === 0) {
      return []
    }

    // Convert string IDs to ObjectId
    const topicObjectIds = course.topicIds.map((id: string) => new ObjectId(id))

    // Fetch topics
    const topics = await db
      .collection("topics")
      .find({ _id: { $in: topicObjectIds } })
      .toArray()

    return topics
  } catch (error) {
    console.error("Fetch topics by course error:", error)
    return []
  }
}

// Course functions
export async function createCourse(data: CourseData): Promise<ServiceResponse> {
  try {
    const { db } = await connectToDatabase()

    // Convert topic IDs to ObjectId if provided
    const topicIds = data.topics?.map((id) => new ObjectId(id)) || []

    const result = await db.collection("courses").insertOne({
      name: data.name,
      description: data.description,
      topicIds,
      createdAt: new Date(),
    })

    return {
      success: true,
      message: "Course created successfully",
      data: { _id: result.insertedId },
    }
  } catch (error) {
    console.error("Create course error:", error)
    return {
      success: false,
      message: "An error occurred while creating the course",
    }
  }
}

export async function fetchCourses() {
  try {
    const { db } = await connectToDatabase()
    const courses = await db.collection("courses").find({}).toArray()
    return courses
  } catch (error) {
    console.error("Fetch courses error:", error)
    return []
  }
}

export async function fetchCoursesByGoal(goalId: string) {
  try {
    const { db } = await connectToDatabase()

    // Find the goal
    const goal = await db.collection("goals").findOne({ _id: new ObjectId(goalId) })

    if (!goal || !goal.courseIds || goal.courseIds.length === 0) {
      return []
    }

    // Convert string IDs to ObjectId
    const courseObjectIds = goal.courseIds.map((id: string) => new ObjectId(id))

    // Fetch courses
    const courses = await db
      .collection("courses")
      .find({ _id: { $in: courseObjectIds } })
      .toArray()

    return courses
  } catch (error) {
    console.error("Fetch courses by goal error:", error)
    return []
  }
}

// Goal functions
export async function createGoal(data: GoalData): Promise<ServiceResponse> {
  try {
    const { db } = await connectToDatabase()

    // Convert course IDs to ObjectId if provided
    const courseIds = data.courses?.map((id) => new ObjectId(id)) || []

    const result = await db.collection("goals").insertOne({
      name: data.name,
      description: data.description,
      courseIds,
      createdAt: new Date(),
    })

    return {
      success: true,
      message: "Goal created successfully",
      data: { _id: result.insertedId },
    }
  } catch (error) {
    console.error("Create goal error:", error)
    return {
      success: false,
      message: "An error occurred while creating the goal",
    }
  }
}

export async function fetchGoals() {
  try {
    const { db } = await connectToDatabase()
    const goals = await db.collection("goals").find({}).toArray()
    return goals
  } catch (error) {
    console.error("Fetch goals error:", error)
    return []
  }
}

// Assignment functions
export async function assignTopicToUser(data: AssignmentData): Promise<ServiceResponse> {
  try {
    const { db } = await connectToDatabase()

    // Check if all entities exist
    const [user, goal, course, topic] = await Promise.all([
      db.collection("users").findOne({ _id: new ObjectId(data.userId) }),
      db.collection("goals").findOne({ _id: new ObjectId(data.goalId) }),
      db.collection("courses").findOne({ _id: new ObjectId(data.courseId) }),
      db.collection("topics").findOne({ _id: new ObjectId(data.topicId) }),
    ])

    if (!user) {
      return { success: false, message: "User not found" }
    }

    if (!goal) {
      return { success: false, message: "Goal not found" }
    }

    if (!course) {
      return { success: false, message: "Course not found" }
    }

    if (!topic) {
      return { success: false, message: "Topic not found" }
    }

    // Create assignment
    const result = await db.collection("assignments").insertOne({
      userId: new ObjectId(data.userId),
      goalId: new ObjectId(data.goalId),
      courseId: new ObjectId(data.courseId),
      topicId: new ObjectId(data.topicId),
      completed: false,
      assignedAt: new Date(),
    })

    return {
      success: true,
      message: "Topic assigned successfully",
      data: { _id: result.insertedId },
    }
  } catch (error) {
    console.error("Assign topic error:", error)
    return {
      success: false,
      message: "An error occurred while assigning the topic",
    }
  }
}
