import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { FileController } from "../controllers/files.controller";
// import { upload } from "../middleware/multer.middleware";
import { requireWorkspaceMember, requireWorkspaceRole } from "../middleware/workspaceAuth.middleware";
import { WorkspaceRole } from "@prisma/client";
import { checkAccess } from "../middleware/check-access.middleware";
import multer from "multer";

const router = Router({ mergeParams: true });

const upload = multer({ storage: multer.memoryStorage() });

router.post("/files/upload", authenticate, requireWorkspaceMember, upload.single("file"), FileController.fileUpload);

router.get("/files/:fileId/download", authenticate, requireWorkspaceMember, FileController.fileDownload);

// router.get("/folders/:folderId/files", authenticate, requireWorkspaceMember, FileController.ListFiles); use showFolder instead

router.post("/folders", authenticate, requireWorkspaceMember, requireWorkspaceRole([WorkspaceRole.OWNER, WorkspaceRole.ADMIN]), FileController.createFolder);

router.get("/folders", authenticate, requireWorkspaceMember, requireWorkspaceRole([WorkspaceRole.OWNER, WorkspaceRole.ADMIN]), FileController.getFolders);

router.get("/folders/:folderId", authenticate, requireWorkspaceMember, FileController.showFolder);

router.get("/folders/:folderId/path", authenticate, requireWorkspaceMember, FileController.getPath);

export default router;

// POST /files/upload → upload file to folder.
// GET /files/:id/download → download file.
// POST /folders → create folder.
// GET /folders/:id → get folder details + contents.