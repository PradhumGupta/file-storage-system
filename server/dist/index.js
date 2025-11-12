"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const morgan_1 = __importDefault(require("morgan"));
const workspace_route_1 = __importDefault(require("./routes/workspace.route"));
const files_route_1 = __importDefault(require("./routes/files.route"));
const team_route_1 = __importDefault(require("./routes/team.route"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const error_handler_1 = require("./middleware/error-handler");
(0, dotenv_1.configDotenv)();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
const corsOptions = {
    origin: ['http://localhost:5173', process.env.CLIENT_URL],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(error_handler_1.errorHandler);
app.get("/", (req, res) => {
    res.send("File Storage System is running!!");
});
app.use("/api/auth", auth_route_1.default);
app.use("/api/workspaces", workspace_route_1.default);
app.use("/api/workspaces/:workspaceId", files_route_1.default);
app.use("/api/workspaces/:workspaceId/team", team_route_1.default);
app.listen(port, () => {
    console.log("Server running on port " + port);
});
