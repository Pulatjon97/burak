import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app";

mongoose
  .connect(process.env.MONGODB_URL as string, {})
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
