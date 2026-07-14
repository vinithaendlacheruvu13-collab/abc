import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true },
    studentName: { type: String, required: true },
    studentId: { type: String, required: true },
    department: String,
    skills: String,
    availableTimeSlots: String,
    status: { type: String, default: "Submitted" }
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
