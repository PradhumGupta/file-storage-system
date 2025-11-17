# Zenith — File Storage System

A modern, full-stack file storage and collaboration platform built with **React**, **TypeScript**, **Express**, **Prisma**, **Neon**, and **Supabase Storage**.

![Status](https://img.shields.io/badge/status-Development-yellow)
![Node](https://img.shields.io/badge/Node.js-≥18-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 🌐 Live Demo

**[🚀 Try Zenith Live](https://file-storage-system-lyart.vercel.app/)** — Deployed on Vercel

> 📧 Demo credentials available on request

---

## 🎥 Demo Video

[![Zenith Demo](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID)

---

## 🎯 Features

- **Workspaces** — Personal & organization workspaces
- **Teams** — Create teams and assign folders with granular access control
- **Role-Based Access Control (RBAC)** — Workspace and team-level permissions
- **File Management** — Upload, download, organize files in hierarchical folders
- **Cloud Storage** — Supabase Storage for scalable file hosting
- **JWT Authentication** — Secure token-based auth with refresh strategy
- **Background Jobs** — BullMQ + Redis for async processing
- **Type Safety** — Full TypeScript codebase

---

## ⭐ **How the Project Works (Very Simple Explanation)**


The project is a **secure multi-workspace, multi-team file storage system** with strict access control, team-based folders, shared folders, private folders, and token-based authentication. The system is like a **Google-Drive-style workspace**, where people in a company/team can store and manage files with proper access control.

1️⃣ **Users & Login**
---------------------

Users sign up and log in.They get:

*   **Access token** → short-term authentication
*   **Refresh token** → long-term authentication
    

This keeps the system secure.

2️⃣ **Workspaces**
------------------

A workspace is like a company account. Each workspace has:

*   **Owner** – full control
*   **Admins** – manage everything
*   **Members** – normal users
*   **Viewers** – read-only users

Anyone inside the workspace can see shared folders.

3️⃣ **Teams**
-------------

Inside a workspace, admins can create **Teams** like:

*   Engineering
*   Marketing
*   Sales

Teams allow workspaces to give **specific folders** only to people inside that team.

4️⃣ **Folders**
---------------

Folders are created inside a workspace.

Every folder are categorized into two types - PRIVATE or PUBLIC (default)

### **PUBLIC**

Everyone in the workspace can access it.

### **PRIVATE**

Only the creator (and admins) and members of that team can access it.

Folders can also have subfolders.

5️⃣ **Files**
-------------

Files are uploaded into folders.

You can:

*   Upload
*   View
*   Download
*   Rename
*   Delete
    

Based on your permission level.

6️⃣ **Access Control (checkAccess middleware)**
-----------------------------------------------

Before opening any folder or file, the system checks:

1.  Are you in this workspace?
    
2.  Are you in the correct team (if it is a team folder)?
    
3.  What role do you have (owner/admin/member/viewer)?
    
4.  Does your role allow:
    
    *   Viewing?
    *   Editing?
    *   Uploading?
    *   Deleting?
        

If yes → allowIf no → deny

This keeps everything secure.

7️⃣ **Async Background Jobs**
-----------------------------

Heavy work is done in a background job queue, like:

*   Generating thumbnails
*   Virus scanning
*   Processing large files
    

This keeps the app fast.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js v5.1.0
- **Language**: TypeScript v5.9.2
- **Database**: PostgreSQL (Neon) + Prisma v6.16.2
- **File Storage**: Supabase Storage (ap-southeast-1)
- **Authentication**: JWT + bcryptjs
- **Background Jobs**: BullMQ + ioredis

### Frontend
- **Framework**: React + TypeScript
- **Build Tool**: Vite
- **State Management**: Context API
- **HTTP Client**: Axios

### Infrastructure
- **Database**: PostgreSQL via Neon
- **Object Storage**: Supabase
- **Message Queue**: Redis (for BullMQ)

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18
- PostgreSQL (or Neon account)
- Supabase account
- Yarn or npm

### Installation

```bash
# Clone repository
git clone <repo-url>
cd file-storage-system

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### Environment Setup

**Server** — `server/.env`:
```env
PORT=8080
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/db

# JWT
ACCESS_TOKEN_SECRET=your_access_secret_here
REFRESH_TOKEN_SECRET=your_refresh_secret_here

# Supabase
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your_supabase_key
SUPABASE_BUCKET=project-files

# CORS
CLIENT_URL=http://localhost:5173
```

**Client** — `client/.env`:
```env
VITE_API_URL=http://localhost:8080/api
```

### Run Locally

```bash
# Terminal 1 — Start server (port 8080)
cd server
npm run dev

# Terminal 2 — Start client (port 5173)
cd client
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 📁 Project Structure

```
file-storage-system/
├── server/
│   ├── src/
│   │   ├── index.ts                 # Entry point
│   │   ├── controllers/             # Business logic
│   │   ├── services/                # Data operations
│   │   ├── middleware/              # Auth, CORS, error handling
│   │   ├── routes/                  # API endpoints
│   │   ├── config/                  # Prisma, Supabase, permissions
│   │   ├── utils/                   # JWT, cookies, errors
│   │   └── queues/                  # BullMQ jobs
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   └── migrations/              # DB migrations
│   └── package.json
│
├── client/
│   ├── src/
│   │   ├── App.tsx                  # Main app & routing
│   │   ├── pages/                   # Route pages
│   │   ├── components/              # Reusable UI components
│   │   ├── contexts/                # Auth & Workspace contexts
│   │   ├── services/                # API wrappers
│   │   ├── hooks/                   # Custom hooks
│   │   └── layouts/                 # Page layouts
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register      → User registration
POST   /api/auth/sign-in       → User login
POST   /api/auth/refresh       → Refresh access token
POST   /api/auth/sign-out      → Logout
GET    /api/auth/profile       → Get user profile
```

### Workspaces
```
GET    /api/workspaces                     → List user workspaces
POST   /api/workspaces                     → Create workspace
GET    /api/workspaces/:id/list            → Fetch workspace details
POST   /api/workspaces/:id/members         → Invite members
DELETE /api/workspaces/:id/members/:userId → Remove member
```

### Files & Folders
```
POST   /api/workspaces/:id/files/upload        → Upload file
GET    /api/workspaces/:id/files/:fileId/download → Download file
POST   /api/workspaces/:id/folders             → Create folder
GET    /api/workspaces/:id/folders/:folderId   → Get folder contents
GET    /api/workspaces/:id/folders/:folderId/path → Get breadcrumb path
```

### Teams
```
POST   /api/workspaces/:id/team           → Create team
GET    /api/workspaces/:id/team           → List teams
POST   /api/workspaces/:id/team/:id/add   → Add team member
PUT    /api/workspaces/:id/team/:id/folder → Assign folder to team
```

---

## 🗄️ Database Schema

**Core Models:**
- **User** — Authentication & profile
- **Workspace** — Container for files/teams (PERSONAL or ORGANIZATION)
- **Membership** — User ↔ Workspace relationship with role
- **Folder** — Hierarchical file organization
- **File** — File metadata & Supabase storage reference
- **Team** — Workspace-scoped teams
- **TeamMember** — User ↔ Team relationship with role

**View schema:** [`server/prisma/schema.prisma`](server/prisma/schema.prisma)

### Database Setup

```bash
cd server
npx prisma migrate dev    # Run migrations
npx prisma generate       # Generate Prisma client
```

---

## 🔧 Development Commands

### Server
```bash
npm run dev        # Development mode (with hot reload)
npm run build      # Build TypeScript
npm start          # Run compiled code
npm run lint       # Run ESLint
```

### Client
```bash
npm run dev        # Development server (port 5173)
npm run build      # Build for production
npm run preview    # Preview production build
```

---

## 🚢 Deployment

### Build

```bash
# Server
cd server
npm run build
npm start          # Runs dist/index.js

# Client
cd client
npm run build      # Output: dist/
# Serve dist/ folder as static files
```

### Environment Variables (Production)

Ensure these are set in your deployment environment:
- `DATABASE_URL` — PostgreSQL connection string
- `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET` — Strong random values
- `SUPABASE_URL`, `SUPABASE_KEY` — Supabase credentials
- `NODE_ENV=production`
- `CLIENT_URL` — Frontend URL for CORS

---

## 🔒 Security

✅ Passwords hashed with bcryptjs (10 rounds)  
✅ JWT tokens with expiration & rotation  
✅ HTTP-only, secure cookies (prevent XSS)  
✅ CORS configured for trusted origins  
✅ SameSite cookies (prevent CSRF)  
✅ Role-based access control (RBAC)  
✅ Database SSL/TLS connections  
✅ Input validation with Zod  

---

## 📚 Key Files

| File | Purpose |
|------|---------|
| [`server/src/index.ts`](server/src/index.ts) | Express app & route setup |
| [`server/src/controllers/`](server/src/controllers/) | Business logic handlers |
| [`server/src/services/`](server/src/services/) | Data operations & external APIs |
| [`server/src/middleware/`](server/src/middleware/) | Auth, access control, error handling |
| [`server/prisma/schema.prisma`](server/prisma/schema.prisma) | Database schema |
| [`client/src/App.tsx`](client/src/App.tsx) | React app & routing |
| [`client/src/pages/Dashboard.tsx`](client/src/pages/Dashboard.tsx) | Main dashboard |
| [`server/SERVER_IMPLEMENTATION_REPORT.md`](server/SERVER_IMPLEMENTATION_REPORT.md) | Detailed implementation docs |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License — see the LICENSE file for details.

---

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [your-email@example.com](mailto:pradhumg00@gmail.com)

---

**Built with ❤️ for seamless file collaboration**
