import express from "express";
import cors from "cors";
import "dotenv/config.js";
import cookieParser from "cookie-parser";

import authRoutes from "../src/routes/auth.routes.js";
import sapRoute from "../src/routes/sap.routes.js";
import otpRoute from "../src/routes/otp.routes.js";

const app = express();
const PORT = process.env.PORT || 5001;

//CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(cookieParser()); // Enables reading/clearing cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/sap", sapRoute);
app.use("/api/otp", otpRoute);

app.listen(PORT, async () => {
  console.log(`Server Connected ${PORT}`);
});
