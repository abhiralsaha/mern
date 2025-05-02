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

6. ### Mock Data and Database Seeding Script

I'll create a comprehensive mock data file and a seed script to populate your MongoDB database with sample data. This will help you test the application with realistic data.

```typescriptreact project="panini8_admin"
...
```

## Database Seeding Instructions

I've created a comprehensive mock data and seeding system for your Panini8 admin portal. This will populate your MongoDB database with sample users, topics, courses, goals, and assignments.

### What's Included:

1. **Mock Data Generator** (`lib/mock-data.ts`):

1. Creates sample data for all collections
2. Properly hashes user passwords using bcrypt
3. Establishes relationships between entities (topics → courses → goals)



2. **Command-Line Seeder** (`scripts/seed-database.ts`):

1. Connects to your MongoDB database
2. Clears existing data
3. Inserts mock data into all collections
4. Provides a summary of created entities



3. **API Route Seeder** (`app/api/seed/route.ts`):

1. Allows seeding via a simple API endpoint
2. Returns a JSON response with counts of created entities

### Mock Data and Database Seeding Script

I'll create a comprehensive mock data file and a seed script to populate your MongoDB database with sample data. This will help you test the application with realistic data.

```typescriptreact project="panini8_admin"
...
```

## Database Seeding Instructions

I've created a comprehensive mock data and seeding system for your Panini8 admin portal. This will populate your MongoDB database with sample users, topics, courses, goals, and assignments.

### What's Included:

1. **Mock Data Generator** (`lib/mock-data.ts`):

1. Creates sample data for all collections
2. Properly hashes user passwords using bcrypt
3. Establishes relationships between entities (topics → courses → goals)



2. **Command-Line Seeder** (`scripts/seed-database.ts`):

1. Connects to your MongoDB database
2. Clears existing data
3. Inserts mock data into all collections
4. Provides a summary of created entities



3. **API Route Seeder** (`app/api/seed/route.ts`):

1. Allows seeding via a simple API endpoint
2. Returns a JSON response with counts of created entities





### Sample Data Overview:

- **Users**:

- Admin user ([admin@panini8.com](mailto:admin@panini8.com) / admin123)
- Two regular users with sample data



- **Topics**:

- Web development topics (HTML, CSS, JavaScript, React)
- Math topics (Algebra, Geometry, Calculus)



- **Courses**:

- Frontend Fun (HTML + CSS)
- React Mastery (JavaScript + React)
- Math Fundamentals (Algebra + Geometry)
- Advanced Mathematics (Calculus)



- **Goals**:

- Learn Coding (Frontend + React courses)
- Mathematical Excellence (Math courses)



- **Assignments**:

- Sample assignments connecting users to topics





### How to Use:

#### Option 1: Command Line Seeding

1. Install the required dependencies:

```shellscript
npm install ts-node --save-dev
```


2. Run the seed script:

```shellscript
npm run seed
```
