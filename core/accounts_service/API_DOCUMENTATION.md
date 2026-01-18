# API Documentation

## POST /api/auth/register/
- **Description:** Registers a new user with email and password
- **Parameters (body JSON):**
  - `email` (string, required)
  - `username` (string, required)
  - `password` (string, required)
  - `password2` (string, required)
- **Return:** JSON with:
  - `user` (object with id, email, username, created_at, is_active)
  - `token` (string)
  - `message` (string)
- **Authentication:** Not required

## POST /api/auth/login/
- **Description:** Authenticates user with email and password
- **Parameters (body JSON):**
  - `email` (string, required)
  - `password` (string, required)
- **Return:** JSON with:
  - `user` (object with id, email, username, created_at, is_active)
  - `token` (string)
  - `message` (string)
- **Authentication:** Not required

## POST /api/auth/logout/
- **Description:** User logout and token removal
- **Parameters:** None
- **Return:** JSON with:
  - `message` (string)
- **Authentication:** Token required

## GET /api/auth/profile/
- **Description:** Returns authenticated user profile
- **Parameters:** None
- **Return:** JSON with:
  - `id` (integer)
  - `email` (string)
  - `username` (string)
  - `created_at` (datetime)
  - `is_active` (boolean)
- **Authentication:** Token required
