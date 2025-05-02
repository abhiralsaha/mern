"use client"

import { useState } from "react"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminLayout } from "@/components/admin-layout"
import { useToast } from "@/hooks/use-toast"
import { createGoal, createCourse, createTopic } from "@/lib/content-service"

// Topic Form
const topicSchema = z.object({
  name: z.string().min(2, { message: "Topic name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
})

type TopicFormValues = z.infer<typeof topicSchema>

// Course Form
const courseSchema = z.object({
  name: z.string().min(2, { message: "Course name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  topics: z.array(z.string()).optional(),
})

type CourseFormValues = z.infer<typeof courseSchema>

// Goal Form
const goalSchema = z.object({
  name: z.string().min(2, { message: "Goal name must be at least 2 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  courses: z.array(z.string()).optional(),
})

type GoalFormValues = z.infer<typeof goalSchema>

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState("topic")
  const { toast } = useToast()

  // Topic Form
  const topicForm = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  })

  // Course Form
  const courseForm = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      name: "",
      description: "",
      topics: [],
    },
  })

  // Goal Form
  const goalForm = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      name: "",
      description: "",
      courses: [],
    },
  })

  // Topic Submit
  async function onTopicSubmit(data: TopicFormValues) {
    try {
      const response = await createTopic(data)
      if (response.success) {
        toast({
          title: "Topic created",
          description: "The topic has been created successfully",
        })
        topicForm.reset()
      } else {
        toast({
          title: "Failed to create topic",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the topic",
        variant: "destructive",
      })
    }
  }

  // Course Submit
  async function onCourseSubmit(data: CourseFormValues) {
    try {
      const response = await createCourse(data)
      if (response.success) {
        toast({
          title: "Course created",
          description: "The course has been created successfully",
        })
        courseForm.reset()
      } else {
        toast({
          title: "Failed to create course",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the course",
        variant: "destructive",
      })
    }
  }

  // Goal Submit
  async function onGoalSubmit(data: GoalFormValues) {
    try {
      const response = await createGoal(data)
      if (response.success) {
        toast({
          title: "Goal created",
          description: "The goal has been created successfully",
        })
        goalForm.reset()
      } else {
        toast({
          title: "Failed to create goal",
          description: response.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while creating the goal",
        variant: "destructive",
      })
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Content</h1>
          <p className="text-muted-foreground">Create new topics, courses, and goals for your users.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="topic">Topic</TabsTrigger>
            <TabsTrigger value="course">Course</TabsTrigger>
            <TabsTrigger value="goal">Goal</TabsTrigger>
          </TabsList>

          {/* Topic Form */}
          <TabsContent value="topic" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Create a New Topic</h2>
              <p className="text-sm text-muted-foreground">
                Topics are the building blocks of courses. Create a new topic to add to your courses.
              </p>
            </div>

            <Form {...topicForm}>
              <form onSubmit={topicForm.handleSubmit(onTopicSubmit)} className="space-y-4">
                <FormField
                  control={topicForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Topic Name</FormLabel>
                      <FormControl>
                        <Input placeholder="CSS Basics" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={topicForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Learn the basics of CSS styling" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Create Topic</Button>
              </form>
            </Form>
          </TabsContent>

          {/* Course Form */}
          <TabsContent value="course" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Create a New Course</h2>
              <p className="text-sm text-muted-foreground">
                Courses are collections of topics. Create a new course and assign topics to it.
              </p>
            </div>

            <Form {...courseForm}>
              <form onSubmit={courseForm.handleSubmit(onCourseSubmit)} className="space-y-4">
                <FormField
                  control={courseForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Frontend Fun" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={courseForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="A course on frontend development" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Create Course</Button>
              </form>
            </Form>
          </TabsContent>

          {/* Goal Form */}
          <TabsContent value="goal" className="space-y-4 mt-4">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Create a New Goal</h2>
              <p className="text-sm text-muted-foreground">
                Goals are collections of courses. Create a new goal and assign courses to it.
              </p>
            </div>

            <Form {...goalForm}>
              <form onSubmit={goalForm.handleSubmit(onGoalSubmit)} className="space-y-4">
                <FormField
                  control={goalForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Learn Coding" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={goalForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Master the art of coding" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Create Goal</Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
