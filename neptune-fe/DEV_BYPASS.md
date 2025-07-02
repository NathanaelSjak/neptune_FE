# Development Login Bypass

This feature allows you to bypass the login process during development when the backend is not ready.

## How to Use

### 1. Automatic Bypass (Default)

- The app will automatically log you in as a **student** when you visit the login page
- No need to enter any credentials
- You'll be redirected directly to the student dashboard

### 2. Role Switching

- Once logged in, you'll see a development panel in the bottom-right corner
- Use this panel to switch between different user roles:
  - 👨‍🎓 **Student** - Access student features
  - 👨‍🏫 **Lecturer** - Access lecturer features
  - 👨‍💼 **Admin** - Access admin features

### 3. Disabling the Bypass

When you're ready to use the real backend:

1. Open `src/hooks/useAuth.js`
2. Find this line: `const BYPASS_LOGIN = true;`
3. Change it to: `const BYPASS_LOGIN = false;`
4. The app will now require real login credentials

## Mock User Data

The bypass uses these mock users:

### Student

- **NIM:** 12345678
- **Name:** John Doe
- **Email:** 12345678@binus.ac.id
- **Role:** student

### Lecturer

- **NIM:** 87654321
- **Name:** Dr. Sarah Johnson
- **Email:** sarah.johnson@binus.ac.id
- **Role:** lecturer

### Admin

- **NIM:** admin
- **Name:** Dr. Michael Chen
- **Email:** michael.chen@binus.ac.id
- **Role:** admin

## Features

- ✅ Automatic login bypass
- ✅ Role switching without page reload
- ✅ Persistent session (survives page refresh)
- ✅ Development-only UI (hidden in production)
- ✅ Easy toggle to enable/disable

## Notes

- This feature only works in development mode (`NODE_ENV !== 'production'`)
- The dev panel will not appear in production builds
- All authentication data is stored in localStorage
- Mock tokens are automatically considered valid
