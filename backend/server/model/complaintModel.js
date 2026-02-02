import mongoose from "mongoose";

const serviceRequestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    complaintType: {
      type: String,
      enum: ["installation", "maintenance", "power", "billing", "other"],
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("request", serviceRequestSchema);
