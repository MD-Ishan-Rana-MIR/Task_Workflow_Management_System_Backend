import express, { Request, Response } from "express";
import cors from "cors";

import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRouter from "./routes/auth.route";

const app = express();





app.use(express.json());

app.use(express.urlencoded({ extended: true }));



app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);


app.use(morgan("dev"));

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)








app.get("/", async (_req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    msg: "Server is running successfully",
  });
});



// router 


// auth router 


app.use("/api/v1",authRouter);






export default app;
