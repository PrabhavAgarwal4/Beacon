import pkg from "pg"
const { Pool } = pkg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

//test connection
pool.connect()
  .then(() => console.log("PostgreSQL connected "))
  .catch(err => console.error("DB connection error ", err))