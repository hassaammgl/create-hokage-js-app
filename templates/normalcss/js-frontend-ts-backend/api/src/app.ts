import express from "express";
import type { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";

import { errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);
app.use(morgan("combined"));

// Health check
app.get("/", (_req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: "Hello World",
	});
});

// Routes
app.use("/api/auth", authRoutes);

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req: Request, res: Response, _next: NextFunction) => {
	res.status(404).json({
		success: false,
		message: "Route not found",
	});
});

export default app;
