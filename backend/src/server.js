// backend/src/server.js
import "../instrument.mjs";
import express from "express";
import cors from "cors";
import * as Sentry from "@sentry/node";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { functions, inngest } from "./config/inngest.js";
import chatRoutes from "./routes/chat.route.js";

const app = express();

// 1. Configure CORS options explicitly
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    // Allow local development and any vercel preview deployment
    const isAllowed = 
      origin === ENV.CLIENT_URL ||
      origin.startsWith("http://localhost:") ||
      origin.endsWith(".vercel.app");

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Explicitly answer HTTP OPTIONS preflight requests before any auth check
// app.options("*", cors(corsOptions));

app.use(express.json());

// 2. Inngest route (Placed BEFORE clerkMiddleware)
app.use("/api/inngest", serve({ client: inngest, functions }));

// 3. Clerk Authentication Middleware
app.use(clerkMiddleware());

// 4. Lazy Database Connection Middleware
let isConnected = false;
const ensureDbConnected = async (req, res, next) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (error) {
      console.error("Database connection failed:", error);
      return res.status(500).json({ error: "Database connection failed" });
    }
  }
  next();
};

app.use(ensureDbConnected);

// 5. Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/chat", chatRoutes);

// 6. Error Handler
Sentry.setupExpressErrorHandler(app);

// Only listen on a port in local development
if (ENV.NODE_ENV !== "production") {
  app.listen(ENV.PORT || 5001, () => {
    console.log("Server started on port:", ENV.PORT || 5001);
  });
}

export default app;