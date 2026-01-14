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

## GET /api/profile/
- **Description:** Returns authenticated user profile
- **Parameters:** None
- **Return:** JSON with:
  - `id` (integer)
  - `user` (object with id, email, username, created_at, is_active)
  - `bio` (string)
- **Authentication:** Token required

## PUT /api/profile/update/
- **Description:** Updates authenticated user profile
- **Parameters:** JSON with:
  - `bio` (string, optional)
- **Return:** JSON with:
  - `id` (integer)
  - `user` (object with id, email, username, created_at, is_active)
  - `bio` (string)
- **Authentication:** Token required

## PUT /api/profile/avatar/
- **Description:** Updates image file for authenticated user profile
- **Parameters:** multipart/form-data with:
  - `avatar` (image file, required)
- **Return:** JSON with:
  - `id` (integer)
  - `user` (object with id, email, username, created_at, is_active)
  - `bio` (string)
  - `avatar` (string, URL)
- **Authentication:** Token required