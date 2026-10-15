import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";

// NEW: read the connection string once, from the variable name used in .env.
// If .env is missing or the name is wrong, stop with a clear message instead of
// the confusing 'The `uri` parameter to openUri() must be a string, got "undefined"'.
const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
  console.error(
    "MONGODB_URL is missing. Create a .env file in the project root (next to package.json) with: MONGODB_URL=your_connection_string",
  );
  process.exit(1);
}

// NEW: silences the Mongoose "strictQuery" deprecation warning.
mongoose.set("strictQuery", true);

mongoose
  // OLD: .connect(process.env.MONGODB_URL as string, {})
  .connect(MONGODB_URL, {})
  .then((data) => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT ?? 3003;
    app.listen(PORT, function () {
      console.info(`The server is running succesfully on port ${PORT}`);
      console.info(`Admin project on http://localhost:${PORT}/admin`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });