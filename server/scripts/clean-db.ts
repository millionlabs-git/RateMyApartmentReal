import pg from "pg";

const { Pool } = pg;

const TABLE_NAMES = [
  "buildings",
  "reviews",
  "review_photos",
  "review_helpful_votes",
  "duplicate_queue",
  "users",
  "password_reset_tokens",
  "email_verification_tokens",
  "audit_log",
  "waitlist",
] as const;

async function getTableCounts(pool: pg.Pool): Promise<Record<string, number>> {
  const counts: Record<string, number> = {};
  for (const table of TABLE_NAMES) {
    const result = await pool.query(`SELECT COUNT(*) as count FROM ${table}`);
    counts[table] = parseInt(result.rows[0].count, 10);
  }
  // Also get non-admin user count
  const nonAdminResult = await pool.query(
    `SELECT COUNT(*) as count FROM users WHERE role != 'admin'`
  );
  counts["users (non-admin)"] = parseInt(nonAdminResult.rows[0].count, 10);
  const adminResult = await pool.query(
    `SELECT COUNT(*) as count FROM users WHERE role = 'admin'`
  );
  counts["users (admin)"] = parseInt(adminResult.rows[0].count, 10);
  return counts;
}

function printCounts(label: string, counts: Record<string, number>) {
  console.log(`\n=== ${label} ===`);
  for (const [table, count] of Object.entries(counts)) {
    console.log(`  ${table}: ${count}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const confirm = args.includes("--confirm");

  if (!dryRun && !confirm) {
    console.error(
      "Usage:\n" +
        "  npx tsx server/scripts/clean-db.ts --dry-run    Preview what will be deleted\n" +
        "  npx tsx server/scripts/clean-db.ts --confirm    Execute the cleanup"
    );
    process.exit(1);
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("ERROR: DATABASE_URL environment variable is not set.");
    process.exit(1);
  }

  const pool = new Pool({ connectionString: databaseUrl });

  try {
    const beforeCounts = await getTableCounts(pool);
    printCounts("BEFORE counts", beforeCounts);

    if (dryRun) {
      console.log("\n--- DRY RUN --- No changes were made.");
      console.log("\nThe following would be deleted:");
      console.log(`  buildings: ${beforeCounts["buildings"]} (cascades to reviews, review_photos, review_helpful_votes, duplicate_queue)`);
      console.log(`  users (non-admin): ${beforeCounts["users (non-admin)"]} (cascades to password_reset_tokens, email_verification_tokens)`);
      console.log(`\nThe following would be preserved:`);
      console.log(`  users (admin): ${beforeCounts["users (admin)"]}`);
      console.log(`  waitlist: ${beforeCounts["waitlist"]}`);
      console.log(`  audit_log: ${beforeCounts["audit_log"]} (user_id nullified for deleted users)`);
      return;
    }

    // --confirm: execute the cleanup inside a transaction
    console.log("\nExecuting cleanup...");
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Step 1: Delete all buildings (cascades to reviews, review_photos, review_helpful_votes, duplicate_queue)
      const buildingsResult = await client.query("DELETE FROM buildings");
      console.log(`  Deleted ${buildingsResult.rowCount} buildings (+ cascaded rows)`);

      // Step 2: Nullify audit_log.user_id for non-admin users (prevents FK violation)
      const auditResult = await client.query(
        `UPDATE audit_log SET user_id = NULL WHERE user_id IN (SELECT id FROM users WHERE role != 'admin')`
      );
      console.log(`  Nullified user_id in ${auditResult.rowCount} audit_log rows`);

      // Step 3: Delete all non-admin users (cascades to password_reset_tokens, email_verification_tokens)
      const usersResult = await client.query(
        `DELETE FROM users WHERE role != 'admin'`
      );
      console.log(`  Deleted ${usersResult.rowCount} non-admin users (+ cascaded tokens)`);

      await client.query("COMMIT");
      console.log("\nTransaction committed successfully.");
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("\nTransaction rolled back due to error:", err);
      process.exit(1);
    } finally {
      client.release();
    }

    const afterCounts = await getTableCounts(pool);
    printCounts("AFTER counts", afterCounts);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
