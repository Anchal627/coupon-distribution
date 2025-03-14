import mongoose from "mongoose";

const claimSchema = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Coupon",
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  browserId: {
    type: String,
    required: true,
  },
  claimedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Claim = mongoose.model("Claim", claimSchema);
