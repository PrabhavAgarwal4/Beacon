import { app } from "./app.js";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running at PORT:${process.env.PORT}`);
  });
});