import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { FileController } from "../controllers/files.controller";
import { upload } from "../middleware/multer.middleware";

const router = Router();

router.post("/workspaces/:id/files", authenticate, upload.single("file"), FileController.fileUpload);
router.post("/workspaces/:id/files", authenticate, FileController.ListFiles);
router.post("/folders", authenticate, FileController.ListFiles);
router.get("/folders/:id", authenticate, FileController.ListFiles);


// POST /files/upload → upload file to folder.
// GET /files/:id/download → download file.
// POST /folders → create folder.
// GET /folders/:id → get folder details + contents.