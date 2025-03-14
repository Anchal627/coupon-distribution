import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import { couponRoutes } from "./routes/couponRoute.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/coupon";
// Middleware
const corsOptions = {
  origin: "http://localhost:3000", // Specify the allowed origin
  credentials: true, // Allow cookies and authentication headers
  methods: ["GET", "POST"],
};
app.use(cors(corsOptions));
app.use(express.json());
// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 1, // 1 request per IP
  message: { error: "Too many requests. Please try again in an hour." },
});

app.use("/api/coupons/claim", limiter, couponRoutes);
app.use("/api/coupons", couponRoutes);

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
