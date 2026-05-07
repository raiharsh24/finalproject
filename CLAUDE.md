# Final Project - Coding Platform

## Project Overview
A full-stack coding practice platform where users can solve programming problems, run code, get AI-powered hints, and administrators can manage users.

## Tech Stack

### Frontend
- React 18 with Vite
- Monaco Editor for code editing
- Tailwind CSS for styling
- Axios for API calls

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- Nodemailer for OTP emails
- Google Generative AI (Gemini) for hints
- C++ compiler with child_process

## Directory Structure

```
finalproject/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx         # Main app with auth flow
│   │   ├── Login.jsx       # OTP-based login
│   │   ├── MainApp.jsx     # Code editor & problem interface
│   │   └── AdminPanel.jsx  # Admin dashboard
│   └── package.json
├── server/                 # Express backend
│   ├── server.js           # Main server entry point
│   ├── routes/             # API endpoints
│   │   ├── authRoutes.js   # Authentication & OTP
│   │   ├── adminRoutes.js  # Admin operations
│   │   ├── aiRoute.js      # AI hints
│   │   └── runCode.js      # Code execution
│   ├── controllers/        # Business logic
│   │   ├── authController.js
│   │   └── runController.js
│   ├── models/             # MongoDB schemas
│   │   ├── User.js
│   │   ├── Problem.js
│   │   └── Submission.js
│   ├── middleware/         # Auth & authorization
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   └── compiler/           # Code execution
│       └── executeCpp.js   # C++ compiler with security
└── package.json
```

## Environment Variables

Create `.env` file in `/server/` directory:

```env
# MongoDB
MONGO_URI=mongodb://localhost:27017/coding-platform

# JWT Secret
JWT_SECRET=your-secret-key-here

# Email Configuration (for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Google AI API (for hints)
GEMINI_API_KEY=your-gemini-api-key

# Server Port
PORT=5000
```

## Running the Project

### Backend
```bash
cd server
npm install
npm run dev  # or npm start
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## Key Features

### Authentication
- OTP-based login system
- Email verification via Nodemailer
- JWT token authentication
- Role-based access (student/teacher/admin)

### Code Execution
- C++ code compilation and execution
- Security checks to prevent malicious code
- 5-second timeout protection
- Automatic cleanup of temporary files

### AI Integration
- Google Gemini API for code hints
- Short, helpful hints without full solutions

### User Management
- Admin panel for user management
- Role assignment and modification
- User deletion with self-deletion prevention

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login with email/password
- `POST /send-otp` - Send OTP to email
- `POST /verify-otp` - Verify OTP and login

### Admin (`/api/admin`) - Requires admin role
- `GET /users` - Get all users
- `POST /change-role` - Change user role
- `DELETE /delete-user` - Delete user

### Code Execution (`/api/code`)
- `POST /run` - Run code with custom input
- `POST /submit` - Submit code for test cases

### AI (`/api/ai`)
- `POST /hint` - Get AI hint for code

## Security Considerations

### Code Execution Security
- Blocks dangerous system calls: `system()`, `fork()`, `exec()`
- Prevents inclusion of system headers: `<unistd.h>`, `<sys/*>`
- 5-second execution timeout
- Automatic file cleanup after execution

### Authentication
- JWT tokens with 1-day expiration
- Role-based middleware for protected routes
- OTP expiration (5 minutes)
- Admins cannot delete themselves

### Input Validation
- Code and language validation before execution
- Email format validation
- Role validation (student/teacher/admin only)

## Database Models

### User
```javascript
{
  email: String,
  password: String,  // bcrypt hashed
  role: String,      // "student" | "teacher" | "admin"
}
```

### Problem
```javascript
{
  title: String,
  description: String,
  createdBy: ObjectId (ref: User)
}
```

### Submission
```javascript
{
  userId: ObjectId (ref: User),
  problemId: String,
  status: String,  // "Passed" | "Failed"
}
```

## Important Patterns

### Error Handling
- Consistent error response format: `{ success: false, message: "...", error: "..." }`
- Try-catch blocks in all async functions
- Proper HTTP status codes (400, 401, 403, 404, 500)

### Authentication Flow
1. User enters email → OTP sent
2. User enters OTP → Token generated
3. Token stored in localStorage
4. Token sent in Authorization header: `Bearer <token>`

### Code Execution Flow
1. Security checks on code
2. Create temp directory with unique ID
3. Write code and input to files
4. Compile and execute with timeout
5. Cleanup all temporary files
6. Return output or error

## Development Notes

- Frontend runs on `http://localhost:5173` (Vite default)
- Backend runs on `https://finalproject-bdk1.onrender.com`
- MongoDB should be running on default port 27017
- For email OTP, use Gmail App Password (not regular password)
- Gemini API key required for AI hints feature

## Current Limitations

- Only C++ language supported for code execution
- Hardcoded test cases in submission
- No problem management UI (problems are hardcoded in frontend)
- No progress tracking or statistics
- No code submission history