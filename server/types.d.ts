import { type User as SchemaUser } from "../shared/schema";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      passwordHash: string;
      role: "user" | "admin";
      status: "active" | "suspended";
      emailNotifications: boolean;
      createdAt: Date;
    }
  }
}

export {};
