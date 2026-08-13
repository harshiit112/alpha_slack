# 💬 Alpha Slack — Real-Time Chat & Video Calling Platform

Alpha Slack is a modern, full-stack, enterprise-grade clone of Slack, designed for high-performance real-time messaging, multi-user channels, and high-fidelity video/audio calling. 

Built on a robust architecture featuring **React 19**, **Vite**, **Express**, **MongoDB (Mongoose)**, **Clerk Auth**, **Stream Chat/Video SDKs**, and serverless event-driven background processing using **Inngest**.

---

## 🚀 Key Features

- **🔐 Robust Authentication**: Secure registration, sign-in, and profile management powered by Clerk.
- **💬 Real-Time Messaging**: Group channels and direct messaging (DMs) with typing indicators, message reactions, file attachments, and pinned messages using **GetStream Chat SDK**.
- **📹 HD Video & Audio Calls**: Start or join high-fidelity audio/video calls directly from any channel header utilizing the **GetStream Video SDK**.
- **🔄 Event-Driven User Synchronization**: Automatic user provisioning and deletion between Clerk Auth, MongoDB database, and Stream Chat using **Inngest** webhooks.
- **📊 Application Monitoring**: Comprehensive client-side and server-side error tracking and performance profiling integrated with **Sentry**.
- **⚡ Next-Gen Styling**: Built with the brand new **Tailwind CSS v4** engine for highly responsive, ultra-fast, and premium UI layouts.

---

## 🛠️ Technology Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, TanStack Query (React Query v5), Axios, React Router v7, Lucide Icons |
| **Backend** | Node.js, Express v5, MongoDB, Mongoose, Inngest |
| **Integrations** | Clerk Express & Clerk React (Auth), GetStream Chat & Video SDKs, Sentry (Error Tracking) |

---

## 📂 Project Architecture & Key Source Files

```
Slack/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js          # MongoDB connection handler
│   │   │   ├── env.js         # Environment variables validation & setup
│   │   │   ├── inngest.js     # Background event handlers (syncUser, deleteUser)
│   │   │   └── stream.js       # Stream Chat initialization and token generation
│   │   ├── controllers/
│   │   │   └── chat.controller.js # Stream token generator endpoint handler
│   │   ├── middleware/
│   │   │   └── auth.middleware.js # Protect routes using Clerk JWT verification
│   │   ├── models/
│   │   │   └── user.model.js  # Mongoose Schema for local User metadata
│   │   ├── routes/
│   │   │   └── chat.route.js  # Chat APIs (/api/chat/token)
│   │   └── server.js          # Main Express server config
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/        # Modals for Channel Creation, Invites, Pinned Messages
    │   ├── pages/
    │   │   ├── AuthPage.jsx   # Clerk Sign In / Sign Up interface
    │   │   ├── HomePage.jsx   # Main Chat layout & sidebar navigation
    │   │   ├── CallPage.jsx   # Stream Video and Audio call stream view
    │   │   └── UsersList.jsx  # Workspace user directory
    │   ├── App.jsx            # Routing and Provider tree
    │   └── main.jsx           # App entry point
    └── package.json
```

### Key Files:
- **Backend Entrypoint:** [`backend/src/server.js`](file:///c:/Users/hv702/Downloads/Slack/backend/src/server.js)
- **User Sync Worker:** [`backend/src/config/inngest.js`](file:///c:/Users/hv702/Downloads/Slack/backend/src/config/inngest.js)
- **Stream Client Wrapper:** [`backend/src/config/stream.js`](file:///c:/Users/hv702/Downloads/Slack/backend/src/config/stream.js)
- **Frontend App Shell:** [`frontend/src/App.jsx`](file:///c:/Users/hv702/Downloads/Slack/frontend/src/App.jsx)
- **Video Calling Room:** [`frontend/src/pages/CallPage.jsx`](file:///c:/Users/hv702/Downloads/Slack/frontend/src/pages/CallPage.jsx)
- **Main Chat Workspace:** [`frontend/src/pages/HomePage.jsx`](file:///c:/Users/hv702/Downloads/Slack/frontend/src/pages/HomePage.jsx)

---

## ⚙️ Environment Configuration

To run this application locally, you must configure environment files in both the frontend and backend directories.

### 1. Backend (`/backend/.env`)
Create a file named `.env` inside the `/backend` folder and define:
```env
PORT=5001
NODE_ENV=development

# Database Configuration
MONGO_URI=your_mongodb_connection_string

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# GetStream Credentials
STREAM_API_KEY=your_stream_api_key
STREAM_API_SECRET=your_stream_api_secret

# Sentry Monitoring (Optional)
SENTRY_DSN=your_sentry_backend_dsn

# Inngest Background Jobs Setup
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key

# Client Application URL
CLIENT_URL=http://localhost:5173
```

### 2. Frontend (`/frontend/.env`)
Create a file named `.env` inside the `/frontend` folder and define:
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STREAM_API_KEY=your_stream_api_key
VITE_SENTRY_DSN=your_sentry_frontend_dsn
VITE_API_BASE_URL=http://localhost:5001/api
```

---

## 🛠️ Local Development Setup

Follow these commands to install dependencies and run the project locally.

### Start the Backend Server
```bash
cd backend
npm install
npm run dev
```
*Note: In development mode, the server runs with `nodemon` and auto-imports `instrument.mjs` for Sentry tracing.*

### Start the Inngest Dev Server (For Webhooks)
To run and test user sync events locally, launch the Inngest dev server:
```bash
npx inngest-cli@latest dev -u http://localhost:5001/api/inngest
```

### Start the Frontend Application
Open a new terminal window and run:
```bash
cd frontend
npm install
npm run dev
```

---

## 🔄 Clerk Webhook Integration (via Inngest)

To keep your local MongoDB users and GetStream users synchronized with Clerk authentication state, configure a Clerk webhook pointing to your Inngest server:

1. Go to your **Clerk Dashboard** -> **Webhooks**.
2. Add a new endpoint pointing to your deployed backend: `https://<your-backend-url>/api/inngest` (or use a tunnel like ngrok / Localtunnel for local development testing).
3. Subscribe to the following Clerk events:
   - `user.created` (maps to the `sync-user` Inngest function, which creates a database entry and registers the user in GetStream Chat).
   - `user.deleted` (maps to the `delete-user-from-db` Inngest function, which cleans up user records in MongoDB and deletes the user from GetStream Chat).

---

## 🚀 Production Deployment

### Frontend (Vite + Vercel)
The frontend is pre-configured with a Vercel routing manifest (`vercel.json`) and can be seamlessly deployed to Vercel. 
- Ensure all environment variables starting with `VITE_` are set in the Vercel dashboard.

### Backend (Express + Vercel/Render)
The backend includes a `vercel.json` routing configuration to allow serverless execution.
- Ensure all backend environment variables are added to the hosting environment dashboard.
