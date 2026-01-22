import mongoose from "mongoose";

const enquirySchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String },
    address: { type: String },

    enquiryType: {
      type: String,
      enum: [
        "New Solar Installation",
        "Solar Repair / Service",
        "Rooftop Inspection",
        "Battery / Inverter Issue",
      ],
      required: true,
    },

    systemType: {
      type: String,
      enum: ["On-Grid", "Off-Grid", "Hybrid"],
    },

    capacity: { type: String }, // 1KW, 3KW, 5KW, 10KW
    monthlyEBBill: { type: String },

    roofType: { type: String, enum: ["Concrete", "Sheet", "Tile"] },
    roofArea: { type: String },

    issueDescription: { type: String },
    image: { type: String }, // Cloudinary URL

    preferredTime: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening"],
    },

    message: { type: String },

    status: {
      type: String,
      enum: ["Assigned", "In Progress", "Completed"],
      default: "Assigned",
    },

    // -----------------------------
    // Applied Date/Time
    appliedDate: { type: Date, default: Date.now },

    // Referral Info
    // referral: {
    //   type: {
    //     type: String,
    //     enum: ["Facebook", "Instagram", "Twitter", "Person", "Other"],
    //     default: "Other",
    //   },
    //   name: { type: String, default: "" }, // Only required if type === "Person"
    // },
  },
  { timestamps: true },
);

export default mongoose.model("enquiryform", enquirySchema);
