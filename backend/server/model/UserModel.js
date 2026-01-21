import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dob: { type: Date },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Role based for CRM
    role: {
      type: String,
      enum: ["admin", "staff"],
      required: true,
    },

    employeeId: { type: String, unique: true },
    branch: { type: String },
    profileImageUrl: { type: String, default: "" },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    joiningDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
