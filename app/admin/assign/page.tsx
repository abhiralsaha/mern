"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminLayout } from "@/components/admin-layout"
import { useToast } from "@/hooks/use-toast"
import { fetchGoals, fetchCoursesByGoal, fetchTopicsByCourse, assignTopicToUser } from "@/lib/content-service"
import { fetchUsers } from "@/lib/user-service"

const assignSchema = z.object({
  userId: z.string({ required_error: "User is required" }),
  goalId: z.string({ required_error: "Goal is required" }),
  courseId: z.string({ required_error: "Course is required" }),
  topicId: z.string({ required_error: "Topic is required" }),
})

type AssignFormValues = z.infer<typeof assignSchema>

interface Goal {
  _id: string
  name: string
}

interface Course {
  _id: string
  name: string
}

interface Topic {
  _id: string
  name: string
}

interface User {
  _id: string
  name: string
  email: string
}

export default function AssignPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<AssignFormValues>({
    resolver: zodResolver(assignSchema),
    defaultValues: {
      userId: "",
      goalId: "",
      courseId: "",
      topicId: "",
    },
  })

  // Load goals and users on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [goalsData, usersData] = await Promise.all([fetchGoals(), fetchUsers()])
        setGoals(goalsData)
        setUsers(usersData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load initial data",
          variant: "destructive",
        })
      }
    }

    loadInitialData()
  }, [toast])

  // Load courses when goal changes
  const watchGoalId = form.watch("goalId")
  useEffect(() => {
    if (watchGoalId) {
      const loadCourses = async () => {
        try {
          const coursesData = await fetchCoursesByGoal(watchGoalId)
          setCourses(coursesData)
          form.setValue("courseId", "")
          form.setValue("topicId", "")
          setTopics([])
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load courses",
            variant: "destructive",
          })
        }
      }

      loadCourses()
    }
  }, [watchGoalId, form, toast])

  // Load topics when course changes
  const watchCourseId = form.watch("courseId")
  useEffect(() => {
    if (watchCourseId) {
      const loadTopics = async () => {
        try {
          const topicsData = await fetchTopicsByCourse(watchCourseId)
          setTopics(topicsData)
          form.setValue("topicId", "")
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load topics",
            variant: "destructive",
          })
        }
      }

      loadTopics()
    }
  }, [watchCourseId, form, toast])

  async function onSubmit(data: AssignFormValues) {
    setIsLoading(true)
    try {
      const response = await assignTopicToUser(data)
      if (response.success) {
        toast({
          title: "Assignment successful",
          description: "The topic has been assigned to the user",
        })
        form.reset()
      } else {
        toast({
          title: "Assignment failed",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during assignment",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assign Content</h1>
          <p className="text-muted-foreground">Assign goals, courses, and topics to users.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="space-y-2 mb-6">
            <h2 className="text-xl font-semibold">Assign a Topic to a User</h2>
            <p className="text-sm text-muted-foreground">
              Select a user, goal, course, and topic to create an assignment.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user._id} value={user._id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="goalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a goal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {goals.map((goal) => (
                          <SelectItem key={goal._id} value={goal._id}>
                            {goal.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!watchGoalId || courses.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course._id} value={course._id}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="topicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={!watchCourseId || topics.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {topics.map((topic) => (
                          <SelectItem key={topic._id} value={topic._id}>
                            {topic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Assigning..." : "Assign Topic"}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </AdminLayout>
  )
}
