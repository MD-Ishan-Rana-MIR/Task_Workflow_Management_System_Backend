import express, { Request, Response } from "express";
import  cors from "cors" // causes overload issue

import morgan from "morgan";
import rateLimit from "express-rate-limit";
import authRouter from "./routes/auth.route";
import workFlowRoute from "./routes/workflow.routes";
import taskRoute from "./routes/task.route";
import projectRouter from "./routes/project.route";

const app = express();


const corsOptions: cors.CorsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}

app.use(cors(corsOptions))





app.use(express.json());

app.use(express.urlencoded({ extended: true }));





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

app.use("/api/v1/auth",authRouter);

// workflow route 

app.use("/api/v1",workFlowRoute);

// task router 

app.use("/api/v1",taskRoute);


// project route 

app.use("/api/v1",projectRouter);





export default app;
