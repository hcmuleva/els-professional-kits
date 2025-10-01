// pacttest/provider/src/mockProvider.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock data storage
let users = [
  {
    id: 1,
    username: "testuser",
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
    mobile_number: "1234567890",
    gender: "MALE",
    confirmed: true,
    blocked: false,
    role: {
      id: 1,
      name: "Authenticated",
      type: "authenticated"
    }
  },
  {
    id: 2,
    username: "user2",
    email: "user2@example.com",
    first_name: "Jane",
    last_name: "Smith",
    mobile_number: "0987654321",
    gender: "FEMALE",
    confirmed: true,
    blocked: false,
    role: {
      id: 1,
      name: "Authenticated",
      type: "authenticated"
    }
  }
];

let currentUserId = 3;

// Mock JWT verification middleware
const mockJWTAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: {
        status: 401,
        name: "UnauthorizedError",
        message: "Unauthorized"
      }
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  // Mock token validation
  if (token === 'invalid.jwt.token') {
    return res.status(401).json({
      error: {
        status: 401,
        name: "UnauthorizedError",
        message: "Invalid token"
      }
    });
  }
  
  // Set mock user for valid tokens
  req.user = { id: 1, username: "testuser" };
  next();
};

// Auth Routes
app.post('/auth/local', (req, res) => {
  const { identifier, password } = req.body;
  
  if (identifier === "test@example.com" && password === "password123") {
    return res.json({
      jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token",
      user: users[0]
    });
  }
  
  if (identifier === "test@example.com" && password === "wrongpassword") {
    return res.status(400).json({
      error: {
        status: 400,
        name: "ValidationError",
        message: "Invalid identifier or password"
      }
    });
  }
  
  return res.status(400).json({
    error: {
      status: 400,
      name: "ValidationError",
      message: "Invalid identifier or password"
    }
  });
});

app.post('/auth/local/register', (req, res) => {
  const { username, email, password, first_name, last_name, mobile_number, gender } = req.body;
  
  // Check if email already exists
  if (email === "existing@example.com") {
    return res.status(400).json({
      error: {
        status: 400,
        name: "ValidationError",
        message: "Email is already taken"
      }
    });
  }
  
  const newUser = {
    id: currentUserId++,
    username,
    email,
    first_name,
    last_name,
    mobile_number,
    gender,
    confirmed: false,
    blocked: false,
    role: {
      id: 1,
      name: "Authenticated",
      type: "authenticated"
    }
  };
  
  users.push(newUser);
  
  return res.json({
    jwt: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.new.token",
    user: newUser
  });
});

app.get('/auth/me', mockJWTAuth, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return res.json(userWithoutPassword);
  }
  
  return res.status(404).json({
    error: {
      status: 404,
      name: "NotFoundError",
      message: "User not found"
    }
  });
});

// User Routes
app.get('/users', mockJWTAuth, (req, res) => {
  return res.json(users);
});

app.post('/users', mockJWTAuth, (req, res) => {
  const { username, email, password, first_name, last_name, mobile_number, gender, role } = req.body;
  
  // Check if email already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({
      error: {
        status: 400,
        name: "ValidationError",
        message: "Email is already taken",
        details: {
          errors: [
            {
              path: ["email"],
              message: "This email is already registered"
            }
          ]
        }
      }
    });
  }
  
  const newUser = {
    id: currentUserId++,
    username,
    email,
    first_name,
    last_name,
    mobile_number,
    gender,
    confirmed: false,
    blocked: false,
    role: {
      id: role || 1,
      name: "Authenticated",
      type: "authenticated"
    }
  };
  
  users.push(newUser);
  return res.json(newUser);
});

app.get('/users/:id', mockJWTAuth, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({
      error: {
        status: 404,
        name: "NotFoundError",
        message: "User not found"
      }
    });
  }
  
  return res.json(user);
});

app.put('/users/:id', mockJWTAuth, (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: {
        status: 404,
        name: "NotFoundError",
        message: "User not found"
      }
    });
  }
  
  // Update user data
  users[userIndex] = { ...users[userIndex], ...req.body };
  return res.json(users[userIndex]);
});

app.delete('/users/:id', mockJWTAuth, (req, res) => {
  const userId = parseInt(req.params.id);
  
  // Prevent self-deletion (assuming current user is ID 1)
  if (userId === 1) {
    return res.status(403).json({
      error: {
        status: 403,
        name: "ForbiddenError",
        message: "Cannot delete your own account"
      }
    });
  }
  
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({
      error: {
        status: 404,
        name: "NotFoundError",
        message: "User not found"
      }
    });
  }
  
  users.splice(userIndex, 1);
  
  return res.json({
    id: userId,
    deleted: true,
    message: "User successfully deleted"
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: {
      status: 404,
      name: "NotFoundError",
      message: "Route not found"
    }
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: {
      status: 500,
      name: "InternalServerError",
      message: "Internal server error"
    }
  });
});

module.exports = app;

// Start server if run directly
if (require.main === module) {
  const PORT = process.env.PROVIDER_PORT || 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Mock LMS Provider running at http://localhost:${PORT}`);
    console.log(`📋 Available endpoints:`);
    console.log(`   POST /auth/local - Login`);
    console.log(`   POST /auth/local/register - Register`);
    console.log(`   GET  /auth/me - Get current user`);
    console.log(`   GET  /users - Get all users`);
    console.log(`   POST /users - Create user`);
    console.log(`   GET  /users/:id - Get user by ID`);
    console.log(`   PUT  /users/:id - Update user`);
    console.log(`   DELETE /users/:id - Delete user`);
    console.log(`   GET  /health - Health check`);
  });
}