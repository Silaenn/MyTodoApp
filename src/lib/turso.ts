import { createClient } from "@libsql/client";

const url = process.env.TURSO_CONNECTION_URL!;
const authToken = process.env.TURSO_AUTH_TOKEN!;

export const turso = createClient({
  url,
  authToken,
});
