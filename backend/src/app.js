import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: 'https://placementcell-seven.vercel.app',
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"))
// to perform crud operations on users server
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("Server running Perfectly");
});

// performing routing
import userRouter from "./routes/user.routes.js";
import batchRouter from "./routes/batch.routes.js";
import studentRouter from "./routes/student.routes.js";
import interviewRouter from "./routes/interview.routes.js";
import csvRouter from "./routes/csv.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/batch", batchRouter);
app.use("/api/v1/students", studentRouter);
app.use("/api/v1/interview", interviewRouter);
app.use("/api/v1/csv", csvRouter);

export default app;
