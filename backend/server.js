import dotenv from "dotenv";
dotenv.config(); // ← this must stay at the very top

// Add this block right here
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ← optional debug (remove later)
console.log(
  "Cloudinary configured → cloud_name:",
  process.env.CLOUDINARY_CLOUD_NAME,
);
console.log("API key exists →", !!process.env.CLOUDINARY_API_KEY);
import mongoose from "mongoose";
import app from "./app.js";

const database = process.env.DATABASE;
const port = process.env.PORT || 8000;

mongoose
  .connect(database)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
