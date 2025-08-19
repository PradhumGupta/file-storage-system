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
            const {workspaceId} = req.params;
            const userId = req.user?.id;

            workspaceIdCheck.parse({workspaceId});

            const file = await fileServices.addFile(req.file as Express.Multer.File, workspaceId, userId as string);

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
}