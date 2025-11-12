import express from "express";
import { configDotenv } from "dotenv";
import authRouter from "./routes/auth.route";
import morgan from "morgan";
import workspaceRouter from "./routes/workspace.route";
import filesRouter from "./routes/files.route";
import teamRouter from "./routes/team.route";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/error-handler";


configDotenv();

const app = express();
const port = process.env.PORT || 8080;

const corsOptions = {
  origin: ['http://localhost:5173', process.env.CLIENT_URL!],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"));

app.use(errorHandler);

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("File Storage System is running!!");
});

app.use("/api/auth", authRouter);
app.use("/api/workspaces", workspaceRouter);
app.use("/api/workspaces/:workspaceId", filesRouter);
app.use("/api/workspaces/:workspaceId/team", teamRouter);

app.listen(port, () => {
    console.log("Server running on port " + port);
});