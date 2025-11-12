"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
router.post("/register", auth_controller_1.AuthController.SignUp);
router.post("/sign-in", auth_controller_1.AuthController.Login);
router.post("/refresh", auth_controller_1.AuthController.refresh);
router.post("/sign-out", auth_middleware_1.authenticate, auth_controller_1.AuthController.logout);
router.post("/check-user", auth_controller_1.AuthController.isUserExists);
router.get("/profile", auth_middleware_1.authenticate, auth_controller_1.AuthController.profile);
exports.default = router;
