import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { FileServices } from "../services/files.service";
import z from "zod";

const workspaceIdCheck = z.object({
    workspaceId: z.string().min(8, "WorkspaceId is required")
})

const fileServices = new FileServices();

export class FileController {
    public static fileUpload = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const {workspaceId, folderId} = req.params;
            const userId = req.user?.id;

            workspaceIdCheck.parse({workspaceId});

            if(!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            const file = await fileServices.addFile(req.file as Express.Multer.File, workspaceId, folderId, userId as string);

            res.json({ message: "File uploaded", file })
        } catch (error: any) {
            console.error("Error in file upload", error);
            res.json({ message: "file upload failed", error: error.message ?? "Server Error" });
        }
    }

    public static ListFiles = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const {workspaceId} = req.params;
            const userId = req.user?.id;

            workspaceIdCheck.parse({workspaceId});

            const files = await fileServices.getFiles(workspaceId);

            res.json(files);
        } catch (error: any) {
            console.error("Error in fetching files", error);
            res.json({ message: "failed to fetch files", error: error.message ?? "Server Error" });
        }
    }

    public static fileDownload = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { workspaceId, fileId } = req.params;
            const userId = req.user?.id;

            workspaceIdCheck.parse({workspaceId});

            const file = await fileServices.searchFileToDownload(fileId);
            res.download(file.filePath, file.filename)
            res.json({ message: "File downloaded", file })
        } catch (error: any) {
            console.error("Error in file download", error);
            res.json({ message: "file download failed", error: error.message ?? "Server Error" });
        }
    }

    public static createFolder = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { workspaceId } = req.params;
            const { name, parentId } = req.body;

            const newFolder = await fileServices.createNewFolder(name, parentId, req.user?.id as string, workspaceId);

            res.json(newFolder);
        } catch (error: any) {
            console.error("Error in creating folder", error);
            res.json({ message: "failed to create folder", error: error.message ?? "Server Error" });
        }
    }
}