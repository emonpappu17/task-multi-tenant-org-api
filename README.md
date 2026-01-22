# Multi-Tenant Organization Workspace API

A production-ready REST API for managing multi-tenant organizations with comprehensive role-based access control (RBAC), user management, project tracking, and task assignment capabilities.

## Project Overview

This API enables multiple client organizations to operate independently within a single platform while maintaining strict data isolation. Each organization has its own users, projects, and tasks with role-based authorization to ensure secure access.

### Key Features
- **Multi-Tenant Architecture**: Complete data isolation between organizations
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control (RBAC)**: Three distinct roles with specific permissions
- **Project Management**: Create and manage projects within organizations
- **Task Management**: Create, assign, and track tasks with priority and status
- **User Management**: Manage organization members with different roles
- **Error Handling**: Centralized error handling with meaningful messages
- **Data Validation**: Request validation using Zod schema validation
- **PostgreSQL with Prisma ORM**: Type-safe database operations

## Tech Stack

### Backend Framework & Language
- **Node.js**: JavaScript runtime
- **TypeScript**: Type-safe JavaScript
- **Express.js**: Minimal web application framework

### Database & ORM
- **PostgreSQL**: Relational database
- **Prisma ORM**: Next-generation ORM for Node.js

### Authentication & Security
- **JWT (JSON Web Tokens)**: Token-based authentication
- **bcryptjs**: Password hashing for security

### Data Validation
- **Zod**: TypeScript-first schema validation

## Why PostgreSQL?

PostgreSQL was chosen for the following reasons:

1. **ACID Compliance**: Ensures data integrity in a multi-tenant environment where data isolation is critical
2. **Strong Foreign Key Constraints**: Prevents cross-organization data access at the database level
3. **Indexes & Performance**: Optimized query performance with proper indexing on frequently accessed fields
4. **JSON Support**: Flexibility for future extensions
5. **Open Source**: No licensing costs, widely adopted
6. **Scalability**: Handles complex queries and relationships efficiently
7. **Transactional Support**: Ensures consistency in multi-step operations

## Folder Structure

```
task-server/
├── src/
│   ├── app/
│   │   ├── config/
│   │   │   ├── env.ts              # Environment configuration
│   │   │   └── prisma.ts           # Prisma client instance
│   │   ├── middlewares/
│   │   │   ├── auth.ts             # JWT verification & authorization
│   │   │   ├── globalErrorHandler.ts # Centralized error handling
│   │   │   ├── notFound.ts         # 404 handler
│   │   │   └── validateRequest.ts  # Request validation
│   │   ├── module/
│   │   │   ├── auth/
│   │   │   │   ├── auth.controller.ts    # Login, get current user
│   │   │   │   ├── auth.route.ts         # Auth endpoints
│   │   │   │   ├── auth.service.ts       # Auth business logic
│   │   │   │   └── auth.validation.ts    # Zod validation schemas
│   │   │   ├── organization/
│   │   │   │   ├── organizatoin.controller.ts
│   │   │   │   ├── organization.route.ts
│   │   │   │   ├── organization.service.ts
│   │   │   │   └── organization.validation.ts
│   │   │   ├── user/
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.route.ts
│   │   │   │   ├── user.service.ts
│   │   │   │   └── user.validation.ts
│   │   │   ├── project/
│   │   │   │   ├── project.controller.ts
│   │   │   │   ├── project.route.ts
│   │   │   │   ├── project.service.ts
│   │   │   │   └── project.validation.ts
│   │   │   └── task/
│   │   │       ├── task.controller.ts
│   │   │       ├── task.route.ts
│   │   │       ├── task.service.ts
│   │   │       └── task.validation.ts
│   │   ├── routes/
│   │   │   └── index.ts            # Route aggregation
│   │   ├── shared/
│   │   │   ├── catchAsync.ts       # Async error wrapper
│   │   │   ├── generateSlug.ts     # Slug generation utility
│   │   │   ├── jwt.ts              # JWT utility functions
│   │   │   ├── seed.ts             # Database seeding
│   │   │   ├── sendResponse.ts     # Response formatter
│   │   │   └── AppError.ts         # Custom error class
│   │   └── app.ts                  # Express app setup
│   ├── server.ts                   # Server entry point
│   └── app.ts                      # Main app configuration
├── prisma/
│   ├── schema.prisma               # Database schema
│   ├── migrations/                 # Database migrations
│   └── migration_lock.toml         # Migration lock file
├── .env                            # Environment variables
├── .env.example                    # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Database Schema (ER Diagram)
![ER Diagram](https://i.ibb.co.com/G4Bpnkws/multi-tenant-erd.png)

### Data Models

#### User
- **id**: UUID (Primary Key)
- **email**: String (Unique) - User's email address
- **password**: String (Hashed) - Encrypted password
- **fullName**: String - User's full name
- **role**: Enum - PLATFORM_ADMIN | ORGANIZATION_ADMIN | ORGANIZATION_MEMBER
- **isActive**: Boolean - Account status
- **organizationId**: UUID (Foreign Key, Nullable) - Organization the user belongs to
- **createdAt**: DateTime - Account creation timestamp
- **updatedAt**: DateTime - Last update timestamp

#### Organization
- **id**: UUID (Primary Key)
- **name**: String - Organization name
- **slug**: String (Unique) - URL-friendly identifier
- **description**: String (Optional) - Organization description
- **isActive**: Boolean - Organization status
- **createdAt**: DateTime - Creation timestamp
- **updatedAt**: DateTime - Last update timestamp

#### Project
- **id**: UUID (Primary Key)
- **name**: String - Project name
- **description**: String (Optional) - Project description
- **startDate**: DateTime (Optional) - Project start date
- **endDate**: DateTime (Optional) - Project end date
- **isActive**: Boolean - Project status
- **organizationId**: UUID (Foreign Key) - Organization this project belongs to
- **createdAt**: DateTime - Creation timestamp
- **updatedAt**: DateTime - Last update timestamp

#### Task
- **id**: UUID (Primary Key)
- **title**: String - Task title
- **description**: String (Optional) - Task description
- **status**: Enum - TODO | IN_PROGRESS | IN_REVIEW | COMPLETED | CANCELLED
- **priority**: Enum - LOW | MEDIUM | HIGH | URGENT
- **dueDate**: DateTime (Optional) - Task due date
- **projectId**: UUID (Foreign Key) - Project this task belongs to
- **organizationId**: UUID (Foreign Key) - Organization for isolation
- **createdAt**: DateTime - Creation timestamp
- **updatedAt**: DateTime - Last update timestamp

#### TaskAssignment
- **id**: UUID (Primary Key)
- **taskId**: UUID (Foreign Key) - Task being assigned
- **userId**: UUID (Foreign Key) - User assigned to task
- **assignedBy**: String (Optional) - User who made the assignment
- **createdAt**: DateTime - Assignment creation timestamp
- **updatedAt**: DateTime - Last update timestamp
- **Constraint**: Unique (taskId + userId) - Prevents duplicate assignments

## Role-Based Access Control (RBAC)

### Roles & Permissions

#### 1. Platform Admin
- **Capabilities**:
  - Create new organizations
  - View all organizations
  - Create the first organization admin
  - View organization details
  - Update organization information
- **Data Access**: All organizations (cross-tenant access)

#### 2. Organization Admin
- **Capabilities**:
  - Manage users within their organization
  - Create projects within their organization
  - Create tasks within projects
  - Assign/unassign tasks to users
  - Update and delete projects
  - Update and delete tasks
  - View organization members and projects
- **Data Access**: Only their organization's data

#### 3. Organization Member
- **Capabilities**:
  - View assigned tasks
  - View organization members
  - View projects (read-only)
  - View task details
- **Data Access**: Only tasks assigned to them and their organization's general data

### Authorization Enforcement

#### Middleware-Based Authorization
Authorization is enforced at the **middleware level** using the `authCheck()` middleware in [src/app/middlewares/auth.ts](src/app/middlewares/auth.ts):

```typescript
// Example: Only ORGANIZATION_ADMIN can create users
router.post(
    '/',
    authCheck(UserRole.ORGANIZATION_ADMIN),  // Authorization middleware
    validateRequest(createUserByAdminValidation),
    catchAsync(UserController.createUser)
);
```

#### Key Authorization Features
1. **Token Verification**: JWT token is verified and decoded
2. **Role Checking**: Request is validated against required role
3. **Organization Isolation**: Service layer ensures organization-level data isolation
4. **Cross-Organization Prevention**: All queries include `organizationId` filter

#### Authorization Flow
```
Request → JWT Validation → Role Check → Organization Check → Service Layer
```

## API Endpoints

### Authentication Routes

#### 1. Login
- **POST** `/auth/login`
- **Description**: Authenticate user with email and password
- **Authorization**: Public (No token required)
- **Request Body**:
  ```json
  {
    "email": "admin@platform.com",
    "password": "password123"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Login successful",
    "data": {
      "accessToken": "jwt_token_here",
      "userId": "uuid",
      "organizationId": "uuid_or_null",
      "role": "PLATFORM_ADMIN"
    }
  }
  ```

#### 2. Get Current User Profile
- **GET** `/auth/me`
- **Description**: Retrieve authenticated user's profile
- **Authorization**: Bearer Token Required
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "User profile retrieved",
    "data": {
      "id": "uuid",
      "email": "user@example.com",
      "fullName": "User Name",
      "role": "ORGANIZATION_ADMIN",
      "isActive": true,
      "organizationId": "uuid",
      "createdAt": "2026-01-22T10:00:00Z"
    }
  }
  ```

### Organization Routes

#### 1. Create Organization
- **POST** `/organizations`
- **Description**: Create a new organization (Platform Admin only)
- **Authorization**: Bearer Token + PLATFORM_ADMIN Role
- **Request Body**:
  ```json
  {
    "name": "Acme Corporation",
    "description": "A leading technology company"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "success": true,
    "statusCode": 201,
    "message": "Organization created successfully",
    "data": {
      "id": "uuid",
      "name": "Acme Corporation",
      "slug": "acme-corporation",
      "description": "A leading technology company",
      "isActive": true,
      "createdAt": "2026-01-22T10:00:00Z"
    }
  }
  ```

#### 2. Get All Organizations
- **GET** `/organizations?page=1&limit=10`
- **Description**: List all organizations (Platform Admin only)
- **Authorization**: Bearer Token + PLATFORM_ADMIN Role
- **Query Parameters**:
  - `page` (optional): Page number (default: 1)
  - `limit` (optional): Items per page (default: 10)
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "statusCode": 200,
    "message": "Organizations retrieved successfully",
    "data": {
      "organizations": [...],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 5
      }
    }
  }
  ```

#### 3. Get Organization by ID
- **GET** `/organizations/:organizationId`
- **Description**: Get organization details
- **Authorization**: Bearer Token + must belong to organization or be Platform Admin
- **Response** (200 OK): Organization object

#### 4. Create First Organization Admin
- **POST** `/organizations/:organizationId/create-first-admin`
- **Description**: Create the first admin for an organization (Platform Admin only)
- **Authorization**: Bearer Token + PLATFORM_ADMIN Role
- **Request Body**:
  ```json
  {
    "email": "admin@acme.com",
    "password": "adminPassword123",
    "fullName": "John Admin"
  }
  ```
- **Response** (201 Created): User object with ORGANIZATION_ADMIN role

#### 5. Update Organization
- **PATCH** `/organizations/:organizationId`
- **Description**: Update organization details (Platform Admin only)
- **Authorization**: Bearer Token + PLATFORM_ADMIN Role
- **Request Body**:
  ```json
  {
    "name": "Updated Name",
    "description": "Updated description",
    "isActive": true
  }
  ```
- **Response** (200 OK): Updated organization object

### User Routes

#### 1. Create User
- **POST** `/users`
- **Description**: Create a new user in the organization (Organization Admin only)
- **Authorization**: Bearer Token + ORGANIZATION_ADMIN Role
- **Request Body**:
  ```json
  {
    "email": "member@acme.com",
    "password": "memberPassword123",
    "fullName": "Jane Member",
    "role": "ORGANIZATION_MEMBER"
  }
  ```
- **Response** (201 Created): User object

#### 2. Get Organization Users
- **GET** `/users?page=1&limit=10`
- **Description**: List all users in the organization
- **Authorization**: Bearer Token + Organization member
- **Query Parameters**:
  - `page` (optional): Page number
  - `limit` (optional): Items per page
- **Response** (200 OK): Paginated user list

#### 3. Get User by ID
- **GET** `/users/:userId`
- **Description**: Get user details (must be in same organization)
- **Authorization**: Bearer Token + Organization member
- **Response** (200 OK): User object

#### 4. Update User
- **PATCH** `/users/:userId`
- **Description**: Update user information (Organization Admin only)
- **Authorization**: Bearer Token + ORGANIZATION_ADMIN Role
- **Request Body**:
  ```json
  {
    "fullName": "Updated Name",
    "isActive": true
  }
  ```
- **Response** (200 OK): Updated user object

#### 5. Delete User
- **DELETE** `/users/:userId`
- **Description**: Delete a user (Organization Admin only)
- **Authorization**: Bearer Token + ORGANIZATION_ADMIN Role
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "message": "User deleted successfully"
  }
  ```

### Project Routes

#### 1. Create Project
- **POST** `/projects`
- **Description**: Create a new project (Organization Admin only)
- **Authorization**: Bearer Token + ORGANIZATION_ADMIN Role
- **Request Body**:
  ```json
  {
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "startDate": "2026-02-01T00:00:00Z",
    "endDate": "2026-04-01T00:00:00Z"
  }
  ```
- **Response** (201 Created): Project object

#### 2. Get Organization Projects
- **GET** `/projects?page=1&limit=10`
- **Description**: List all projects in the organization
- **Authorization**: Bearer Token + Organization member
- **Response** (200 OK): Paginated project list

#### 3. Get Project by ID
- **GET** `/projects/:projectId`
- **Description**: Get project details
- **Authorization**: Bearer Token + Organization member
- **Response** (200 OK): Project object with tasks

#### 4. Update Project
- **PATCH** `/projects/:projectId`
- **Description**: Update project information (Organization Admin only)
- **Authorization**: Bearer Token + ORGANIZATION_ADMIN Role
- **Request Body**:
  ```json
  {
    "name": "Updated Project Name",
    "description": "Updated description",
    "isActive": true
  }
  ```
- **Response** (200 OK): Updated project object

#### 5. Delete Project
- **DELETE** `/projects/:projectId`
- **Description**: Delete a project (Organization Admin only)
- **Authorization**: Bearer Token + ORGANIZATION_ADMIN Role
- **Response** (200 OK): Success message

### Task Routes

#### 1. Create Task
- **POST** `/tasks`
- **Description**: Create a new task (Organization Admin only)
- **Authorization**: Bearer Token + ORGANIZATION_ADMIN Role
- **Request Body**:
  ```json
  {
    "title": "Design Homepage Layout",
    "description": "Create mockups for the homepage redesign",
    "projectId": "uuid",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2026-02-15T00:00:00Z"
  }
  ```
- **Response** (201 Created): Task object

#### 2. Get Project Tasks
- **GET** `/tasks/project/:projectId`
- **Description**: Get all tasks in a project (Organization Admin only)
- **Authorization**: Bearer Token + ORGANIZATION_ADMIN Role
- **Response** (200 OK): Task list with assignments

#### 3. Get Task by ID
- **GET** `/tasks/:taskId`
- **Description**: Get task details
- **Authorization**: Bearer Token + Organization member
- **Response** (200 OK): Task object with assignments

#### 4. Update Task
- **PATCH** `/tasks/:taskId`
- **Description**: Update task information (Organization Admin only)
- **Authorization**: Bearer Token + ORGANIZATION_ADMIN Role
- **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "status": "IN_PROGRESS",
    "priority": "URGENT",
    "dueDate": "2026-02-20T00:00:00Z"
  }
  ```
- **Response** (200 OK): Updated task object

#### 5. Assign Task
- **POST** `/tasks/assign`
- **Description**: Assign a task to a user (Organization Admin only)
- **Authorization**: Bearer Token + ORGANIZATION_ADMIN Role
- **Request Body**:
  ```json
  {
    "taskId": "uuid",
    "userId": "uuid"
  }
  ```
- **Response** (201 Created): Assignment confirmation

#### 6. Unassign Task
- **DELETE** `/tasks/unassign`
- **Description**: Remove task assignment (Organization Admin only)
- **Authorization**: Bearer Token + ORGANIZATION_ADMIN Role
- **Request Body**:
  ```json
  {
    "taskId": "uuid",
    "userId": "uuid"
  }
  ```
- **Response** (200 OK): Success message

## Strict Business Rules Implementation

### 1. Cross-Organization Access Prevention
**Implementation**: Every query includes `organizationId` filter:

```typescript
// Service layer ensures organization isolation
const user = await prisma.user.findUnique({
  where: { id: userId, organizationId: userOrgId }
});
```

**Enforcement Points**:
- User fetch queries filter by organizationId
- Project queries filter by organizationId
- Task queries filter by organizationId
- Authorization middleware validates organization membership

### 2. Task Cross-Organization Prevention
**Implementation**: Task model has dual keys:

```prisma
model Task {
  projectId      String      // Links to organization's project
  organizationId String      // Direct organization reference
}
```

**Validation**: Task creation validates project belongs to the user's organization:

```typescript
const project = await prisma.project.findUnique({
  where: { id: projectId, organizationId: userOrgId }
});
```

### 3. Authorization Logic Location
**Authorization is NOT in routes** - it's enforced in:

1. **Middleware Layer** ([src/app/middlewares/auth.ts](src/app/middlewares/auth.ts)):
   - JWT token validation
   - Role verification
   - Organization membership check

2. **Service Layer** ([src/app/module/*/service.ts](src/app/module/)):
   - Organization-level data filtering
   - Business rule validation
   - Data integrity checks

3. **Route Guards** (Express middleware chain):
   - Routes specify required roles
   - Routes use `authCheck()` middleware

### 4. Database Integrity
**PostgreSQL Constraints**:

```sql
-- Foreign Key Constraints
ALTER TABLE "User" ADD CONSTRAINT user_org_fk 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"(id) ON DELETE CASCADE;

ALTER TABLE "Project" ADD CONSTRAINT project_org_fk 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"(id) ON DELETE CASCADE;

ALTER TABLE "Task" ADD CONSTRAINT task_org_fk 
  FOREIGN KEY ("organizationId") REFERENCES "Organization"(id) ON DELETE CASCADE;

ALTER TABLE "Task" ADD CONSTRAINT task_project_fk 
  FOREIGN KEY ("projectId") REFERENCES "Project"(id) ON DELETE CASCADE;

-- Unique Constraints
ALTER TABLE "TaskAssignment" ADD CONSTRAINT unique_task_user 
  UNIQUE ("taskId", "userId");
```

## Setup & Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database

### Environment Variables

Create a `.env` file in the project root:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/task_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRY=7d
SALT_ROUND=10
```

### Installation Steps

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd task-server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database and JWT configuration

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed database with initial data (optional)
npx prisma db seed

# Start development server
npm run dev
```

### Build for Production

```bash
# Build TypeScript to JavaScript
npm run build

# Run production server
node dist/server.js
```

## Running the Server

### Development Mode
```bash
npm run dev
```
Server runs on `http://localhost:5000`

### Production Mode
```bash
npm run build
node dist/server.js
```

## Error Handling

The API implements centralized error handling with meaningful messages and appropriate HTTP status codes:

### Error Response Format
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message here",
  "error": {
    "details": "Additional error details"
  }
}
```

### Error Handling Middleware
[src/app/middlewares/globalErrorHandler.ts](src/app/middlewares/globalErrorHandler.ts) handles all errors consistently:
- Validation errors (Zod)
- Authentication errors (JWT)
- Authorization errors (Role-based)
- Database errors (Prisma)
- Custom application errors

## Postman Collection Usage

### Import Instructions

1. **Download the Postman Collection**
   - Use the provided `postman_collection.json` file

2. **Import in Postman**
   - Open Postman
   - Click "Import"
   - Select the `postman_collection.json` file
   - Click "Import"

3. **Configure Environment Variables**
   - In Postman, create an environment or use the collection variables
   - Set `baseUrl` to your hosted API URL: `https://task-server-eight-vert.vercel.app`
   - All other variables are auto-populated from responses

4. **Run Requests**
   - Login first (POST /auth/login) to get the access token
   - Token is automatically saved to `accessToken` variable
   - All subsequent requests will include the token in Authorization header

### Workflow Sequence

1. **Login** (POST /auth/login) - Get authentication token
2. **Create Organization** (POST /organizations) - Create test organization
3. **Create First Admin** (POST /organizations/:id/create-first-admin) - Create org admin
4. **Create Users** (POST /users) - Add team members
5. **Create Projects** (POST /projects) - Set up projects
6. **Create Tasks** (POST /tasks) - Create tasks
7. **Assign Tasks** (POST /tasks/assign) - Assign to users

### Test Credentials

#### Platform Admin
- **Email**: admin@platform.com
- **Password**: password123
- **Organization**: None (has access to all orgs)

#### Organization Admin (Acme Corp)
- **Email**: admin@acme.com
- **Password**: password123
- **Organization**: Acme Corporation
- **Permissions**: Manage users, projects, and tasks

#### Organization Member (Acme Corp)
- **Email**: member@acme.com
- **Password**: password123
- **Organization**: Acme Corporation
- **Permissions**: View assigned tasks and projects

## Testing

### Manual Testing with Postman
Use the provided Postman collection to test all endpoints with:
- Authentication workflows
- RBAC enforcement
- Cross-organization isolation
- CRUD operations
- Error scenarios

### Test Scenarios Covered
1. **Authentication**
   - Valid login
   - Invalid credentials
   - Token expiration
   - Missing token

2. **Authorization**
   - Platform admin access to all organizations
   - Organization admin managing own org only
   - Members accessing only assigned tasks
   - Cross-org access prevention

3. **Data Isolation**
   - Organization A data invisible to Organization B
   - Task assignment within org only
   - Project management within org only

4. **Validation**
   - Required field validation
   - Email format validation
   - Enum value validation
   - Unique constraint enforcement





