import { pool } from "./postgres.js";

export const connectDB = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("Supabase connected");
  } catch (err) {
    console.error("Supabase connection failed", err);
    process.exit(1);
  }
};