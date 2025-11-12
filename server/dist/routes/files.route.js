"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const files_controller_1 = require("../controllers/files.controller");
// import { upload } from "../middleware/multer.middleware";
const workspaceAuth_middleware_1 = require("../middleware/workspaceAuth.middleware");
const client_1 = require("@prisma/client");
const check_access_middleware_1 = require("../middleware/check-access.middleware");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)({ mergeParams: true });
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post("/files/upload", auth_middleware_1.authenticate, workspaceAuth_middleware_1.requireWorkspaceMember, upload.single("file"), files_controller_1.FileController.fileUpload);
router.get("/files/:fileId/download", auth_middleware_1.authenticate, workspaceAuth_middleware_1.requireWorkspaceMember, files_controller_1.FileController.fileDownload);
// router.get("/folders/:folderId/files", authenticate, requireWorkspaceMember, FileController.ListFiles); use showFolder instead
router.post("/folders", auth_middleware_1.authenticate, workspaceAuth_middleware_1.requireWorkspaceMember, (0, check_access_middleware_1.checkAccess)("folder", "create"), files_controller_1.FileController.createFolder);
router.get("/folders", auth_middleware_1.authenticate, workspaceAuth_middleware_1.requireWorkspaceMember, (0, workspaceAuth_middleware_1.requireWorkspaceRole)([client_1.WorkspaceRole.OWNER, client_1.WorkspaceRole.ADMIN]), files_controller_1.FileController.getFolders);
router.get("/folders/:folderId", auth_middleware_1.authenticate, workspaceAuth_middleware_1.requireWorkspaceMember, (0, check_access_middleware_1.checkAccess)("folder", "view"), files_controller_1.FileController.showFolder);
router.get("/folders/:folderId/path", auth_middleware_1.authenticate, workspaceAuth_middleware_1.requireWorkspaceMember, files_controller_1.FileController.getPath);
exports.default = router;
// POST /files/upload → upload file to folder.
// GET /files/:id/download → download file.
// POST /folders → create folder.
// GET /folders/:id → get folder details + contents.
