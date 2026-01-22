# API Documentation

## POST /api/auth/register/
- **Description:** Registers a new user with email and password
- **Parameters (body JSON):**
  - `email` (string, required)
  - `username` (string, required)
  - `password` (string, required)
  - `password2` (string, required)
- **Return:** JSON with:
  - `user` (object with id, email, username, created_at, is_online)
  - `token` (string)
  - `message` (string)
- **Authentication:** Not required

## POST /api/auth/login/
- **Description:** Authenticates user with email and password
- **Parameters (body JSON):**
  - `email` (string, required)
  - `password` (string, required)
- **Return:** JSON with:
  - `user` (object with id, email, username, created_at, is_online)
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
  - `user` (object with id, email, username, created_at, is_online)
  - `bio` (string)
- **Authentication:** Token required

## PUT /api/profile/
- **Description:** Updates authenticated user profile
- **Parameters:** JSON with:
  - `bio` (string, optional)
- **Return:** JSON with:
  - `id` (integer)
  - `user` (object with id, email, username, created_at, is_online)
  - `bio` (string)
- **Authentication:** Token required

## PUT /api/profile/avatar/
- **Description:** Updates image file for authenticated user profile
- **Parameters:** multipart/form-data with:
  - `avatar` (image file, required)
- **Return:** JSON with:
  - `id` (integer)
  - `user` (object with id, email, username, created_at, is_online)
  - `bio` (string)
  - `avatar` (string, URL)
- **Authentication:** Token required

## DELETE /api/profile/avatar/
- **Description:** Deletes image file for authenticated user profile
- **Parameters:** None
- **Return:** JSON with:
  - `id` (integer)
  - `user` (object with id, email, username, created_at, is_online)
  - `bio` (string)
  - `avatar` (string, URL)
- **Authentication:** Token required

## POST /api/friends/request/
- **Description:** Sends a friend request to another user
- **Parameters (body JSON):**
  - `to_user_id` (integer, required)
- **Return:** JSON with:
  - `id` (integer)
  - `from_user` (integer, user ID)
  - `to_user` (integer, user ID)
  - `accepted` (boolean)
  - `created_at` (string, timestamp)
- **Authentication:** Token required

## POST /api/friends/accept/
- **Description:** Accepts a friend request
- **Parameters (body JSON):**
  - `request_id` (integer, required)
- **Return:** JSON with:
  - `id` (integer)
  - `from_user` (integer, user ID)
  - `to_user` (integer, user ID)
  - `accepted` (boolean)
  - `created_at` (string, timestamp)
- **Authentication:** Token required

## GET /api/friends/pending/
- **Description:** Returns all pending friend requests received by the authenticated user
- **Parameters:** None
- **Return:** JSON array with friend request objects containing:
  - `id` (integer)
  - `from_user` (object with user details)
  - `to_user` (object with user details)
  - `accepted` (boolean)
  - `created_at` (string, timestamp)
- **Authentication:** Token required

## GET /api/friends/
- **Description:** Returns list of authenticated user's friends
- **Parameters:** None
- **Return:** JSON array with user objects containing:
  - `id` (integer)
  - `email` (string)
  - `username` (string)
  - `created_at` (string, timestamp)
  - `is_online` (boolean)
- **Authentication:** Token required