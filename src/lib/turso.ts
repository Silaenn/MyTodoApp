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
    let lastError: unknown;
    for (let i = 0; i < retries; i++) {
      try {
        return await client.execute(stmt);
      } catch (error: unknown) {
        lastError = error;
        const err = error as { message?: string; code?: string; cause?: { code?: string } } | null;
        const isTimeout = 
          err?.message?.includes("timeout") || 
          err?.code === "UND_ERR_CONNECT_TIMEOUT" ||
          err?.cause?.code === "UND_ERR_CONNECT_TIMEOUT";
          
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
