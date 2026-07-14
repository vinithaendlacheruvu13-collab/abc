import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    supervisor: String,
    hourlyWage: Number,
    weeklyHours: String,
    skills: [String],
    compatibility: Number,
    days: String,
    shift: String,
    schedule: String,
    description: String,
    eligibility: String,
    status: { type: String, default: "Active" },
    applications: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
