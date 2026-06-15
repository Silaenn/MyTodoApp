const { createClient } = require("@libsql/client");
require("dotenv").config({ path: ".env.local" });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function migrate() {
  console.log("Migrating Turso Database...");
  try {
    const tableInfo = await client.execute("PRAGMA table_info(tasks)");
    const columns = tableInfo.rows.map(row => row.name);

    if (!columns.includes("user_email")) {
      console.log("Adding 'user_email' column to 'tasks' table...");
      await client.execute("ALTER TABLE tasks ADD COLUMN user_email TEXT");
    } else {
      console.log("'user_email' column already exists.");
    }

    if (columns.includes("user_id")) {
      console.log("Dropping redundant 'user_id' column...");
      await client.execute("ALTER TABLE tasks DROP COLUMN user_id");
    }

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    process.exit();
  }
}

migrate();
