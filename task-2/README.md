# ProjectPulse

A project management application with MongoDB backend for data persistence.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the root directory with:
   ```
   MONGODB_URI=mongodb://localhost:27017/projectpulse
   PORT=5000
   ```
   (Use your MongoDB connection string)

### Running the Application

For development with both frontend and backend:
```
npm run dev:full
```

To run only the frontend:
```
npm run dev
```

To run only the backend:
```
npm run server
```

### Backend API Endpoints

- **Projects**
  - GET `/api/projects` - Get all projects
  - GET `/api/projects/:id` - Get project by ID
  - POST `/api/projects` - Create new project
  - PUT `/api/projects/:id` - Update project
  - DELETE `/api/projects/:id` - Delete project

- **Tasks**
  - POST `/api/projects/:id/tasks` - Add task to project
  - PUT `/api/projects/:projectId/tasks/:taskId` - Update task
  - DELETE `/api/projects/:projectId/tasks/:taskId` - Delete task
