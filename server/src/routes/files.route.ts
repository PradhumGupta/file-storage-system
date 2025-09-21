import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { FileController } from "../controllers/files.controller";
import { upload } from "../middleware/multer.middleware";
import { requireWorkspaceMember, requireWorkspaceRole } from "../middleware/workspaceAuth.middleware";
import { Role } from "@prisma/client";

const router = Router({ mergeParams: true });

router.post("/files/upload", authenticate, requireWorkspaceMember, requireWorkspaceRole([Role.ADMIN, Role.MEMBER, Role.OWNER]), upload.single("file"), FileController.fileUpload);
router.get("/files/:fileId/download", authenticate, requireWorkspaceMember, FileController.fileDownload);
router.get("/folders/:folderId/files", authenticate, requireWorkspaceMember, FileController.ListFiles);
router.post("/folders", authenticate, requireWorkspaceMember, requireWorkspaceRole([Role.OWNER, Role.ADMIN]), FileController.createFolder);
router.get("/folders/:id", authenticate, requireWorkspaceMember, FileController.showFolder);

export default router;

// POST /files/upload → upload file to folder.
// GET /files/:id/download → download file.
// POST /folders → create folder.
// GET /folders/:id → get folder details + contents.