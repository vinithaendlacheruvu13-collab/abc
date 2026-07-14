import mongoose from "mongoose";

export async function connectDatabase() {
  if (!process.env.MONGO_URI) {
    console.log("MONGO_URI not set. Running with in-memory prototype data.");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected.");
  } catch (error) {
    console.log("MongoDB connection skipped:", error.message);
  }
}
