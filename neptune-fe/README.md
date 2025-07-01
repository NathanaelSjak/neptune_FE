# Neptune Frontend

A React-based frontend for the Neptune educational platform, featuring role-based access control for students, lecturers, and administrators.

## Features

- **Role-based Authentication**: Secure login system with automatic role-based routing
- **Cookie Validation**: Automatic token validation on page switches with periodic checks
- **Centralized Auth Management**: Custom `useAuth` hook for consistent authentication state
- **Protected Routes**: Automatic route protection based on user roles
- **API Integration**: Ready-to-use API service layer with axios
- **Responsive Design**: Modern UI with Tailwind CSS and DaisyUI

## Authentication System

The application uses a comprehensive authentication system with the following features:

### useAuth Hook

The `useAuth` hook provides centralized authentication management:

```javascript
import { useAuthState, useAuthActions } from "./hooks/useAuth";

// In your component
const { user, loading, error, isAuthenticated } = useAuthState();
const { login, logout, refreshToken, validateAuth, clearError } =
  useAuthActions();
```

#### Features:

- **Automatic Token Validation**: Checks token validity on page load/switch
- **Periodic Validation**: Validates tokens every 5 minutes when authenticated
- **JWT Support**: Handles JWT token expiration automatically
- **Role-based Redirects**: Automatically redirects users based on their role
- **Error Handling**: Centralized error management for authentication failures

#### Available Hooks:

- `useAuthState()`: Get authentication state (user, loading, error, isAuthenticated)
- `useAuthActions()`: Get authentication actions (login, logout, refreshToken, etc.)
- `useAuthContext()`: Direct access to auth context (advanced usage)

### Cookie/Token Management

The system automatically handles:

- Token storage in localStorage
- JWT expiration checking
- Automatic logout on token expiration
- Token refresh capabilities
- Cross-page authentication state persistence

### Protected Routes

Routes are automatically protected based on user roles:

- **Student Routes**: `/dashboard`, `/submission`, `/leaderboard`, etc.
- **Lecturer Routes**: `/lecturer/dashboard`, `/lecturer/submissions`, etc.
- **Admin Routes**: `/admin/dashboard`, `/admin/users`, etc.

## Project Structure

```
src/
├── components/
│   ├── Leaderboard/
│   └── Navbar/
│       ├── AdminNavbar.jsx
│       ├── LecturerNavbar.jsx
│       └── Navbar.jsx
├── config/
│   └── endpoints.js
├── hooks/
│   ├── useAuth.js          # Authentication hook
│   └── useApi.js           # API call hooks
├── pages/
│   ├── Admin/              # Admin pages
│   ├── Lecturer/           # Lecturer pages
│   └── User/               # Student pages
└── services/
    └── api.js              # API service layer
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:8000/api

# Development mode (uses mock data when backend is not available)
REACT_APP_USE_MOCK_DATA=true
```

### 3. Start Development Server

```bash
npm start
```

The application will run on `http://localhost:3000`

## Backend Integration

### Connecting to Backend

1. **Update API Endpoints**: Replace placeholder endpoints in `src/services/api.js`
2. **Set Backend URL**: Configure `REACT_APP_API_URL` in your `.env` file
3. **Disable Mock Data**: Set `REACT_APP_USE_MOCK_DATA=false` when backend is ready

### API Endpoints

All API endpoints are organized in `src/services/api.js`:

```javascript
// Authentication
authAPI.login(credentials);
authAPI.logout();
authAPI.refreshToken();
authAPI.getProfile();

// Users
userAPI.getUsers();
userAPI.createUser(userData);

// Classes
classAPI.getClasses();
classAPI.getEnrolledClasses();

// Contests
contestAPI.getContests();
contestAPI.createContest(contestData);

// Submissions
submissionAPI.getSubmissions();
submissionAPI.createSubmission(submissionData);
```

### Endpoint Configuration

Update endpoints in `src/config/endpoints.js`:

```javascript
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    PROFILE: "/auth/profile",
  },
  // ... other endpoints
};
```

## Development Workflow

### Using Mock Data (Default)

The application includes mock data for development:

- **Student Login**: NIM: `12345678`, Password: `password`
- **Lecturer Login**: NIM: `87654321`, Password: `lecturer`
- **Admin Login**: NIM: `admin`, Password: `admin123`

### Using Real Backend

1. Set up your backend server
2. Update `REACT_APP_API_URL` in `.env`
3. Replace placeholder endpoints in `src/services/api.js`
4. Set `REACT_APP_USE_MOCK_DATA=false`

## Authentication Flow

1. **Login**: User enters credentials → API call → Token storage → Role-based redirect
2. **Page Switch**: Automatic token validation → User profile fetch → Continue or redirect
3. **Token Expiry**: Automatic detection → Logout → Redirect to login
4. **Logout**: Clear tokens → API logout call → Redirect to login

## Custom Hooks Usage

### useAuth Hook

```javascript
import { useAuthState, useAuthActions } from "./hooks/useAuth";

function MyComponent() {
  const { user, loading, isAuthenticated } = useAuthState();
  const { login, logout } = useAuthActions();

  const handleLogin = async () => {
    try {
      await login({ nim: "12345678", password: "password" });
      // Navigation is handled automatically
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### useApi Hook

```javascript
import { useApi } from "./hooks/useApi";
import { userAPI } from "./services/api";

function UsersList() {
  const {
    data: users,
    loading,
    error,
    execute: fetchUsers,
  } = useApi(userAPI.getUsers);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {users?.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

## Available Scripts

- `npm start`: Start development server
- `npm test`: Run tests
- `npm run build`: Build for production
- `npm run eject`: Eject from Create React App

## Dependencies

- **React**: 18.x
- **React Router**: 6.x
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Component library for Tailwind CSS

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
