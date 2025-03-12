import app from "./server.js"
import mongoose from "mongoose";

// connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/artemis_db", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected...");
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });