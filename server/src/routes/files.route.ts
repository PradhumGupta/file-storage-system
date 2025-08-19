import { Router } from "express";
import multer from "multer";
import { authenticate } from "../middleware/auth.middleware";
import { FileController } from "../controllers/files.controller";

const router = Router();

const upload = multer({ dest: "uploads/" });

router.post("/workspaces/:id/files", authenticate, upload.single("file"), FileController.fileUpload);
router.post("/workspaces/:id/files", authenticate, FileController.ListFiles);