import express from "express";
import { configDotenv } from "dotenv";
import connectDb from "./config/db";
import authRouter from "./routes/auth.route";

configDotenv();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

connectDb();

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("File Storage System is running!!");
});

app.use("/api/auth", authRouter);

app.listen(port, () => {
    console.log("Server running on port " + port);
});