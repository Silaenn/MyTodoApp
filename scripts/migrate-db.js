const { createClient } = require("@libsql/client");
require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log("Migrating Turso Database...");
  try {
    // Add user_id column if it doesn't exist
    // SQLite/LibSQL doesn't support ADD COLUMN IF NOT EXISTS easily without checking table info
    const tableInfo = await client.execute("PRAGMA table_info(tasks)");
    const columns = tableInfo.rows.map(row => row.name);

    if (!columns.includes("user_id")) {
      console.log("Adding 'user_id' column to 'tasks' table...");
      await client.execute("ALTER TABLE tasks ADD COLUMN user_id TEXT");
    } else {
      console.log("'user_id' column already exists.");
    }

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    process.exit();
  }
}

migrate();
