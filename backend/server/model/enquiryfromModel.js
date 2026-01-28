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
        "New Solar Power Plan Installation",
        "Solar Power Plan Service",
        "Operation & Maintanence Service",
      ],
      required: true,
    },
    productType: {
      type: String,
      enum: [
        "Solar Panel",
        "Inverter",
        "DB Box",
        "Cable",
        "Module Mounting Structure",
        "Other",
      ],
    },

    systemType: {
      type: String,
      enum: ["On-Grid", "Off-Grid", "Hybrid"],
    },
    category: {
      type: String,
      enum: ["residential", "commercial", "industrial"],
    },

    capacity: { type: String }, // 1KW, 3KW, 5KW, 10KW
    ebServiceNo: { type: String },

    roofType: { type: String, enum: ["rcc", "Sheet"] },
    roofArea: { type: String },

    issueDescription: { type: String },
    image: { type: String },

    preferredTime: {
      type: String,
      enum: ["Morning", "Afternoon", "Evening"],
    },
    preferredDateTime: {
      type: Date,
    },

    message: { type: String },
    siteVisit: {
      type: Boolean, // true / false
      default: false,
    },

    siteVisitDateTime: {
      type: Date,
    },

    googleLocation: {
      type: String,
    },

    status: {
      type: String,
      enum: ["Assigned", "In Progress", "Completed"],
      default: "Assigned",
    },

    // -----------------------------
    // Applied Date/Time
    appliedDate: { type: Date, default: Date.now },

    assignedEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
    },

    dueDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

enquirySchema.pre("save", function (next) {
  if (this.capacity && !this.capacity.toUpperCase().includes("KW")) {
    this.capacity = `${this.capacity} KW`;
  }
  next();
});
export default mongoose.model("enquiryform", enquirySchema);
