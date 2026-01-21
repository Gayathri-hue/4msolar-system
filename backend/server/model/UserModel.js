import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    referrer: {
      type: String,
      enum: ["Instagram", "Facebook", "Twitter", "Youtube", "Other"],
      default: "Other",
    },
    referrerDetails: { type: String }, // store custom input here
  },
  { timestamps: true },
);

export default mongoose.model("user", UserSchema);
