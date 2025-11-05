import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/register", AuthController.SignUp);
router.post("/sign-in", AuthController.Login);
router.post("/refresh", AuthController.refresh);
router.post("/sign-out", authenticate, AuthController.logout);
router.post("/check-user", AuthController.isUserExists);
router.get("/profile", authenticate, AuthController.profile);
export default router;