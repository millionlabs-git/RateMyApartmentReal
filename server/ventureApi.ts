import type { Express } from "express";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq, and, gte, sql } from "drizzle-orm";

export function setupVentureApiRoutes(app: Express) {
  // VentureAPI endpoint - returns user metrics
  app.get('/api/ventureapi', async (req, res) => {
    try {
      // Verify API key
      const apiKey = req.headers['authorization']?.replace('Bearer ', '') || req.headers['x-api-key'];
      const ventureApiSecret = process.env.VentureAPI;

      // Temporary debug - remove after confirming
      console.log('VentureAPI env check:', ventureApiSecret ? 'SET (length: ' + ventureApiSecret.length + ')' : 'NOT SET');

      if (!ventureApiSecret) {
        console.error('VentureAPI: VentureAPI secret not configured in environment');
        return res.status(500).json({
          status: 'error',
          message: 'API key not configured'
        });
      }

      if (!apiKey || apiKey !== ventureApiSecret) {
        console.warn('VentureAPI: Unauthorized access attempt');
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized: Invalid API key'
        });
      }

      if (!db) {
        return res.status(500).json({
          status: 'error',
          message: 'Database not configured'
        });
      }

      // Calculate date 30 days ago for active user count
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // Get total user count (active status)
      const totalUsersResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(eq(users.status, 'active'));

      const totalUsers = totalUsersResult[0]?.count || 0;

      // Get active user count (users who logged in within last 30 days)
      const activeUsersResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(
          and(
            eq(users.status, 'active'),
            gte(users.lastLoginAt, thirtyDaysAgo)
          )
        );

      const activeUsers = activeUsersResult[0]?.count || 0;

      // Get leads count (suspended users)
      const leadsResult = await db
        .select({ count: sql<number>`count(*)::int` })
        .from(users)
        .where(eq(users.status, 'suspended'));

      const leads = leadsResult[0]?.count || 0;

      return res.json({
        status: "success",
        response: {
          users: totalUsers,
          activeusers: activeUsers,
          leads: leads
        }
      });
    } catch (error: any) {
      console.error("VentureAPI error:", error);
      return res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : "Failed to fetch user metrics"
      });
    }
  });
}
