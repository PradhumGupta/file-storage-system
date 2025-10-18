import { Router } from "express";
import { WorkspaceController } from "../controllers/workspace.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireWorkspaceMember, requireWorkspaceRole } from "../middleware/workspaceAuth.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.use(authenticate);

router.get("/", WorkspaceController.getUserWorkspaces);

router.post("/", WorkspaceController.createOrg);

router.get("/:workspaceId/list", requireWorkspaceMember, WorkspaceController.fetchWorkspace);

router.post("/:workspaceId/invite", requireWorkspaceMember, requireWorkspaceRole([Role.OWNER, Role.ADMIN]), WorkspaceController.invite);

router.delete("/:workspaceId/remove", requireWorkspaceMember, requireWorkspaceRole([Role.OWNER, Role.ADMIN]), WorkspaceController.remove);

export default router;