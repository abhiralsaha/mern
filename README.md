# mern

## Getting Started

Here's how to use the application:

1. **Register an account**: Navigate to `/register` and create an admin account
2. **Log in**: Use your credentials to log in at `/login`
3. **Create content**: Use the `/admin/create` page to:

1. Create Topics (e.g., "CSS Basics")
2. Create Courses (e.g., "Frontend Fun")
3. Create Goals (e.g., "Learn Coding")



4. **Assign content**: Use the `/admin/assign` page to assign topics to users


## Database Collections

The application will automatically create these collections in your MongoDB database:

- `users`: Stores user accounts with hashed passwords
- `topics`: Individual learning topics
- `courses`: Collections of topics
- `goals`: Collections of courses
- `assignments`: Records of which topics are assigned to which users


## Security Features

Your application includes:

- Password hashing with bcrypt
- JWT authentication with HTTP-only cookies
- Protected routes with middleware
- Form validation with Zod


## Next Steps

To enhance your application, you might want to consider:

1. Adding a user dashboard for students to view their assigned content
2. Implementing progress tracking for topics and courses
3. Creating analytics to track user engagement
4. Adding content management features for updating existing content
5. Implementing a notification system for new assignments
