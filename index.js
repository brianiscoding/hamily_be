import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import auth_route from "./routes/auth.js";
import cookieParser from "cookie-parser";
import students_route from "./routes/students.js";
import cors from "cors";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected!");
});

//middlewares
app.use(
  cors({
    origin: process.env.ORIGIN_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/auth", auth_route);
app.use("/students", students_route);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

const PORT = 8080;

app.listen(PORT, () => {
  connect();
  console.log(`🎉 Server listening at http://localhost:${PORT}/ 🎉`);
});
