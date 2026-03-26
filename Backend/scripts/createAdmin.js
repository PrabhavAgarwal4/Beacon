import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import { pool } from "../src/config/postgres.js";

const createAdmin = async () => {
  try{
    const password = await bcrypt.hash("admin123", 10);
    
    const existing = await pool.query(
        "SELECT * FROM users WHERE email=$1",
        ["admin@gmail.com"]
    );

    if (existing.rows.length>0) {
       console.log("Admin already exists");
       process.exit(0);
    }

    await pool.query(
      `INSERT INTO users (name, email, password_hash, role, status, is_active)
       VALUES ($1,$2,$3,'ADMIN','APPROVED',true)`,
      ["Admin", "admin@gmail.com", password]
    );

    console.log("Admin created");
    process.exit(0);

  } catch (err) {
    console.error("Error creating admin", err);
    process.exit(1);
  }
};

createAdmin();