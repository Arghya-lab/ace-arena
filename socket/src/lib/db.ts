import mongoose from "mongoose";

export default async function connectToMongo() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/aceArena");
    // await mongoose.connect(process.env.MONGO_URI!);
    console.log("Successfully connected to mongoose.");
  } catch (err) {
    console.log("Error occur while connecting to mongoose.");
    process.exit(1);
  }
}
