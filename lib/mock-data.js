import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

// Helper function to hash passwords
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Generate mock data
export async function generateMockData() {
  // Create user IDs
  const adminId = new ObjectId()
  const user1Id = new ObjectId()
  const user2Id = new ObjectId()

  // Create topic IDs
  const htmlBasicsId = new ObjectId()
  const cssBasicsId = new ObjectId()
  const jsBasicsId = new ObjectId()
  const reactBasicsId = new ObjectId()
  const algebraId = new ObjectId()
  const geometryId = new ObjectId()
  const calculusId = new ObjectId()

  // Create course IDs
  const frontendFunId = new ObjectId()
  const reactMasteryId = new ObjectId()
  const mathFundamentalsId = new ObjectId()
  const advancedMathId = new ObjectId()

  // Create goal IDs
  const learnCodingId = new ObjectId()
  const mathExcellenceId = new ObjectId()

  // Hash passwords
  const adminPassword = await hashPassword("admin123")
  const userPassword = await hashPassword("user123")

  // Users
  const users = [
    {
      _id: adminId,
      name: "Admin User",
      email: "admin@panini8.com",
      password: adminPassword,
      isAdmin: true,
      createdAt: new Date(),
    },
    {
      _id: user1Id,
      name: "John Doe",
      email: "john@example.com",
      password: userPassword,
      isAdmin: false,
      createdAt: new Date(),
    },
    {
      _id: user2Id,
      name: "Jane Smith",
      email: "jane@example.com",
      password: userPassword,
      isAdmin: false,
      createdAt: new Date(),
    },
  ]

  // Topics
  const topics = [
    {
      _id: htmlBasicsId,
      name: "HTML Basics",
      description: "Learn the fundamentals of HTML markup language",
      createdAt: new Date(),
    },
    {
      _id: cssBasicsId,
      name: "CSS Basics",
      description: "Master the basics of CSS styling",
      createdAt: new Date(),
    },
    {
      _id: jsBasicsId,
      name: "JavaScript Fundamentals",
      description: "Introduction to JavaScript programming",
      createdAt: new Date(),
    },
    {
      _id: reactBasicsId,
      name: "React Introduction",
      description: "Getting started with React library",
      createdAt: new Date(),
    },
    {
      _id: algebraId,
      name: "Algebra Fundamentals",
      description: "Basic algebraic concepts and equations",
      createdAt: new Date(),
    },
    {
      _id: geometryId,
      name: "Geometry Basics",
      description: "Introduction to geometric principles",
      createdAt: new Date(),
    },
    {
      _id: calculusId,
      name: "Calculus Introduction",
      description: "Fundamentals of calculus and its applications",
      createdAt: new Date(),
    },
  ]

  // Courses
  const courses = [
    {
      _id: frontendFunId,
      name: "Frontend Fun",
      description: "Learn the basics of frontend web development",
      topicIds: [htmlBasicsId, cssBasicsId],
      createdAt: new Date(),
    },
    {
      _id: reactMasteryId,
      name: "React Mastery",
      description: "Become proficient in React development",
      topicIds: [jsBasicsId, reactBasicsId],
      createdAt: new Date(),
    },
    {
      _id: mathFundamentalsId,
      name: "Math Fundamentals",
      description: "Core mathematical concepts for beginners",
      topicIds: [algebraId, geometryId],
      createdAt: new Date(),
    },
    {
      _id: advancedMathId,
      name: "Advanced Mathematics",
      description: "Higher-level math concepts and applications",
      topicIds: [calculusId],
      createdAt: new Date(),
    },
  ]

  // Goals
  const goals = [
    {
      _id: learnCodingId,
      name: "Learn Coding",
      description: "Master the art of programming and web development",
      courseIds: [frontendFunId, reactMasteryId],
      createdAt: new Date(),
    },
    {
      _id: mathExcellenceId,
      name: "Mathematical Excellence",
      description: "Achieve excellence in mathematical concepts and problem-solving",
      courseIds: [mathFundamentalsId, advancedMathId],
      createdAt: new Date(),
    },
  ]

  // Assignments
  const assignments = [
    {
      userId: user1Id,
      goalId: learnCodingId,
      courseId: frontendFunId,
      topicId: htmlBasicsId,
      completed: false,
      assignedAt: new Date(),
    },
    {
      userId: user1Id,
      goalId: learnCodingId,
      courseId: frontendFunId,
      topicId: cssBasicsId,
      completed: true,
      assignedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    },
    {
      userId: user2Id,
      goalId: mathExcellenceId,
      courseId: mathFundamentalsId,
      topicId: algebraId,
      completed: false,
      assignedAt: new Date(),
    },
  ]

  return {
    users,
    topics,
    courses,
    goals,
    assignments,
  }
}
