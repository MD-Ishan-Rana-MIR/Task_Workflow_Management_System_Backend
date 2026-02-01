import mongoose from "mongoose";
import { config } from "./config";

export const connectDB = async () => {
    const dbUrl = config.db_url;

  try {
    await mongoose.connect(dbUrl);
    console.log("----------------MongoDB Connected-----------------");
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
