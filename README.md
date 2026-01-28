# ft_pong

*This project has been created as part of the 42 curriculum by sabrifer, julberna, mgonzaga, namoreir.*

## Description

**ft_pong** is a modern web-based multiplayer Pong game that recreates the classic arcade experience with real-time online gameplay. The project implements a full-stack web application with user authentication, friend management, and live game sessions between two players.

### Key Features

- **User Authentication System**: Complete registration, login, and profile management with token-based authentication
- **Real-time Multiplayer Pong**: 1v1 matches with WebSocket communication for smooth, synchronized gameplay
- **Friend System**: Send, accept, and manage friend requests with online status tracking
- **User Profiles**: Customizable profiles with bio and avatar support
- **Game Rooms**: Create or join game rooms with unique codes for private matches
- **Responsive UI**: Modern, dark-themed interface built with Next.js and Tailwind CSS
- **Microservices Architecture**: Separate services for accounts, game logic, and frontend application

---

## Team Information

### Team Members and Roles

| Member | Login | Role(s) | Responsibilities |
|--------|-------|---------|------------------|
| Sabrina Ferreira | **sabrifer** | Developer & Technical Lead | Technical architecture decisions, code quality oversight, technology stack selection, critical code reviews |
| Juliany Bernardo | **julberna** | Developer & Product Owner | Product vision definition, feature prioritization, backlog maintenance, stakeholder communication, user needs validation |
| Marcela Gonzaga | **mgonzaga** | Developer & Project Manager | Team coordination, meeting organization, progress tracking, risk management, deadline oversight |
| Natali Moreira | **namoreir** | Developer | Feature implementation, code reviews, testing, documentation |

---

## Project Management

### Work Organization

The team adopted an agile approach with clear task distribution:

- **Task Management**: Project broken down into specific tasks tracked via GitHub Issues
- **Meetings**: Biweekly meetings held on Discord to sync progress, discuss blockers, and plan next steps
- **Code Reviews**: All major changes reviewed by at least one team member before merging
- **Version Control**: Git workflow with feature branches and pull requests

### Tools Used

- **GitHub Issues**: Task tracking and assignment
- **Discord**: Team communication and biweekly meetings
- **Git/GitHub**: Version control and collaboration
- **Docker Compose**: Development environment orchestration

---

## Technical Stack

### Frontend
- **Next.js 16.1.1** (React 19): Server-side rendering and routing
- **TypeScript 5**: Type-safe development
- **Tailwind CSS 4**: Utility-first styling
- **Zustand 5**: Lightweight state management
- **Axios 1.13**: HTTP client for API communication
- **Zod 4**: Schema validation
- **Headless UI 2**: Accessible UI components

### Backend - Accounts Service
- **Django 5.0.1**: Web framework for accounts management
- **Django REST Framework 3.14**: API development
- **SQLite**: Database (simple, file-based, suitable for project scope)
- **Token Authentication**: Secure API access
- **Gunicorn 21**: Production WSGI server
- **Pillow 12**: Image processing for avatars
- **DRF Spectacular**: API documentation

### Backend - Game Service
- **Node.js** with **TypeScript 5**: Real-time game server
- **Express 4**: Web server for HTTP endpoints
- **WebSocket (ws 8)**: Real-time bidirectional communication
- **Prom-client**: Metrics collection and monitoring

### Infrastructure
- **Docker & Docker Compose**: Containerization and orchestration
- **Multi-container architecture**: Isolated services for scalability
- **Ngrok**: HTTPS tunneling for secure development/testing
- **Environment Variables (.env)**: Secure credential management

### Technical Justification

**Why Next.js?** 
- Server-side rendering for better performance
- Built-in routing and API routes
- Excellent developer experience with hot reloading
- Strong TypeScript support

**Why Django REST Framework?**
- Rapid API development with built-in authentication
- Excellent ORM for database operations
- Comprehensive testing tools
- Well-documented and mature ecosystem

**Why SQLite?**
- Zero configuration needed
- Sufficient for project requirements
- Easy to backup and migrate
- Perfect for development and small-to-medium applications

**Why WebSocket for Game Service?**
- Real-time, low-latency communication essential for smooth gameplay
- Bidirectional data flow for synchronized game states
- Efficient for continuous data streams (paddle movements, ball position)

**Why Microservices?**
- Separation of concerns (authentication vs game logic)
- Independent scaling and deployment
- Technology flexibility (Python for auth, Node.js for real-time game)
- Easier to maintain and debug

---

## Database Schema

### Accounts Service Database (SQLite)

#### Tables and Relationships

**1. CustomUser (Django Auth User)**
```
CustomUser
├── id (PK, BigAutoField)
├── email (EmailField, unique) [USERNAME_FIELD]
├── username (CharField, unique)
├── password (CharField, hashed)
├── is_active (BooleanField)
├── is_staff (BooleanField)
├── is_superuser (BooleanField)
├── created_at (DateTimeField)
├── updated_at (DateTimeField)
└── groups (ManyToManyField to auth.Group)
```

**2. Profile**
```
Profile
├── id (PK, BigAutoField)
├── user (OneToOneField to CustomUser) [FK]
├── bio (TextField, optional)
└── avatar (ImageField, optional - commented in code)
```

**3. FriendRequest**
```
FriendRequest
├── id (PK, BigAutoField)
├── from_user (ForeignKey to Profile) [FK]
├── to_user (ForeignKey to Profile) [FK]
├── accepted (BooleanField, default=False)
├── created_at (DateTimeField)
└── UNIQUE_TOGETHER: (from_user, to_user)
```

#### Relationships Diagram
```
CustomUser (1) ──── (1) Profile
                      │
                      ├─ (many) FriendRequest [as from_user]
                      └─ (many) FriendRequest [as to_user]
```

### Game Service (In-Memory State)

The game service maintains ephemeral game state in memory using TypeScript interfaces:

- **GameRoom**: Room ID, player connections, game engine instance
- **GameState**: Ball position/velocity, paddle positions, scores, game status
- **Player Sessions**: WebSocket connections mapped to room IDs

No persistent game history is stored (focus on real-time gameplay).

---

## Features List

### Authentication & User Management (Backend Team)
- **User Registration** - Complete signup with email validation and password requirements *(sabrifer)*
- **User Login/Logout** - Token-based authentication with secure session management *(sabrifer)*
- **User Profile** - View and edit user bio and profile information *(sabrifer)*
- **Avatar Upload** - Profile picture upload and management *(sabrifer)*

### Friend System (Backend Team)
- **Send Friend Requests** - Search and send requests to other users *(sabrifer, namoreir)*
- **Accept/Reject Requests** - Manage incoming friend requests *(sabrifer, namoreir)*
- **Friends List** - View all friends with online/offline status *(sabrifer, namoreir)*
- **Remove Friends** - Unfriend functionality *(sabrifer, namoreir)*

### Game Features (Backend + Frontend)
- **Real-time Pong Game** - Classic pong mechanics with smooth physics *(Backend Game Service: julberna | Frontend: julberna, mgonzaga)*
- **Room Creation** - Create private game rooms with unique codes *(Backend Game Service: julberna | Frontend: julberna, mgonzaga)*
- **Room Joining** - Join existing rooms via code *(Backend Game Service: julberna | Frontend: julberna, mgonzaga)*
- **Multiplayer Synchronization** - Real-time game state sync via WebSocket *(Backend Game Service: julberna | Frontend: julberna, mgonzaga)*
- **Score Tracking** - Win detection and score display *(Backend Game Service: julberna | Frontend: julberna, mgonzaga)*
- **Player Ready System** - Both players must ready up before game starts *(Backend Game Service: julberna | Frontend: julberna, mgonzaga)*

### UI/UX Features (Frontend Team)
- **Responsive Design** - Works on various screen sizes *(julberna, mgonzaga)*
- **Dark Theme** - Modern, eye-friendly dark interface *(julberna, mgonzaga)*
- **Loading States** - User feedback during operations *(julberna, mgonzaga)*
- **Error Handling** - Clear error messages for users *(julberna, mgonzaga)*
- **Authentication Pages** - Login, register, and profile pages *(julberna, mgonzaga)*
- **Game Interface** - Lobby, waiting room, and game canvas *(julberna, mgonzaga)*
- **Friend Management UI** - Friend list, requests, and status indicators *(julberna, mgonzaga)*

---

## Modules

### Selected Modules

**Major Modules (2 points each):**

1. **Use a Framework for Both Frontend and Backend** (2 points)
   - **Description**: Utilized modern, production-ready frameworks for both layers of the application
   - **Implemented by**: Full team (sabrifer, julberna, mgonzaga, namoreir)
   - **Implementation**:
     - **Frontend**: Next.js 16.1.1 with React 19 and TypeScript
       - Server-side rendering capabilities
       - Built-in routing and API routes
       - Optimized production builds
     - **Backend**: 
       - Django 5.0.1 with Django REST Framework 3.14 (Accounts Service)
       - Node.js with Express 4 and TypeScript 5 (Game Service)
     - Both frameworks provide robust ecosystems, middleware support, and excellent documentation

2. **Real-time Features Using WebSockets** (2 points)
   - **Description**: Implemented bidirectional real-time communication for live multiplayer gameplay
   - **Implemented by**: julberna (backend), julberna & mgonzaga (frontend)
   - **Implementation**:
     - WebSocket server using `ws` library (Node.js)
     - Real-time game state synchronization at 60 FPS
     - Room-based communication for isolated game sessions
     - Event-driven architecture (CREATE_ROOM, JOIN_ROOM, PADDLE_MOVE, GAME_STATE)
     - Client reconnection handling
     - Low-latency message passing (<50ms typical)
     - File: `/core/game_service/src/index.ts`, `/app/hooks/useWebSocket.ts`

3. **Public API with Security and Documentation** (2 points)
   - **Description**: RESTful API with authentication, rate limiting, and comprehensive documentation
   - **Implemented by**: sabrifer, namoreir
   - **Implementation**:
     - **Authentication**: Token-based authentication (Django REST Framework TokenAuth)
     - **Rate Limiting**: 
       - Anonymous users: 100 requests/day
       - Authenticated users: 1000 requests/day
     - **Documentation**: 
       - OpenAPI/Swagger UI at `/api/schema/swagger-ui/`
       - ReDoc at `/api/schema/redoc/`
       - DRF Spectacular for automatic schema generation
     - **Endpoints** (11 total, exceeds requirement of 5):
       1. `POST /api/auth/register/` - User registration
       2. `POST /api/auth/login/` - User authentication
       3. `POST /api/auth/logout/` - User logout
       4. `GET /api/profile/` - Get user profile
       5. `PUT /api/profile/` - Update profile
       6. `PUT /api/profile/avatar/` - Upload avatar
       7. `DELETE /api/profile/avatar/` - Delete avatar
       8. `POST /api/friends/request/` - Send friend request
       9. `POST /api/friends/accept/` - Accept friend request
       10. `GET /api/friends/pending/` - List pending requests
       11. `GET /api/friends/` - List friends
       12. `DELETE /api/friends/reject/{id}/` - Reject friend request

4. **Standard User Management and Authentication** (2 points)
   - **Description**: Complete user lifecycle management with secure authentication
   - **Implemented by**: sabrifer, namoreir
   - **Implementation**:
     - Custom user model extending Django's AbstractUser
     - Email-based authentication (email as USERNAME_FIELD)
     - Password validation (minimum length, complexity requirements)
     - Token-based session management
     - User profile system with one-to-one relationship
     - Friend request system with accept/reject functionality
     - Secure password hashing (Django's default PBKDF2)
     - CORS configuration for cross-origin requests
     - Files: `/core/accounts_service/accounts/models/`, `/core/accounts_service/accounts/views/auth.py`

5. **Complete Web-Based Game** (2 points)
   - **Description**: Fully functional Pong game playable entirely in the browser
   - **Implemented by**: julberna (backend + frontend), mgonzaga (frontend)
   - **Implementation**:
     - Classic Pong mechanics (ball physics, paddle collision, scoring)
     - Server-authoritative game engine to prevent cheating
     - 60 FPS game loop for smooth gameplay
     - Ball physics: velocity, collision detection, angle calculation
     - Paddle movement with boundary constraints
     - Score tracking and win condition (first to 5 points)
     - Speed increase on each paddle hit (up to 2x)
     - Game states: waiting → playing → finished
     - Files: `/core/game_service/src/game/GameEngine.ts`, `/app/components/Game.tsx`

6. **Remote Players - Real-time Multiplayer** (2 points)
   - **Description**: Two players on separate computers play together in real-time
   - **Implemented by**: julberna (backend), julberna & mgonzaga (frontend)
   - **Implementation**:
     - Room-based matchmaking with unique 6-character codes
     - WebSocket connections for each player
     - Server-side game state management
     - Synchronized paddle movements and ball position
     - Player ready system (both must be ready to start)
     - Disconnection handling (notifies remaining player)
     - Sub-50ms latency for responsive gameplay
     - State broadcast to both clients every frame (16.67ms)
     - Files: `/core/game_service/src/game/GameRoom.ts`

7. **Backend as Microservices** (2 points)
   - **Description**: Application split into independent, specialized services
   - **Implemented by**: Full team architecture, namoreir (Docker orchestration)
   - **Implementation**:
     - **3 separate services**:
       1. **app** (Frontend): Next.js application (port 3000)
       2. **accounts_service** (Backend): Django REST API for user management (port 8000)
       3. **game_service** (Backend): Node.js WebSocket server for game logic (port 3002)
     - Each service has its own:
       - Dockerfile (optimized builds)
       - Dependencies (package.json or requirements.txt)
       - Technology stack (Python vs Node.js)
       - Isolated concerns (auth vs game)
     - Docker Compose orchestration with service networking
     - Independent scaling capabilities
     - Service health checks and monitoring endpoints
     - Files: `/infra/docker-compose.yml`, `/infra/*.Dockerfile`

**Minor Modules (1 point each):**

1. **Use an ORM for Database** (1 point)
   - **Description**: Object-Relational Mapping for type-safe database operations
   - **Implemented by**: sabrifer, namoreir
   - **Implementation**:
     - Django ORM for Accounts Service
     - Models: CustomUser, Profile, FriendRequest
     - Automatic SQL query generation
     - Migration system for schema versioning
     - Relationships: OneToOne (User-Profile), ForeignKey (FriendRequests)
     - Query optimization with `select_related()` and `prefetch_related()`
     - Built-in validation and constraints
     - Files: `/core/accounts_service/accounts/models/`

2. **Server-Side Rendering (SSR)** (1 point)
   - **Description**: Next.js SSR for improved performance and SEO
   - **Implemented by**: julberna, mgonzaga
   - **Implementation**:
     - Next.js App Router with React Server Components
     - Initial HTML rendered on server
     - Faster First Contentful Paint (FCP)
     - SEO-friendly meta tags and structured data
     - Automatic code splitting per route
     - Hydration for client-side interactivity
     - Server actions for data mutations
     - Files: `/app/app/` directory structure

3. **Custom Design System** (1 point)
   - **Description**: Reusable component library with consistent styling
   - **Implemented by**: julberna, mgonzaga
   - **Implementation**:
     - **Color Palette**: 
       - Primary: Amber/Gold tones (amber-200, amber-100)
       - Secondary: Fuchsia/Purple (fuchsia-950)
       - Background: Black/Dark grays
       - Accents: Green (success), Red (error)
     - **Typography**: System font stack, responsive sizing
     - **10+ Reusable Components**:
       1. Header (navigation with auth state)
       2. Footer (info and links)
       3. Dropdown (user menu)
       4. Modal (dialogs)
       5. Button (primary, secondary variants)
       6. FriendList (online/offline status)
       7. FriendRequestList (accept/reject actions)
       8. StatsBox (game statistics display)
       9. Game (canvas component)
       10. GameInstructions (help overlay)
       11. GameOver (end screen)
       12. Lobby (room management)
       13. WaitingRoom (pre-game state)
       14. LoadingPong (loading animation)
     - Tailwind CSS for consistent spacing and utilities
     - Files: `/app/components/`, `/app/globals.css`

4. **Support for Additional Browsers** (1 point)
   - **Description**: Cross-browser compatibility and responsive design
   - **Implemented by**: julberna, mgonzaga
   - **Implementation**:
     - Tested on: Chrome, Firefox, Safari, Edge
     - Responsive breakpoints (mobile, tablet, desktop)
     - Modern CSS with fallbacks
     - Polyfills via Next.js automatic transpilation
     - WebSocket compatibility across browsers
     - Canvas API support verification
     - Flexbox and Grid layouts for compatibility
     - Progressive enhancement approach

**Total Points: 18**
- Major Modules: 7 × 2 = 14 points
- Minor Modules: 4 × 1 = 4 points

---

## Individual Contributions

### Sabrina Ferreira (sabrifer) - Technical Lead & Backend Developer
**Areas of responsibility:**
- Django backend architecture and setup
- User authentication system implementation (registration, login, token management)
- Django REST Framework API endpoints for accounts and profiles
- User and Profile models design and implementation
- Friendship system backend logic (friend requests, accept/reject)
- Token-based authentication and security
- Database schema design and migrations
- Backend code reviews and quality assurance
- Technical decisions on backend architecture

**Challenges faced:**
- **Learning Python and Django**: Coming from a different programming background, had to learn Python syntax, Django framework conventions, and the ORM system. Solution: studied Django documentation extensively and built small prototypes before implementing main features.
- **Implementing secure authentication**: Understanding token-based authentication and Django's authentication system. Solution: researched Django REST Framework best practices and implemented token authentication with proper validation.
- **SQL Database Management**: Learning to work with relational databases, designing schemas with proper relationships. Solution: studied SQL fundamentals, Django ORM documentation, and tested migrations thoroughly.

---

### Juliany Bernardes (julberna) - Product Owner & Full-Stack Developer
**Areas of responsibility:**
- **Frontend Development**:
  - Next.js frontend application setup and configuration
  - User interface design and implementation
  - Authentication pages (login, register)
  - Game lobby and waiting room components
  - WebSocket client integration for real-time gameplay
  - State management with Zustand
  - Responsive design implementation
- **Game Service Backend** (Node.js/TypeScript):
  - WebSocket server setup and real-time communication
  - Game engine logic (ball physics, paddle movement, collision detection)
  - Game room management (create, join, leave)
  - Player state synchronization
  - Game loop and physics calculations (60 FPS)
  - Prometheus metrics for monitoring
- Product vision and feature prioritization
- User experience flow definition

**Challenges faced:**
- **Learning TypeScript**: Transitioning to a strongly-typed language required understanding type systems, interfaces, and generics. Solution: practiced with TypeScript documentation and gradually added types to components.
- **Next.js Framework**: Learning React Server Components, App Router, and Next.js conventions. Solution: followed Next.js documentation, built example projects, and experimented with different patterns.
- **WebSocket Integration**: Understanding bidirectional real-time communication and managing connection states on both client and server side. Solution: studied WebSocket API and ws library documentation, implemented reconnection logic, and handled edge cases.
- **Node.js Backend Development**: Learning Node.js ecosystem, asynchronous programming with async/await, and Express framework for the game service. Solution: studied Node.js documentation, practiced with Promises, and built prototypes.
- **Game Physics and Synchronization**: Ensuring smooth gameplay and keeping both clients in sync without lag. Solution: implemented server-authoritative game loop, optimized update frequency (60 FPS), and handled network latency considerations.
- **Balancing PO and Developer Roles**: Managing feature backlog while also implementing both frontend and backend code. Solution: dedicated specific time blocks for each role and maintained clear communication with the team.

---

### Marcela Gonzaga (mgonzaga) - Project Manager & Frontend Developer
**Areas of responsibility:**
- Frontend component development (Header, Footer, Dropdown, Game canvas)
- Game UI implementation (paddle controls, score display, game over screen)
- Friend list and friend request UI components
- Styling with Tailwind CSS
- API integration with backend services
- User profile pages
- Team coordination and meeting facilitation
- Progress tracking via GitHub Issues
- Risk and deadline management

**Challenges faced:**
- **Learning React and Next.js**: Understanding component lifecycle, hooks (useState, useEffect), and React patterns. Solution: completed React tutorials, studied component patterns, and practiced with smaller examples.
- **Tailwind CSS**: Learning utility-first CSS approach instead of traditional CSS. Solution: explored Tailwind documentation, experimented with different utilities, and built a style guide.
- **Real-time Game Rendering**: Implementing smooth canvas animations and handling game state updates. Solution: researched game loop patterns, requestAnimationFrame, and optimized rendering performance.
- **Project Management**: Coordinating team schedules and keeping everyone aligned. Solution: established regular meetings, clear communication protocols, and used GitHub Issues effectively for transparency.

---

### Natali Moreira (namoreir) - Backend Developer
**Areas of responsibility:**
- **Django Accounts Service Backend**:
  - User and Profile models implementation
  - Friendship system (FriendRequest model and relationships)
  - API endpoints for friend requests (send, accept, reject)
  - Profile management endpoints (view, update, avatar)
  - Backend testing (user creation, authentication, friendship system)
  - Database migrations and schema refinements
  - Serializers for profile and friendship data
- Docker configuration for all services (app, accounts_service, game_service)
- Docker Compose orchestration setup
- Backend code reviews and debugging

**Challenges faced:**
- **Learning Python and Django**: Coming from other programming backgrounds, had to learn Python syntax, Django framework conventions, the ORM system, and Django REST Framework. Solution: studied Django documentation extensively, worked through tutorials, and built prototypes before implementing main features.
- **SQL Database and Relationships**: Learning to work with relational databases, designing schemas with foreign keys and one-to-one/many-to-many relationships (User-Profile, FriendRequest). Solution: studied SQL fundamentals, Django ORM documentation, and tested migrations thoroughly.
- **Django REST Framework**: Understanding serializers, viewsets, and API design patterns. Solution: read DRF documentation, analyzed examples, and implemented endpoints incrementally with testing.
- **Docker Containerization**: Learning Docker concepts, writing Dockerfiles for different tech stacks (Python, Node.js), and multi-container orchestration with Docker Compose. Solution: studied Docker documentation, experimented with different configurations, and optimized build processes.

---

## Instructions

### Prerequisites

Before running the project, ensure you have the following installed:

- **Docker** (version 20.10 or higher)
- **Docker Compose** (version 2.0 or higher)
- **Make** (optional, for using Makefile commands)
- **Git** (for cloning the repository)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd transcendence
   ```

2. **Set up environment variables:**
   
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
   Edit the `.env` file with your specific values
   ```
   
   ⚠️ **Important**: Never commit the `.env` file to Git. It's already included in `.gitignore`.

3. **Build and start all services:**
   ```bash
   make
   # or manually:
   docker compose -f infra/docker-compose.yml -p transcendence up -d --build
   ```

   This will start three services:
   - **app**: Frontend (Next.js) on `http://localhost:3000`
   - **accounts_service**: Backend API (Django) on `http://localhost:8000`
   - **game_service**: Game WebSocket server on `http://localhost:3002`

4. **Access the application:**
   - **Local development**: `http://localhost:3000`
   - **HTTPS via ngrok**: Use your configured ngrok URL

### Available Make Commands

```bash
make          # Build and start all services
make build    # Build Docker images
make up       # Start services
make down     # Stop services
make clean    # Stop services and remove volumes
make fclean   # Complete cleanup (remove all containers, images, volumes)
make re       # Full rebuild (fclean + build + up)
```

### Service-Specific Commands

Build or start individual services:
```bash
# Build specific service
make build SERVICE=app
make build SERVICE=accounts_service
make build SERVICE=game_service

# Start specific service
make up SERVICE=app
```

### Environment Configuration

The project uses environment variables stored in a `.env` file for security and flexibility. All sensitive credentials, API keys, and configuration values are kept separate from the codebase.

#### Required Environment Variables

**`.env` file structure** (see `.env.example` for template)

#### Why We Use `.env`

- **Security**: Keeps sensitive data (tokens, secret keys) out of version control
- **Flexibility**: Easy to change configurations per environment (dev, staging, prod)
- **HTTPS Support**: Ngrok token allows secure HTTPS tunneling for development/testing
- **CORS Management**: Dynamic origin configuration without code changes
- **Compliance**: Follows security best practices required by the project specifications

#### Getting Your Ngrok Token

1. Sign up at [ngrok.com](https://ngrok.com)
2. Get your authtoken from the dashboard
3. Add it to your `.env` file

#### `.env.example` File

The repository includes a `.env.example` file with all required variables (without sensitive values). Use it as a template:

```bash
cp .env.example .env
# Then edit .env with your actual values
```

⚠️ **Security Note**: The `.env` file is included in `.gitignore` and should **never** be committed to Git.

### API Documentation

The Accounts Service API is documented at:
- **Swagger UI**: `http://localhost:8000/api/schema/swagger-ui/`
- **ReDoc**: `http://localhost:8000/api/schema/redoc/`
- **API Documentation**: See `/core/accounts_service/API_DOCUMENTATION.md`

### Development Workflow

1. **Start development environment:**
   ```bash
   make
   ```

2. **View logs:**
   ```bash
   docker compose -f infra/docker-compose.yml logs -f [service-name]
   ```

3. **Run Django migrations (if needed):**
   ```bash
   docker compose -f infra/docker-compose.yml exec accounts_service python manage.py migrate
   ```

4. **Create Django superuser:**
   ```bash
   docker compose -f infra/docker-compose.yml exec accounts_service python manage.py createsuperuser
   ```

5. **Stop services:**
   ```bash
   make down
   ```

### Testing

**Accounts Service Tests:**
```bash
docker compose -f infra/docker-compose.yml exec accounts_service python manage.py test
```

Tests cover:
- User model (creation, uniqueness, authentication)
- Profile model
- Friendship system
- API endpoints
- Rate limiting
- Avatar upload

---

## Resources

### Documentation
- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [Docker Documentation](https://docs.docker.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Tutorials & References
- [Real-time Game Development with WebSockets](https://developer.mozilla.org/en-US/docs/Games)
- [Django Token Authentication](https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication)
- [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)

### AI Usage

AI tools (primarily GitHub Copilot, Gemini and ChatGPT) were used strategically throughout the project to accelerate learning and improve code quality:

**Tasks where AI was used:**

1. **Code Review and Suggestions**
   - Used AI to review code for potential bugs, security issues, and best practices
   - Received suggestions for code optimization and refactoring
   - Identified common anti-patterns and suggested improvements
   - Helped maintain code consistency across the codebase

2. **Framework Best Practices**
   - Consulted AI to learn Django REST Framework conventions and patterns
   - Asked for Next.js best practices regarding App Router, Server Components, and client-side state
   - Learned optimal ways to structure TypeScript interfaces and types
   - Discovered efficient patterns for WebSocket connection management
   - Understood Django ORM query optimization techniques

3. **Writing Tests**
   - Generated test case templates for Django models and API endpoints
   - Helped structure test suites following Django TestCase patterns
   - Suggested edge cases and scenarios to test
   - Assisted with mock data creation for testing
   - Provided examples of integration tests for WebSocket connections

4. **Documentation**
   - Generated API documentation templates
   - Helped structure README sections
   - Assisted in writing clear docstrings for functions and classes
   - Provided examples for code comments and inline documentation
   - Helped create this comprehensive README

5. **Learning and Problem Solving**
   - Explained complex concepts (async/await, WebSocket protocol, Django signals)
   - Provided quick answers to syntax questions in Python, TypeScript, and JavaScript
   - Helped understand error messages and suggested debugging approaches
   - Offered alternative solutions to technical problems

**Parts of the project involving AI:**

- **Backend (Django)**: Authentication flow logic, serializer validation, ORM queries, test case structure
- **Backend (Game Service)**: WebSocket event handlers, game loop optimization, TypeScript type definitions
- **Frontend**: React component patterns, state management with Zustand, WebSocket client implementation
- **Infrastructure**: Docker configuration best practices, docker-compose service orchestration
- **Testing**: Test case generation for user authentication, profile, and friendship features
- **Documentation**: API documentation structure, README organization, code comments

**AI was NOT used for:**

- **Core architecture decisions**: The microservices architecture, technology stack selection, and overall system design were decided by the team
- **Business logic implementation**: The game physics, scoring system, friend request logic, and authentication workflows were designed and implemented by team members
- **Database schema design**: Table relationships, field choices, and data models were created by the team
- **UI/UX design**: Visual design, user flows, and interface layouts were decided by the team
- **Project planning**: Feature prioritization, sprint planning, and task distribution were managed by the team

**How AI enhanced our workflow:**
- Reduced time spent on syntax lookup and framework documentation searches
- Accelerated the learning curve for new technologies (TypeScript, Django, Next.js)
- Improved code quality through automated review suggestions
- Increased test coverage by providing comprehensive test examples
- Made documentation more thorough and professional

---

## Known Limitations

- Game state is not persisted (no match history)
- Single database per service (SQLite - not suitable for high-scale production)
- No reconnection handling for dropped WebSocket connections during games
- Avatar functionality is partially implemented (commented out in models)
- No chat system implemented yet
- No leaderboard/statistics tracking across sessions

---

## Future Improvements

- Implement persistent game history and statistics
- Add tournament mode
- Implement chat system
- Add AI opponent option
- Migrate to PostgreSQL for production
- Implement WebSocket reconnection logic
- Add spectator mode for ongoing games
- Implement matchmaking system

---

## License

This project is part of the 42 School curriculum and follows their academic policies.

---

## Credits

Developed by the **sabrifer, julberna, mgonzaga, namoreir** team as part of the 42 ft_transcendence project.

Special thanks to the 42 community and peers for feedback and support during development.
