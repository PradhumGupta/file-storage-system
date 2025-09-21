import express from "express";
import { configDotenv } from "dotenv";
import authRouter from "./routes/auth.route";
import morgan from "morgan";
import workspaceRouter from "./routes/workspace.route";
import filesRouter from "./routes/files.route";
configDotenv();

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("File Storage System is running!!");
});

app.use("/api/auth", authRouter);
app.use("/api/workspaces", workspaceRouter);
app.use("/api/workspaces/:workspaceId", filesRouter);

app.listen(port, () => {
    console.log("Server running on port " + port);
});