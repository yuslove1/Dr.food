import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";

import { authRouter } from "./modules/auth/auth.routes";
import { usersRouter } from "./modules/users/users.routes";
import { nutritionRouter } from "./modules/nutrition/nutrition.routes";
import { bankRouter } from "./modules/bank/bank.routes";
import { dietitiansRouter } from "./modules/dietitians/dietitians.routes";
import { feedRouter } from "./modules/feed/feed.routes";
import { vendorsRouter } from "./modules/vendors/vendors.routes";
import { paymentsRouter } from "./modules/payments/payments.routes";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan(env.NODE_ENV === "development" ? "dev" : "combined"));

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/nutrition", nutritionRouter);
app.use("/bank", bankRouter);
app.use("/dietitians", dietitiansRouter);
app.use("/feed", feedRouter);
app.use("/vendors", vendorsRouter);
app.use("/payments", paymentsRouter);

app.use(notFoundHandler);
app.use(errorHandler);
