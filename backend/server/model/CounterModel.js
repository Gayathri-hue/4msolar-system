import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  seq: { type: Number, default: 0 },
});

export default mongoose.model("counter", CounterSchema);
