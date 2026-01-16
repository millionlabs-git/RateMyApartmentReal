import { eq, and, like, or, sql, desc, asc, count } from "drizzle-orm";
import { db as maybeDb } from "./db";
import {
  users,
  passwordResetTokens,
  emailVerificationTokens,
  buildings,
  reviews,
  reviewPhotos,
  duplicateQueue,
  auditLog,
  type User,
  type InsertUser,
  type PasswordResetToken,
  type EmailVerificationToken,
  type Building,
  type InsertBuilding,
  type Review,
  type InsertReview,
  type ReviewWithBuilding,
  type ReviewWithUser,
  type ReviewPhoto,
  type DuplicateQueueEntry,
  type AuditLogEntry,
} from "@shared/schema";
import type { IStorage } from "./storage";
import type {
  CategoryRatings,
  FloorInsight,
  BuildingWithStats,
  AdminStats,
  ReviewWithDetails,
  DuplicatePairWithBuildings,
} from "./storage-types";

export class DatabaseStorage implements IStorage {
  private get db() {
    if (!maybeDb) {
      throw new Error("Database not initialized - DATABASE_URL not set");
    }
    return maybeDb;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await this.db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUserPassword(userId: string, passwordHash: string): Promise<void> {
    await this.db.update(users).set({ passwordHash }).where(eq(users.id, userId));
  }

  async updateUserEmail(userId: string, email: string): Promise<void> {
    await this.db.update(users).set({ email }).where(eq(users.id, userId));
  }

  async createPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<PasswordResetToken> {
    const [resetToken] = await this.db.insert(passwordResetTokens).values({
      userId,
      token,
      expiresAt,
    }).returning();
    return resetToken;
  }

  async getPasswordResetToken(token: string): Promise<PasswordResetToken | undefined> {
    const [resetToken] = await this.db.select().from(passwordResetTokens).where(eq(passwordResetTokens.token, token));
    return resetToken;
  }

  async markTokenUsed(tokenId: string): Promise<void> {
    await this.db.update(passwordResetTokens).set({ usedAt: new Date() }).where(eq(passwordResetTokens.id, tokenId));
  }

  async createEmailVerificationToken(userId: string, newEmail: string, token: string, expiresAt: Date): Promise<EmailVerificationToken> {
    const [verificationToken] = await this.db.insert(emailVerificationTokens).values({
      userId,
      newEmail,
      token,
      expiresAt,
    }).returning();
    return verificationToken;
  }

  async getEmailVerificationToken(token: string): Promise<EmailVerificationToken | undefined> {
    const [verificationToken] = await this.db.select().from(emailVerificationTokens).where(eq(emailVerificationTokens.token, token));
    return verificationToken;
  }

  async deleteEmailVerificationToken(tokenId: string): Promise<void> {
    await this.db.delete(emailVerificationTokens).where(eq(emailVerificationTokens.id, tokenId));
  }

  async getBuilding(id: string): Promise<Building | undefined> {
    const [building] = await this.db.select().from(buildings).where(eq(buildings.id, id));
    return building;
  }

  async getBuildingWithStats(id: string): Promise<BuildingWithStats | undefined> {
    const [building] = await this.db.select().from(buildings).where(and(eq(buildings.id, id), eq(buildings.status, "approved")));
    if (!building) return undefined;

    const buildingReviews = await this.db.select().from(reviews).where(and(eq(reviews.buildingId, id), eq(reviews.status, "approved")));

    const reviewCount = buildingReviews.length;
    const averageRating = reviewCount > 0
      ? buildingReviews.reduce((sum: number, r: typeof buildingReviews[0]) => sum + r.overallRating, 0) / reviewCount
      : null;

    const calculateCategoryAverage = (getter: (r: Review) => number | null): number | null => {
      const validRatings = buildingReviews.map(getter).filter((r): r is number => r !== null);
      if (validRatings.length === 0) return null;
      return Math.round((validRatings.reduce((sum: number, r: number) => sum + r, 0) / validRatings.length) * 10) / 10;
    };

    const categoryRatings: CategoryRatings = {
      noise: calculateCategoryAverage(r => r.noiseRating),
      cleanliness: calculateCategoryAverage(r => r.cleanlinessRating),
      maintenance: calculateCategoryAverage(r => r.maintenanceRating),
      safety: calculateCategoryAverage(r => r.safetyRating),
      pests: calculateCategoryAverage(r => r.pestRating),
    };

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
    const searchLower = `%${search.toLowerCase()}%`;

    const whereCondition = search
      ? and(
          eq(buildings.status, "approved"),
          or(
            sql`LOWER(${buildings.name}) LIKE ${searchLower}`,
            sql`LOWER(${buildings.address}) LIKE ${searchLower}`
          )
        )
      : eq(buildings.status, "approved");

    const [{ total }] = await this.db.select({ total: count() }).from(buildings).where(whereCondition);

    const offset = (page - 1) * limit;
    const matchingBuildings = await this.db.select()
      .from(buildings)
      .where(whereCondition)
      .orderBy(desc(buildings.createdAt))
      .limit(limit)
      .offset(offset);

    const buildingsWithStats = await Promise.all(matchingBuildings.map(async (building: typeof matchingBuildings[0]) => {
      const buildingReviews = await this.db.select().from(reviews).where(and(eq(reviews.buildingId, building.id), eq(reviews.status, "approved")));
      const reviewCount = buildingReviews.length;
      const averageRating = reviewCount > 0
        ? buildingReviews.reduce((sum: number, r: typeof buildingReviews[0]) => sum + r.overallRating, 0) / reviewCount
        : null;
      return { ...building, reviewCount, averageRating };
    }));

    return { buildings: buildingsWithStats, total };
  }

  async getAllApprovedBuildings(): Promise<Building[]> {
    return this.db.select().from(buildings).where(eq(buildings.status, "approved"));
  }

  async createBuilding(building: InsertBuilding): Promise<Building> {
    const [newBuilding] = await this.db.insert(buildings).values(building).returning();
    return newBuilding;
  }

  async updateBuildingGeocode(id: string, lat: number, lng: number): Promise<void> {
    await this.db.update(buildings).set({ geocodeLat: lat, geocodeLng: lng }).where(eq(buildings.id, id));
  }

  async getReviewsByUserId(userId: string, page: number, limit: number): Promise<{ reviews: ReviewWithBuilding[]; total: number }> {
    const [{ total }] = await this.db.select({ total: count() }).from(reviews).where(eq(reviews.userId, userId));

    const offset = (page - 1) * limit;
    const userReviews = await this.db.select()
      .from(reviews)
      .where(eq(reviews.userId, userId))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    const reviewsWithBuildings: ReviewWithBuilding[] = await Promise.all(userReviews.map(async (review: typeof userReviews[0]) => {
      const [building] = await this.db.select().from(buildings).where(eq(buildings.id, review.buildingId));
      return {
        ...review,
        buildingName: building?.name ?? "Unknown Building",
      };
    }));

    return { reviews: reviewsWithBuildings, total };
  }

  async getReviewsByBuildingId(buildingId: string, sort: "newest" | "highest" | "lowest", page: number, limit: number): Promise<{ reviews: ReviewWithUser[]; total: number }> {
    const [{ total }] = await this.db.select({ total: count() }).from(reviews).where(and(eq(reviews.buildingId, buildingId), eq(reviews.status, "approved")));

    const orderBy = sort === "newest" ? desc(reviews.createdAt)
      : sort === "highest" ? desc(reviews.overallRating)
      : asc(reviews.overallRating);

    const offset = (page - 1) * limit;
    const buildingReviews = await this.db.select()
      .from(reviews)
      .where(and(eq(reviews.buildingId, buildingId), eq(reviews.status, "approved")))
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const reviewsWithUsers: ReviewWithUser[] = await Promise.all(buildingReviews.map(async (review: typeof buildingReviews[0]) => {
      const [user] = await this.db.select().from(users).where(eq(users.id, review.userId));
      const photos = await this.db.select().from(reviewPhotos).where(eq(reviewPhotos.reviewId, review.id)).orderBy(asc(reviewPhotos.createdAt));
      return {
        ...review,
        userEmail: review.isAnonymous ? null : (user?.email ?? null),
        photos,
      };
    }));

    return { reviews: reviewsWithUsers, total };
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await this.db.insert(reviews).values(review).returning();
    return newReview;
  }

  async updateUserNotifications(userId: string, emailNotifications: boolean): Promise<void> {
    await this.db.update(users).set({ emailNotifications }).where(eq(users.id, userId));
  }

  async deleteUser(userId: string): Promise<void> {
    await this.db.delete(users).where(eq(users.id, userId));
  }

  async getAdminStats(): Promise<AdminStats> {
    const [{ totalUsers }] = await this.db.select({ totalUsers: count() }).from(users);
    const [{ totalBuildings }] = await this.db.select({ totalBuildings: count() }).from(buildings);
    const [{ totalReviews }] = await this.db.select({ totalReviews: count() }).from(reviews);
    const [{ pendingBuildings }] = await this.db.select({ pendingBuildings: count() }).from(buildings).where(eq(buildings.status, "pending"));
    const [{ pendingReviews }] = await this.db.select({ pendingReviews: count() }).from(reviews).where(eq(reviews.status, "pending"));

    return {
      totalUsers,
      totalBuildings,
      totalReviews,
      pendingBuildings,
      pendingReviews,
    };
  }

  async getAllUsers(search: string, page: number, limit: number): Promise<{ users: User[]; total: number }> {
    const whereCondition = search
      ? sql`LOWER(${users.email}) LIKE ${`%${search.toLowerCase()}%`}`
      : undefined;

    const [{ total }] = await this.db.select({ total: count() }).from(users).where(whereCondition);

    const offset = (page - 1) * limit;
    const allUsers = await this.db.select()
      .from(users)
      .where(whereCondition)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    return { users: allUsers, total };
  }

  async updateUserStatus(userId: string, status: "active" | "suspended"): Promise<void> {
    await this.db.update(users).set({ status }).where(eq(users.id, userId));
  }

  async getPendingReviews(page: number, limit: number): Promise<{ reviews: ReviewWithDetails[]; total: number }> {
    const [{ total }] = await this.db.select({ total: count() }).from(reviews).where(eq(reviews.status, "pending"));

    const offset = (page - 1) * limit;
    const pendingReviews = await this.db.select()
      .from(reviews)
      .where(eq(reviews.status, "pending"))
      .orderBy(desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    const reviewsWithDetails: ReviewWithDetails[] = await Promise.all(pendingReviews.map(async (review: typeof pendingReviews[0]) => {
      const [building] = await this.db.select().from(buildings).where(eq(buildings.id, review.buildingId));
      const [user] = await this.db.select().from(users).where(eq(users.id, review.userId));
      const photos = await this.db.select().from(reviewPhotos).where(eq(reviewPhotos.reviewId, review.id));
      return {
        ...review,
        buildingName: building?.name ?? "Unknown Building",
        userEmail: user?.email ?? "Unknown User",
        photos,
      };
    }));

    return { reviews: reviewsWithDetails, total };
  }

  async getReviewWithDetails(reviewId: string): Promise<ReviewWithDetails | undefined> {
    const [review] = await this.db.select().from(reviews).where(eq(reviews.id, reviewId));
    if (!review) return undefined;

    const [building] = await this.db.select().from(buildings).where(eq(buildings.id, review.buildingId));
    const [user] = await this.db.select().from(users).where(eq(users.id, review.userId));
    const photos = await this.db.select().from(reviewPhotos).where(eq(reviewPhotos.reviewId, review.id));

    return {
      ...review,
      buildingName: building?.name ?? "Unknown Building",
      userEmail: user?.email ?? "Unknown User",
      photos,
    };
  }

  async updateReviewStatus(reviewId: string, status: "approved" | "denied"): Promise<void> {
    await this.db.update(reviews).set({ status }).where(eq(reviews.id, reviewId));
  }

  async bulkUpdateReviewStatus(reviewIds: string[], status: "approved" | "denied"): Promise<void> {
    for (const id of reviewIds) {
      await this.updateReviewStatus(id, status);
    }
  }

  async getPendingBuildings(page: number, limit: number): Promise<{ buildings: Building[]; total: number }> {
    const [{ total }] = await this.db.select({ total: count() }).from(buildings).where(eq(buildings.status, "pending"));

    const offset = (page - 1) * limit;
    const pendingBuildings = await this.db.select()
      .from(buildings)
      .where(eq(buildings.status, "pending"))
      .orderBy(desc(buildings.createdAt))
      .limit(limit)
      .offset(offset);

    return { buildings: pendingBuildings, total };
  }

  async getAllBuildingsAdmin(search: string, status: string, page: number, limit: number): Promise<{ buildings: (Building & { reviewCount: number; averageRating: number | null })[]; total: number }> {
    const searchLower = `%${search.toLowerCase()}%`;

    let whereCondition;
    if (status === "all") {
      whereCondition = search
        ? or(
            sql`LOWER(${buildings.name}) LIKE ${searchLower}`,
            sql`LOWER(${buildings.address}) LIKE ${searchLower}`
          )
        : undefined;
    } else {
      whereCondition = search
        ? and(
            eq(buildings.status, status as "pending" | "approved" | "denied"),
            or(
              sql`LOWER(${buildings.name}) LIKE ${searchLower}`,
              sql`LOWER(${buildings.address}) LIKE ${searchLower}`
            )
          )
        : eq(buildings.status, status as "pending" | "approved" | "denied");
    }

    const [{ total }] = await this.db.select({ total: count() }).from(buildings).where(whereCondition);

    const offset = (page - 1) * limit;
    const allBuildings = await this.db.select()
      .from(buildings)
      .where(whereCondition)
      .orderBy(desc(buildings.createdAt))
      .limit(limit)
      .offset(offset);

    const buildingsWithStats = await Promise.all(allBuildings.map(async (building: typeof allBuildings[0]) => {
      const stats = await this.getBuildingStats(building.id);
      return { ...building, ...stats };
    }));

    return { buildings: buildingsWithStats, total };
  }

  async updateBuilding(id: string, data: Partial<Pick<Building, "name" | "address" | "zip" | "neighborhood" | "landlord" | "buildingType">>): Promise<Building> {
    const [updatedBuilding] = await this.db.update(buildings)
      .set(data)
      .where(eq(buildings.id, id))
      .returning();
    return updatedBuilding;
  }

  async updateBuildingStatus(buildingId: string, status: "approved" | "denied"): Promise<void> {
    await this.db.update(buildings).set({ status }).where(eq(buildings.id, buildingId));
  }

  async bulkUpdateBuildingStatus(buildingIds: string[], status: "approved" | "denied"): Promise<void> {
    for (const id of buildingIds) {
      await this.updateBuildingStatus(id, status);
    }
  }

  async createDuplicateQueueEntry(buildingId1: string, buildingId2: string, score: number): Promise<boolean> {
    const [id1, id2] = [buildingId1, buildingId2].sort();

    const [existingEntry] = await this.db.select().from(duplicateQueue).where(and(
      eq(duplicateQueue.buildingId1, id1),
      eq(duplicateQueue.buildingId2, id2)
    ));

    if (existingEntry) return false;

    await this.db.insert(duplicateQueue).values({
      buildingId1: id1,
      buildingId2: id2,
      similarityScore: score,
    });

    return true;
  }

  private async getBuildingStats(buildingId: string): Promise<{ reviewCount: number; averageRating: number | null }> {
    const buildingReviews = await this.db.select().from(reviews).where(and(eq(reviews.buildingId, buildingId), eq(reviews.status, "approved")));
    const reviewCount = buildingReviews.length;
    const averageRating = reviewCount > 0
      ? buildingReviews.reduce((sum: number, r: typeof buildingReviews[0]) => sum + r.overallRating, 0) / reviewCount
      : null;
    return { reviewCount, averageRating };
  }

  async getPendingDuplicates(page: number, limit: number): Promise<{ duplicates: DuplicatePairWithBuildings[]; total: number }> {
    const [{ total }] = await this.db.select({ total: count() }).from(duplicateQueue).where(eq(duplicateQueue.status, "pending"));

    const offset = (page - 1) * limit;
    const pendingEntries = await this.db.select()
      .from(duplicateQueue)
      .where(eq(duplicateQueue.status, "pending"))
      .orderBy(desc(duplicateQueue.createdAt))
      .limit(limit)
      .offset(offset);

    const duplicates: DuplicatePairWithBuildings[] = [];

    for (const entry of pendingEntries) {
      const [building1] = await this.db.select().from(buildings).where(eq(buildings.id, entry.buildingId1));
      const [building2] = await this.db.select().from(buildings).where(eq(buildings.id, entry.buildingId2));

      if (!building1 || !building2) continue;

      const stats1 = await this.getBuildingStats(entry.buildingId1);
      const stats2 = await this.getBuildingStats(entry.buildingId2);

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
    const [{ total }] = await this.db.select({ total: count() }).from(duplicateQueue).where(eq(duplicateQueue.status, "pending"));
    return total;
  }

  async getDuplicatePair(id: string): Promise<DuplicatePairWithBuildings | undefined> {
    const [entry] = await this.db.select().from(duplicateQueue).where(eq(duplicateQueue.id, id));
    if (!entry) return undefined;

    const [building1] = await this.db.select().from(buildings).where(eq(buildings.id, entry.buildingId1));
    const [building2] = await this.db.select().from(buildings).where(eq(buildings.id, entry.buildingId2));

    if (!building1 || !building2) return undefined;

    const stats1 = await this.getBuildingStats(entry.buildingId1);
    const stats2 = await this.getBuildingStats(entry.buildingId2);

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
    await this.db.update(duplicateQueue).set({ status }).where(eq(duplicateQueue.id, id));
  }

  async mergeBuildings(masterId: string, secondaryId: string, adminId: string): Promise<void> {
    const [masterBuilding] = await this.db.select().from(buildings).where(eq(buildings.id, masterId));
    const [secondaryBuilding] = await this.db.select().from(buildings).where(eq(buildings.id, secondaryId));

    if (!masterBuilding || !secondaryBuilding) {
      throw new Error("Buildings not found");
    }

    const reviewsToTransfer = await this.db.select().from(reviews).where(eq(reviews.buildingId, secondaryId));

    await this.db.update(reviews).set({ buildingId: masterId }).where(eq(reviews.buildingId, secondaryId));
    await this.db.delete(buildings).where(eq(buildings.id, secondaryId));
    await this.db.delete(duplicateQueue).where(or(
      eq(duplicateQueue.buildingId1, secondaryId),
      eq(duplicateQueue.buildingId2, secondaryId)
    ));

    await this.createAuditLog("building_merge", adminId, {
      masterId,
      secondaryId,
      masterName: masterBuilding.name,
      secondaryName: secondaryBuilding.name,
      reviewsTransferred: reviewsToTransfer.length,
    });
  }

  async createAuditLog(actionType: string, userId: string | null, details: object): Promise<void> {
    await this.db.insert(auditLog).values({
      actionType,
      userId,
      details: JSON.stringify(details),
    });
  }
}
