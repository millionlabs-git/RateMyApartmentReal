import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import passport from "./auth/passport";
import authRoutes from "./auth/routes";
import userRoutes from "./user/routes";
import buildingsRoutes from "./buildings/routes";
import adminRoutes from "./admin/routes";
import placesRoutes from "./places/routes";
import waitlistRoutes from "./waitlist/routes";
import { storage } from "./storage";
import MemoryStore from "memorystore";
import { registerObjectStorageRoutes } from "./replit_integrations/object_storage";
import { setupVentureApiRoutes } from "./ventureApi";

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const sessionSecret = process.env.SESSION_SECRET || "dev-secret-change-in-production";

  app.use(
    session({
      store: new MemoryStoreSession({
        checkPeriod: 86400000,
      }),
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use("/api/auth", authRoutes);
  app.use("/api/user", userRoutes);
  app.use("/api/buildings", buildingsRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/places", placesRoutes);
  app.use("/api/waitlist", waitlistRoutes);
  
  // Register object storage routes for file uploads
  registerObjectStorageRoutes(app);

  // VentureAPI routes - external metrics API
  setupVentureApiRoutes(app);

  return httpServer;
}
