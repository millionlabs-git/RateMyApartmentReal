import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, pgEnum, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const userStatusEnum = pgEnum("user_status", ["active", "suspended"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("user"),
  status: userStatusEnum("status").notNull().default("active"),
  emailNotifications: boolean("email_notifications").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  passwordHash: true,
}).extend({
  email: z.string().email("Invalid email format"),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, "You must accept the Terms of Service"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  newEmail: text("new_email").notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type SignupInput = z.infer<typeof signupSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type EmailVerificationToken = typeof emailVerificationTokens.$inferSelect;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// Building schema
export const buildingStatusEnum = pgEnum("building_status", ["pending", "approved", "denied"]);

export const buildings = pgTable("buildings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull().default("New York"),
  zip: text("zip").notNull(),
  landlord: text("landlord"),
  neighborhood: text("neighborhood"),
  buildingType: text("building_type"),
  geocodeLat: doublePrecision("geocode_lat"),
  geocodeLng: doublePrecision("geocode_lng"),
  status: buildingStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Building = typeof buildings.$inferSelect;
export type InsertBuilding = typeof buildings.$inferInsert;

// Review schema
export const reviewStatusEnum = pgEnum("review_status", ["pending", "approved", "denied"]);

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buildingId: varchar("building_id").notNull().references(() => buildings.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  overallRating: integer("overall_rating").notNull(),
  floorNumber: integer("floor_number").notNull(),
  noiseRating: integer("noise_rating"),
  cleanlinessRating: integer("cleanliness_rating"),
  maintenanceRating: integer("maintenance_rating"),
  safetyRating: integer("safety_rating"),
  pestRating: integer("pest_rating"),
  reviewText: text("review_text").notNull(),
  isAnonymous: boolean("is_anonymous").notNull().default(true),
  status: reviewStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

// Review with building info for My Reviews
export type ReviewWithBuilding = Review & {
  buildingName: string;
};

// Review with user info for public display
export type ReviewWithUser = Review & {
  userEmail: string | null; // null if anonymous
  photos: ReviewPhoto[];
};

// Review photos schema
export const reviewPhotos = pgTable("review_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  reviewId: varchar("review_id").notNull().references(() => reviews.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type ReviewPhoto = typeof reviewPhotos.$inferSelect;

// Duplicate queue schema
export const duplicateStatusEnum = pgEnum("duplicate_status", ["pending", "merged", "dismissed"]);

export const duplicateQueue = pgTable("duplicate_queue", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buildingId1: varchar("building_id_1").notNull().references(() => buildings.id, { onDelete: "cascade" }),
  buildingId2: varchar("building_id_2").notNull().references(() => buildings.id, { onDelete: "cascade" }),
  similarityScore: integer("similarity_score").notNull(),
  status: duplicateStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type DuplicateQueueEntry = typeof duplicateQueue.$inferSelect;
export type InsertDuplicateQueueEntry = typeof duplicateQueue.$inferInsert;

// Audit log schema
export const auditLog = pgTable("audit_log", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  actionType: text("action_type").notNull(),
  userId: varchar("user_id").references(() => users.id),
  details: text("details"), // JSON string
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type AuditLogEntry = typeof auditLog.$inferSelect;
