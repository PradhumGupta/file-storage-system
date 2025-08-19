import { Router } from "express";
import { WorkspaceController } from "../controllers/workspace.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", WorkspaceController.getUserWorkspaces);

export default router;