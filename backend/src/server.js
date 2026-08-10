// import"../instrument.mjs"
// import express from "express";
// import { ENV } from "./config/env.js";
// import { connectDB } from "./config/db.js";
// import { clerkMiddleware } from "@clerk/express";
// import { functions, inngest } from "./config/inngest.js";
// import { serve } from "inngest/express";
// import chatRoutes from "./routes/chat.route.js"

// import cors from "cors";

// import * as Sentry from "@sentry/node";

// const express = require('express');
// const app = express();

// module.exports = app;

// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }

// app.use(express.json());
// app.use(cors({origin: ENV.CLIENT_URL, credentials: true}));
// app.use(clerkMiddleware());

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// // app.get("/debug-sentry", (req, res) => {
// //   throw new Error("My first Sentry error!");
// // });

// app.use("/api/inngest", serve({ client: inngest, functions }));
// app.use("/api/chat", chatRoutes);

// Sentry.setupExpressErrorHandler(app);

// const startServer = async () => {
//   try {
//     await connectDB();
//     if (ENV.NODE_ENV !== "production") {
//       app.listen(ENV.PORT, () => {
//         console.log("Server started on port:", ENV.PORT);
//       });
//     }
//   } catch (error) {
//     console.error("Error staring servers:", error);
//     process.exit(1);
//   }
// };

// startServer();

// export default app;


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

// Define allowed origins
const allowedOrigins = [
  "https://alpha-slack-frontend.vercel.app",
  ENV.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// 1. Enable CORS middleware
app.use(cors(corsOptions));

// 2. Explicitly intercept ALL preflight OPTIONS requests before auth
app.options("*", cors(corsOptions));

// 3. Inngest Route (before Clerk)
app.use("/api/inngest", serve({ client: inngest, functions }));

// 4. Clerk Middleware
app.use(clerkMiddleware());

// 5. Lazy Database Connection Middleware
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

// 6. Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/chat", chatRoutes);

// Sentry Error Handler
Sentry.setupExpressErrorHandler(app);

if (ENV.NODE_ENV !== "production") {
  app.listen(ENV.PORT || 5000, () => {
    console.log("Server started on port:", ENV.PORT || 5000);
  });
}

export default app;