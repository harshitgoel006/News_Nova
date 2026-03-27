import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error.middleware.js";
import { authLimiter } from "./middlewares/authRateLimit.middleware.js";

// Routes
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import bookmarkRouter from "./routes/bookmark.routes.js";
import historyRouter from "./routes/history.routes.js";
import newsRouter from "./routes/news.routes.js";

const app = express();
app.set("trust proxy", 1);
app.use(helmet());

app.use(
  cors({
    origin:"http://localhost:5173",
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});



app.use("/api/v1/auth", authLimiter, authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/bookmarks", bookmarkRouter);
app.use("/api/v1/history", historyRouter);
app.use("/api/v1/news", newsRouter);



app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});


app.use(errorHandler);

export { app };