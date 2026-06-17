import { createClient, ResultSet, InStatement } from "@libsql/client";

const url = process.env.TURSO_CONNECTION_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

const client = createClient({
  url,
  authToken,
});

/**
 * Turso client with automatic retry logic for connection timeouts.
 */
export const turso = {
  ...client,
  execute: async (stmt: InStatement, retries = 3): Promise<ResultSet> => {
    let lastError: any;
    for (let i = 0; i < retries; i++) {
      try {
        return await client.execute(stmt);
      } catch (error: any) {
        lastError = error;
        const isTimeout = 
          error?.message?.includes("timeout") || 
          error?.code === "UND_ERR_CONNECT_TIMEOUT" ||
          error?.cause?.code === "UND_ERR_CONNECT_TIMEOUT";
          
        if (isTimeout && i < retries - 1) {
          console.warn(`Turso connection timeout, retrying (${i + 1}/${retries})...`);
          // Wait a bit before retrying (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
          continue;
        }
        throw error;
      }
    }
    throw lastError;
  }
};
