import { type User, type InsertUser, type PasswordResetToken, type EmailVerificationToken, type Building, type InsertBuilding, type Review, type InsertReview, type ReviewWithBuilding, type ReviewWithUser, type ReviewPhoto, type DuplicateQueueEntry, type AuditLogEntry } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { DatabaseStorage } from "./db-storage";

// Re-export types from storage-types
export type {
  CategoryRatings,
  FloorInsight,
  BuildingWithStats,
  AdminStats,
  ReviewWithDetails,
  DuplicatePairWithBuildings,
} from "./storage-types";

import type {
  CategoryRatings,
  FloorInsight,
  BuildingWithStats,
  AdminStats,
  ReviewWithDetails,
  DuplicatePairWithBuildings,
} from "./storage-types";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(userId: string, passwordHash: string): Promise<void>;
  updateUserEmail(userId: string, email: string): Promise<void>;
  createPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<PasswordResetToken>;
  getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined>;
  markTokenUsed(tokenId: string): Promise<void>;
  createEmailVerificationToken(userId: string, newEmail: string, token: string, expiresAt: Date): Promise<EmailVerificationToken>;
  getEmailVerificationToken(token: string): Promise<EmailVerificationToken | undefined>;
  deleteEmailVerificationToken(tokenId: string): Promise<void>;

  // Building methods
  getBuilding(id: string): Promise<Building | undefined>;
  getBuildingWithStats(id: string): Promise<BuildingWithStats | undefined>;
  searchBuildings(search: string, page: number, limit: number): Promise<{ buildings: (Building & { reviewCount: number; averageRating: number | null })[]; total: number }>;
  getAllApprovedBuildings(): Promise<Building[]>;
  createBuilding(building: InsertBuilding): Promise<Building>;
  updateBuildingGeocode(id: string, lat: number, lng: number): Promise<void>;

  // Review methods
  getReviewsByUserId(userId: string, page: number, limit: number): Promise<{ reviews: ReviewWithBuilding[]; total: number }>;
  getReviewsByBuildingId(buildingId: string, sort: "newest" | "highest" | "lowest", page: number, limit: number): Promise<{ reviews: ReviewWithUser[]; total: number }>;
  createReview(review: InsertReview): Promise<Review>;
  addReviewPhotos(reviewId: string, photoUrls: string[]): Promise<void>;

  // User preferences and account management
  updateUserNotifications(userId: string, emailNotifications: boolean): Promise<void>;
  deleteUser(userId: string): Promise<void>;

  // Admin methods
  getAdminStats(): Promise<AdminStats>;
  getAllUsers(search: string, page: number, limit: number): Promise<{ users: User[]; total: number }>;
  updateUserStatus(userId: string, status: "active" | "suspended"): Promise<void>;
  getPendingReviews(page: number, limit: number): Promise<{ reviews: ReviewWithDetails[]; total: number }>;
  getReviewWithDetails(reviewId: string): Promise<ReviewWithDetails | undefined>;
  updateReviewStatus(reviewId: string, status: "approved" | "denied"): Promise<void>;
  bulkUpdateReviewStatus(reviewIds: string[], status: "approved" | "denied"): Promise<void>;
  getPendingBuildings(page: number, limit: number): Promise<{ buildings: Building[]; total: number }>;
  getAllBuildingsAdmin(search: string, status: string, page: number, limit: number): Promise<{ buildings: (Building & { reviewCount: number; averageRating: number | null })[]; total: number }>;
  updateBuilding(id: string, data: Partial<Pick<Building, "name" | "address" | "zip" | "neighborhood" | "landlord" | "buildingType">>): Promise<Building>;
  updateBuildingStatus(buildingId: string, status: "approved" | "denied"): Promise<void>;
  bulkUpdateBuildingStatus(buildingIds: string[], status: "approved" | "denied"): Promise<void>;

  // Duplicate queue methods
  createDuplicateQueueEntry(buildingId1: string, buildingId2: string, score: number): Promise<boolean>;
  getPendingDuplicates(page: number, limit: number): Promise<{ duplicates: DuplicatePairWithBuildings[]; total: number }>;
  getPendingDuplicatesCount(): Promise<number>;
  getDuplicatePair(id: string): Promise<DuplicatePairWithBuildings | undefined>;
  updateDuplicateStatus(id: string, status: "merged" | "dismissed"): Promise<void>;

  // Merge operations
  mergeBuildings(masterId: string, secondaryId: string, adminId: string): Promise<void>;

  // Audit log
  createAuditLog(actionType: string, userId: string | null, details: object): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private passwordResetTokens: Map<string, PasswordResetToken>;
  private emailVerificationTokens: Map<string, EmailVerificationToken>;
  private buildings: Map<string, Building>;
  private reviews: Map<string, Review>;
  private reviewPhotos: Map<string, ReviewPhoto>;
  private duplicateQueue: Map<string, DuplicateQueueEntry>;
  private auditLogs: Map<string, AuditLogEntry>;

  constructor() {
    this.users = new Map();
    this.passwordResetTokens = new Map();
    this.emailVerificationTokens = new Map();
    this.buildings = new Map();
    this.reviews = new Map();
    this.reviewPhotos = new Map();
    this.duplicateQueue = new Map();
    this.auditLogs = new Map();
  }

  // Internal method for seeding admin user (development only)
  seedUser(user: User): void {
    this.users.set(user.id, user);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      role: "user",
      status: "active",
      emailNotifications: true,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPassword(userId: string, passwordHash: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.passwordHash = passwordHash;
      this.users.set(userId, user);
    }
  }

  async createPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<PasswordResetToken> {
    const id = randomUUID();
    const resetToken: PasswordResetToken = {
      id,
      userId,
      token,
      expiresAt,
      usedAt: null,
      createdAt: new Date(),
    };
    this.passwordResetTokens.set(token, resetToken);
    return resetToken;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    return this.passwordResetTokens.get(token);
  }

  async markTokenUsed(tokenId: string): Promise<void> {
    const token = Array.from(this.passwordResetTokens.values()).find(t => t.id === tokenId);
    if (token) {
      token.usedAt = new Date();
      this.passwordResetTokens.set(token.token, token);
    }
  }

  async updateUserEmail(userId: string, email: string): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.email = email;
      this.users.set(userId, user);
    }
  }

  async createEmailVerificationToken(userId: string, newEmail: string, token: string, expiresAt: Date): Promise<EmailVerificationToken> {
    const id = randomUUID();
    const verificationToken: EmailVerificationToken = {
      id,
      userId,
      newEmail,
      token,
      expiresAt,
      createdAt: new Date(),
    };
    this.emailVerificationTokens.set(token, verificationToken);
    return verificationToken;
  }

  async getEmailVerificationToken(token: string): Promise<EmailVerificationToken | undefined> {
    return this.emailVerificationTokens.get(token);
  }

  async deleteEmailVerificationToken(tokenId: string): Promise<void> {
    const token = Array.from(this.emailVerificationTokens.values()).find(t => t.id === tokenId);
    if (token) {
      this.emailVerificationTokens.delete(token.token);
    }
  }

  // Building methods
  async getBuilding(id: string): Promise<Building | undefined> {
    return this.buildings.get(id);
  }

  async getBuildingWithStats(id: string): Promise<BuildingWithStats | undefined> {
    const building = this.buildings.get(id);
    if (!building || building.status !== "approved") {
      return undefined;
    }

    const buildingReviews = Array.from(this.reviews.values())
      .filter(r => r.buildingId === id && r.status === "approved");

    const reviewCount = buildingReviews.length;
    const averageRating = reviewCount > 0
      ? buildingReviews.reduce((sum, r) => sum + r.overallRating, 0) / reviewCount
      : null;

    // Calculate category averages
    const calculateCategoryAverage = (
      reviews: Review[],
      getter: (r: Review) => number | null
    ): number | null => {
      const validRatings = reviews.map(getter).filter((r): r is number => r !== null);
      if (validRatings.length === 0) return null;
      return Math.round((validRatings.reduce((sum, r) => sum + r, 0) / validRatings.length) * 10) / 10;
    };

    const categoryRatings: CategoryRatings = {
      noise: calculateCategoryAverage(buildingReviews, r => r.noiseRating),
      cleanliness: calculateCategoryAverage(buildingReviews, r => r.cleanlinessRating),
      maintenance: calculateCategoryAverage(buildingReviews, r => r.maintenanceRating),
      safety: calculateCategoryAverage(buildingReviews, r => r.safetyRating),
      pests: calculateCategoryAverage(buildingReviews, r => r.pestRating),
    };

    // Calculate floor insights
    const floorMap = new Map<number, { total: number; count: number }>();
    for (const review of buildingReviews) {
      const existing = floorMap.get(review.floorNumber);
      if (existing) {
        existing.total += review.overallRating;
        existing.count += 1;
      } else {
        floorMap.set(review.floorNumber, { total: review.overallRating, count: 1 });
      }
    }

    const floorInsights: FloorInsight[] = Array.from(floorMap.entries())
      .map(([floor, data]) => ({
        floor,
        avgRating: Math.round((data.total / data.count) * 10) / 10,
        reviewCount: data.count,
      }))
      .sort((a, b) => a.floor - b.floor);

    return { ...building, reviewCount, averageRating, categoryRatings, floorInsights };
  }

  async searchBuildings(search: string, page: number, limit: number): Promise<{ buildings: (Building & { reviewCount: number; averageRating: number | null })[]; total: number }> {
    const searchLower = search.toLowerCase();

    const approvedBuildings = Array.from(this.buildings.values())
      .filter(b => b.status === "approved");

    const matchingBuildings = searchLower
      ? approvedBuildings.filter(b =>
          b.name.toLowerCase().includes(searchLower) ||
          b.address.toLowerCase().includes(searchLower)
        )
      : approvedBuildings;

    const total = matchingBuildings.length;
    const offset = (page - 1) * limit;
    const paginatedBuildings = matchingBuildings
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);

    const buildingsWithStats = paginatedBuildings.map(building => {
      const buildingReviews = Array.from(this.reviews.values())
        .filter(r => r.buildingId === building.id && r.status === "approved");

      const reviewCount = buildingReviews.length;
      const averageRating = reviewCount > 0
        ? buildingReviews.reduce((sum, r) => sum + r.overallRating, 0) / reviewCount
        : null;

      return { ...building, reviewCount, averageRating };
    });

    return { buildings: buildingsWithStats, total };
  }

  async getAllApprovedBuildings(): Promise<Building[]> {
    return Array.from(this.buildings.values()).filter(b => b.status === "approved");
  }

  async updateBuildingGeocode(id: string, lat: number, lng: number): Promise<void> {
    const building = this.buildings.get(id);
    if (building) {
      building.geocodeLat = lat;
      building.geocodeLng = lng;
      this.buildings.set(id, building);
    }
  }

  async createBuilding(building: InsertBuilding): Promise<Building> {
    const id = randomUUID();
    const newBuilding: Building = {
      id,
      name: building.name,
      address: building.address,
      city: building.city ?? "New York",
      zip: building.zip,
      landlord: building.landlord ?? null,
      neighborhood: building.neighborhood ?? null,
      buildingType: building.buildingType ?? null,
      geocodeLat: building.geocodeLat ?? null,
      geocodeLng: building.geocodeLng ?? null,
      status: building.status ?? "pending",
      createdAt: new Date(),
    };
    this.buildings.set(id, newBuilding);
    return newBuilding;
  }

  // Review methods
  async getReviewsByUserId(userId: string, page: number, limit: number): Promise<{ reviews: ReviewWithBuilding[]; total: number }> {
    const userReviews = Array.from(this.reviews.values())
      .filter(review => review.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = userReviews.length;
    const offset = (page - 1) * limit;
    const paginatedReviews = userReviews.slice(offset, offset + limit);

    const reviewsWithBuildings: ReviewWithBuilding[] = paginatedReviews.map(review => {
      const building = this.buildings.get(review.buildingId);
      return {
        ...review,
        buildingName: building?.name ?? "Unknown Building",
      };
    });

    return { reviews: reviewsWithBuildings, total };
  }

  async getReviewsByBuildingId(
    buildingId: string,
    sort: "newest" | "highest" | "lowest",
    page: number,
    limit: number
  ): Promise<{ reviews: ReviewWithUser[]; total: number }> {
    let buildingReviews = Array.from(this.reviews.values())
      .filter(review => review.buildingId === buildingId && review.status === "approved");

    // Sort reviews
    switch (sort) {
      case "newest":
        buildingReviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case "highest":
        buildingReviews.sort((a, b) => b.overallRating - a.overallRating);
        break;
      case "lowest":
        buildingReviews.sort((a, b) => a.overallRating - b.overallRating);
        break;
    }

    const total = buildingReviews.length;
    const offset = (page - 1) * limit;
    const paginatedReviews = buildingReviews.slice(offset, offset + limit);

    const reviewsWithUsers: ReviewWithUser[] = paginatedReviews.map(review => {
      const user = this.users.get(review.userId);
      const photos = Array.from(this.reviewPhotos.values())
        .filter(p => p.reviewId === review.id)
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      return {
        ...review,
        userEmail: review.isAnonymous ? null : (user?.email ?? null),
        photos,
      };
    });

    return { reviews: reviewsWithUsers, total };
  }

  async createReview(review: InsertReview): Promise<Review> {
    const id = randomUUID();
    const newReview: Review = {
      id,
      buildingId: review.buildingId,
      userId: review.userId,
      overallRating: review.overallRating,
      floorNumber: review.floorNumber,
      noiseRating: review.noiseRating ?? null,
      cleanlinessRating: review.cleanlinessRating ?? null,
      maintenanceRating: review.maintenanceRating ?? null,
      safetyRating: review.safetyRating ?? null,
      pestRating: review.pestRating ?? null,
      reviewText: review.reviewText,
      isAnonymous: review.isAnonymous ?? true,
      status: review.status ?? "pending",
      createdAt: new Date(),
    };
    this.reviews.set(id, newReview);
    return newReview;
  }

  async addReviewPhotos(reviewId: string, photoUrls: string[]): Promise<void> {
    for (const imageUrl of photoUrls) {
      const id = randomUUID();
      const photo: ReviewPhoto = {
        id,
        reviewId,
        imageUrl,
        createdAt: new Date(),
      };
      this.reviewPhotos.set(id, photo);
    }
  }

  async updateUserNotifications(userId: string, emailNotifications: boolean): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.emailNotifications = emailNotifications;
      this.users.set(userId, user);
    }
  }

  async deleteUser(userId: string): Promise<void> {
    // Delete user's reviews
    const userReviews = Array.from(this.reviews.values()).filter(r => r.userId === userId);
    for (const review of userReviews) {
      this.reviews.delete(review.id);
    }

    // Delete user's password reset tokens
    const userTokens = Array.from(this.passwordResetTokens.values()).filter(t => t.userId === userId);
    for (const token of userTokens) {
      this.passwordResetTokens.delete(token.token);
    }

    // Delete user's email verification tokens
    const userVerificationTokens = Array.from(this.emailVerificationTokens.values()).filter(t => t.userId === userId);
    for (const token of userVerificationTokens) {
      this.emailVerificationTokens.delete(token.token);
    }

    // Delete user
    this.users.delete(userId);
  }

  // Admin methods
  async getAdminStats(): Promise<AdminStats> {
    const allUsers = Array.from(this.users.values());
    const allBuildings = Array.from(this.buildings.values());
    const allReviews = Array.from(this.reviews.values());

    return {
      totalUsers: allUsers.length,
      totalBuildings: allBuildings.length,
      totalReviews: allReviews.length,
      pendingBuildings: allBuildings.filter(b => b.status === "pending").length,
      pendingReviews: allReviews.filter(r => r.status === "pending").length,
    };
  }

  async getAllUsers(search: string, page: number, limit: number): Promise<{ users: User[]; total: number }> {
    let allUsers = Array.from(this.users.values());

    if (search) {
      const searchLower = search.toLowerCase();
      allUsers = allUsers.filter(u => u.email.toLowerCase().includes(searchLower));
    }

    allUsers.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = allUsers.length;
    const offset = (page - 1) * limit;
    const users = allUsers.slice(offset, offset + limit);

    return { users, total };
  }

  async updateUserStatus(userId: string, status: "active" | "suspended"): Promise<void> {
    const user = this.users.get(userId);
    if (user) {
      user.status = status;
      this.users.set(userId, user);
    }
  }

  async getPendingReviews(page: number, limit: number): Promise<{ reviews: ReviewWithDetails[]; total: number }> {
    const pendingReviews = Array.from(this.reviews.values())
      .filter(r => r.status === "pending")
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = pendingReviews.length;
    const offset = (page - 1) * limit;
    const paginatedReviews = pendingReviews.slice(offset, offset + limit);

    const reviewsWithDetails: ReviewWithDetails[] = paginatedReviews.map(review => {
      const building = this.buildings.get(review.buildingId);
      const user = this.users.get(review.userId);
      const photos = Array.from(this.reviewPhotos.values()).filter(p => p.reviewId === review.id);
      return {
        ...review,
        buildingName: building?.name ?? "Unknown Building",
        userEmail: user?.email ?? "Unknown User",
        photos,
      };
    });

    return { reviews: reviewsWithDetails, total };
  }

  async getReviewWithDetails(reviewId: string): Promise<ReviewWithDetails | undefined> {
    const review = this.reviews.get(reviewId);
    if (!review) return undefined;

    const building = this.buildings.get(review.buildingId);
    const user = this.users.get(review.userId);
    const photos = Array.from(this.reviewPhotos.values()).filter(p => p.reviewId === review.id);

    return {
      ...review,
      buildingName: building?.name ?? "Unknown Building",
      userEmail: user?.email ?? "Unknown User",
      photos,
    };
  }

  async updateReviewStatus(reviewId: string, status: "approved" | "denied"): Promise<void> {
    const review = this.reviews.get(reviewId);
    if (review) {
      review.status = status;
      this.reviews.set(reviewId, review);
    }
  }

  async bulkUpdateReviewStatus(reviewIds: string[], status: "approved" | "denied"): Promise<void> {
    for (const id of reviewIds) {
      await this.updateReviewStatus(id, status);
    }
  }

  async getPendingBuildings(page: number, limit: number): Promise<{ buildings: Building[]; total: number }> {
    const pendingBuildings = Array.from(this.buildings.values())
      .filter(b => b.status === "pending")
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = pendingBuildings.length;
    const offset = (page - 1) * limit;
    const buildings = pendingBuildings.slice(offset, offset + limit);

    return { buildings, total };
  }

  async getAllBuildingsAdmin(search: string, status: string, page: number, limit: number): Promise<{ buildings: (Building & { reviewCount: number; averageRating: number | null })[]; total: number }> {
    const searchLower = search.toLowerCase();

    let allBuildings = Array.from(this.buildings.values());

    // Filter by status if not "all"
    if (status !== "all") {
      allBuildings = allBuildings.filter(b => b.status === status);
    }

    // Filter by search
    if (searchLower) {
      allBuildings = allBuildings.filter(b =>
        b.name.toLowerCase().includes(searchLower) ||
        b.address.toLowerCase().includes(searchLower)
      );
    }

    allBuildings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = allBuildings.length;
    const offset = (page - 1) * limit;
    const paginatedBuildings = allBuildings.slice(offset, offset + limit);

    const buildingsWithStats = paginatedBuildings.map(building => {
      const stats = this.getBuildingStats(building.id);
      return { ...building, ...stats };
    });

    return { buildings: buildingsWithStats, total };
  }

  async updateBuilding(id: string, data: Partial<Pick<Building, "name" | "address" | "zip" | "neighborhood" | "landlord" | "buildingType">>): Promise<Building> {
    const building = this.buildings.get(id);
    if (!building) {
      throw new Error("Building not found");
    }

    const updatedBuilding = { ...building, ...data };
    this.buildings.set(id, updatedBuilding);
    return updatedBuilding;
  }

  async updateBuildingStatus(buildingId: string, status: "approved" | "denied"): Promise<void> {
    const building = this.buildings.get(buildingId);
    if (building) {
      building.status = status;
      this.buildings.set(buildingId, building);
    }
  }

  async bulkUpdateBuildingStatus(buildingIds: string[], status: "approved" | "denied"): Promise<void> {
    for (const id of buildingIds) {
      await this.updateBuildingStatus(id, status);
    }
  }

  // Duplicate queue methods
  async createDuplicateQueueEntry(buildingId1: string, buildingId2: string, score: number): Promise<boolean> {
    // Normalize order (smaller ID first) to prevent duplicate pairs
    const [id1, id2] = [buildingId1, buildingId2].sort();

    // Check if this pair already exists (in any status)
    const existingEntry = Array.from(this.duplicateQueue.values()).find(
      (entry) =>
        (entry.buildingId1 === id1 && entry.buildingId2 === id2)
    );

    if (existingEntry) {
      return false; // Already exists
    }

    const id = randomUUID();
    const entry: DuplicateQueueEntry = {
      id,
      buildingId1: id1,
      buildingId2: id2,
      similarityScore: score,
      status: "pending",
      createdAt: new Date(),
    };

    this.duplicateQueue.set(id, entry);
    return true;
  }

  private getBuildingStats(buildingId: string): { reviewCount: number; averageRating: number | null } {
    const buildingReviews = Array.from(this.reviews.values())
      .filter((r) => r.buildingId === buildingId && r.status === "approved");

    const reviewCount = buildingReviews.length;
    const averageRating =
      reviewCount > 0
        ? buildingReviews.reduce((sum, r) => sum + r.overallRating, 0) / reviewCount
        : null;

    return { reviewCount, averageRating };
  }

  async getPendingDuplicates(page: number, limit: number): Promise<{ duplicates: DuplicatePairWithBuildings[]; total: number }> {
    const pendingEntries = Array.from(this.duplicateQueue.values())
      .filter((entry) => entry.status === "pending")
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    const total = pendingEntries.length;
    const offset = (page - 1) * limit;
    const paginatedEntries = pendingEntries.slice(offset, offset + limit);

    const duplicates: DuplicatePairWithBuildings[] = [];

    for (const entry of paginatedEntries) {
      const building1 = this.buildings.get(entry.buildingId1);
      const building2 = this.buildings.get(entry.buildingId2);

      if (!building1 || !building2) continue;

      const stats1 = this.getBuildingStats(entry.buildingId1);
      const stats2 = this.getBuildingStats(entry.buildingId2);

      duplicates.push({
        id: entry.id,
        building1: { ...building1, ...stats1 },
        building2: { ...building2, ...stats2 },
        similarityScore: entry.similarityScore,
        status: entry.status,
        createdAt: entry.createdAt,
      });
    }

    return { duplicates, total };
  }

  async getPendingDuplicatesCount(): Promise<number> {
    return Array.from(this.duplicateQueue.values()).filter(
      (entry) => entry.status === "pending"
    ).length;
  }

  async getDuplicatePair(id: string): Promise<DuplicatePairWithBuildings | undefined> {
    const entry = this.duplicateQueue.get(id);
    if (!entry) return undefined;

    const building1 = this.buildings.get(entry.buildingId1);
    const building2 = this.buildings.get(entry.buildingId2);

    if (!building1 || !building2) return undefined;

    const stats1 = this.getBuildingStats(entry.buildingId1);
    const stats2 = this.getBuildingStats(entry.buildingId2);

    return {
      id: entry.id,
      building1: { ...building1, ...stats1 },
      building2: { ...building2, ...stats2 },
      similarityScore: entry.similarityScore,
      status: entry.status,
      createdAt: entry.createdAt,
    };
  }

  async updateDuplicateStatus(id: string, status: "merged" | "dismissed"): Promise<void> {
    const entry = this.duplicateQueue.get(id);
    if (entry) {
      entry.status = status;
      this.duplicateQueue.set(id, entry);
    }
  }

  async mergeBuildings(masterId: string, secondaryId: string, adminId: string): Promise<void> {
    const masterBuilding = this.buildings.get(masterId);
    const secondaryBuilding = this.buildings.get(secondaryId);

    if (!masterBuilding || !secondaryBuilding) {
      throw new Error("Buildings not found");
    }

    // Count reviews being transferred
    const reviewsToTransfer = Array.from(this.reviews.values()).filter(
      (r) => r.buildingId === secondaryId
    );

    // Transfer all reviews from secondary to master
    for (const review of reviewsToTransfer) {
      review.buildingId = masterId;
      this.reviews.set(review.id, review);
    }

    // Delete secondary building
    this.buildings.delete(secondaryId);

    // Update any duplicate queue entries involving the secondary building
    const entriesToDelete = Array.from(this.duplicateQueue.entries())
      .filter(([, entry]) => entry.buildingId1 === secondaryId || entry.buildingId2 === secondaryId)
      .map(([entryId]) => entryId);

    for (const entryId of entriesToDelete) {
      this.duplicateQueue.delete(entryId);
    }

    // Create audit log
    await this.createAuditLog("building_merge", adminId, {
      masterId,
      secondaryId,
      masterName: masterBuilding.name,
      secondaryName: secondaryBuilding.name,
      reviewsTransferred: reviewsToTransfer.length,
    });
  }

  async createAuditLog(actionType: string, userId: string | null, details: object): Promise<void> {
    const id = randomUUID();
    const entry: AuditLogEntry = {
      id,
      actionType,
      userId,
      details: JSON.stringify(details),
      createdAt: new Date(),
    };
    this.auditLogs.set(id, entry);
  }
}

// Use DatabaseStorage if DATABASE_URL is set, otherwise fall back to MemStorage
let storage: IStorage;

if (process.env.DATABASE_URL) {
  storage = new DatabaseStorage();
  console.log("Using PostgreSQL database storage");
} else {
  storage = new MemStorage();
  console.log("Using in-memory storage (data will be lost on restart)");
}

export { storage };

// Seed sample buildings for development (only for MemStorage)
const sampleBuildings: InsertBuilding[] = [
  { name: "The Belnord", address: "225 West 86th Street", city: "New York", zip: "10024", neighborhood: "Upper West Side", buildingType: "Pre-war", landlord: "HFZ Capital Group", status: "approved" },
  { name: "The Ansonia", address: "2109 Broadway", city: "New York", zip: "10023", neighborhood: "Upper West Side", buildingType: "Pre-war", landlord: "Ansonia Residents LLC", status: "approved" },
  { name: "The Dakota", address: "1 West 72nd Street", city: "New York", zip: "10023", neighborhood: "Upper West Side", buildingType: "Pre-war", landlord: "Dakota Inc.", status: "approved" },
  { name: "One57", address: "157 West 57th Street", city: "New York", zip: "10019", neighborhood: "Midtown", buildingType: "High-rise", landlord: "Extell Development", status: "approved" },
  { name: "432 Park Avenue", address: "432 Park Avenue", city: "New York", zip: "10022", neighborhood: "Midtown East", buildingType: "High-rise", landlord: "Macklowe Properties", status: "approved" },
  { name: "The Apthorp", address: "390 West End Avenue", city: "New York", zip: "10024", neighborhood: "Upper West Side", buildingType: "Pre-war", landlord: "Area Property Partners", status: "approved" },
  { name: "Stuyvesant Town", address: "First Avenue & East 14th Street", city: "New York", zip: "10009", neighborhood: "East Village", buildingType: "Post-war", landlord: "Blackstone Group", status: "approved" },
  { name: "Peter Cooper Village", address: "First Avenue & East 20th Street", city: "New York", zip: "10010", neighborhood: "Gramercy", buildingType: "Post-war", landlord: "Blackstone Group", status: "approved" },
  { name: "The San Remo", address: "145-146 Central Park West", city: "New York", zip: "10023", neighborhood: "Upper West Side", buildingType: "Pre-war", landlord: "San Remo Owners Corp", status: "approved" },
  { name: "London Terrace", address: "435 West 23rd Street", city: "New York", zip: "10011", neighborhood: "Chelsea", buildingType: "Pre-war", landlord: "Rose Associates", status: "approved" },
  { name: "The Rockefeller Apartments", address: "17 West 54th Street", city: "New York", zip: "10019", neighborhood: "Midtown", buildingType: "Pre-war", landlord: "Rockefeller Group", status: "approved" },
  { name: "River House", address: "435 East 52nd Street", city: "New York", zip: "10022", neighborhood: "Sutton Place", buildingType: "Pre-war", landlord: "River House Inc.", status: "approved" },
  { name: "Trump Tower", address: "725 Fifth Avenue", city: "New York", zip: "10022", neighborhood: "Midtown", buildingType: "High-rise", landlord: "Trump Organization", status: "approved" },
  { name: "The Beresford", address: "211 Central Park West", city: "New York", zip: "10024", neighborhood: "Upper West Side", buildingType: "Pre-war", landlord: "Beresford Apartments Corp", status: "approved" },
  { name: "Essex Crossing", address: "180 Broome Street", city: "New York", zip: "10002", neighborhood: "Lower East Side", buildingType: "New Construction", landlord: "Delancey Street Associates", status: "approved" },
];

// Only seed data for MemStorage (development without database)
if (!process.env.DATABASE_URL && storage instanceof MemStorage) {
  (async () => {
    // Seed sample buildings
    for (const building of sampleBuildings) {
      await storage.createBuilding(building);
    }

    // Seed admin user for development
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const adminId = randomUUID();
    const adminUser: User = {
      id: adminId,
      email: "admin@ratemyapartment.com",
      passwordHash: adminPasswordHash,
      role: "admin",
      status: "active",
      emailNotifications: true,
      createdAt: new Date(),
    };
    storage.seedUser(adminUser);
    console.log("Seeded admin user: admin@ratemyapartment.com / admin123");
  })();
}
