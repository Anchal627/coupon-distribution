import express from "express";
import { Coupon } from "../models/Coupon.js";
import { Claim } from "../models/Claim.js";
import mongoose from "mongoose";
const router = express.Router();

const seedCoupons = async () => {
  try {
    const count = await Coupon.countDocuments();
    if (count === 0) {
      await Coupon.insertMany([
        {
          code: "SUMMER25",
          description: "Summer Special Discount",
          discount: 25,
          isClaimed: false,
        },
        {
          code: "FLASH50",
          description: "Flash Sale Discount",
          discount: 50,
          isClaimed: false,
        },
        {
          code: "WELCOME15",
          description: "New Customer Discount",
          discount: 15,
          isClaimed: false,
        },
        {
          code: "SPECIAL30",
          description: "Special Offer Discount",
          discount: 30,
          isClaimed: false,
        },
        {
          code: "SAVE20",
          description: "Savings Festival Discount",
          discount: 20,
          isClaimed: false,
        },
      ]);
      console.log("✅ Default coupons added.");
    }
  } catch (error) {
    console.error("❌ Error seeding coupons:", error);
  }
};

// Get next available coupon
router.get("/next", async (req, res) => {
  console.log("GET /next route hit");
  try {
    await seedCoupons();
    const coupon = await Coupon.findOne({ isClaimed: false }).sort({
      createdAt: 1,
    });

    if (!coupon) {
      return res.status(404).json({ error: "No coupons available" });
    }

    res.json(coupon);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Claim a coupon
router.post("/:id", async (req, res) => {
  try {
    const { browserId } = req.body;
    const ipAddress = req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
    // Check if user has claimed within the last hour
    const recentClaim = await Claim.findOne({
      $or: [{ ipAddress }, { browserId }],
      claimedAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
    });

    if (recentClaim) {
      const timeLeft = Math.ceil(
        (recentClaim.claimedAt.getTime() + 60 * 60 * 1000 - Date.now()) /
          (60 * 1000)
      );
      return res.status(429).json({
        error: `Please wait ${timeLeft} minutes before claiming another coupon`,
      });
    }

    const coupon = await Coupon.findById(req.params.id);

    // console.log("Coupon ID:", coupon?._id);
    if (!coupon || coupon.isClaimed) {
      return res.status(400).json({ error: "Coupon not available" });
    }

    // Create claim and update coupon atomically
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const claim = await Claim.create({
        couponId: coupon._id,
        ipAddress,
        browserId,
      });
      console.log("Claim created successfully:", claim);

      // Step 2: Update the coupon to mark it as claimed
      const updatedCoupon = await Coupon.findOneAndUpdate(
        { _id: coupon._id, isClaimed: false }, // Ensure the coupon is not already claimed
        { $set: { isClaimed: true } },
        { new: true } // Return the updated document
      );

      if (!updatedCoupon) {
        throw new Error("Coupon not available or already claimed");
      }

      console.log("Coupon updated successfully:", updatedCoupon);

      res.json({
        message: "Coupon claimed successfully",
        coupon: updatedCoupon,
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export const couponRoutes = router;
