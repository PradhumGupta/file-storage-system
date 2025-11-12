"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileController = void 0;
const files_service_1 = require("../services/files.service");
const zod_1 = __importDefault(require("zod"));
const workspaceIdCheck = zod_1.default.object({
    workspaceId: zod_1.default.string().min(8, "WorkspaceId is required")
});
const folderIdCheck = zod_1.default.object({
    folderId: zod_1.default.string().min(8, "folderId is required")
});
const fileServices = new files_service_1.FileServices();
class FileController {
    static fileUpload = async (req, res, next) => {
        try {
            const { workspaceId } = req.params;
            const userId = req.user?.id;
            const { folderId } = req.body;
            workspaceIdCheck.parse({ workspaceId });
            if (folderId)
                folderIdCheck.parse({ folderId });
            if (!req.file) {
                console.log("No file upoloaded");
                return res.status(400).json({ message: "No file uploaded" });
            }
            const file = await fileServices.addFile(req.file, workspaceId, folderId, userId);
            res.status(201).json({ status: "success", message: "File uploaded", file });
        }
        catch (error) {
            console.error("Error in file upload", error);
            res.json({ message: "file upload failed", error: error.message ?? "Server Error" });
        }
    };
    static ListFiles = async (req, res, next) => {
        try {
            const { workspaceId, folderId } = req.params;
            const userId = req.user?.id;
            workspaceIdCheck.parse({ workspaceId });
            folderIdCheck.parse({ folderId });
            const files = await fileServices.getFiles(workspaceId, folderId);
            res.json(files);
        }
        catch (error) {
            console.error("Error in fetching files", error);
            res.json({ message: "failed to fetch files", error: error.message ?? "Server Error" });
        }
    };
    static fileDownload = async (req, res, next) => {
        try {
            const { workspaceId, fileId } = req.params;
            const { folderId } = req.query;
            const userId = req.user.id;
            const parsed = workspaceIdCheck.parse({ workspaceId });
            const { buffer, contentType, fileName } = await fileServices.searchFileToDownload(workspaceId, folderId, fileId);
            // const originalFileName = (function getOriginalFilename(fileName) {
            //   const parts = fileName?.split("_");
            //   const originalNameParts = parts?.slice(1);
            //   return originalNameParts?.join("_");
            // })(fileName);
            // console.log(originalFileName, contentType)
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
            res.send(buffer);
        }
        catch (error) {
            console.error("Error in file download", error);
            res.json({ message: "file download failed", error: error.message ?? "Server Error" });
        }
    };
    static createFolder = async (req, res, next) => {
        try {
            const { workspaceId } = req.params;
            const { name, parentId } = req.body;
            workspaceIdCheck.parse({ workspaceId });
            const newFolder = await fileServices.createNewFolder(name, parentId, req.user?.id, workspaceId);
            res.json({ folder: newFolder });
        }
        catch (error) {
            console.error("Error in creating folder", error);
            res.json({ message: "failed to create folder", error: error.message ?? "Server Error" });
        }
    };
    static deleteFolder = async (req, res, next) => {
        try {
            const { workspaceId, folderId } = req.params;
            await fileServices.deleteFolder(folderId, workspaceId);
            res.json({ message: "Folder deleted successfully" });
        }
        catch (error) {
            console.error("Error in deleting folder", error);
            next(error);
        }
    };
    static showFolder = async (req, res) => {
        try {
            const { folderId, workspaceId } = req.params;
            const folderDetails = await fileServices.listFolder(folderId, workspaceId);
            res.json({ message: "Fetched folder successfully", folder: folderDetails });
        }
        catch (error) {
            console.error("Error in show folder controller", error);
            res.json({ message: "failed to show folder", error: error.message ?? "Server Error" });
        }
    };
    static getPath = async (req, res) => {
        try {
            const { folderId, workspaceId } = req.params;
            const folderPath = await fileServices.getFolderPath(folderId, workspaceId);
            res.json({ message: "Fetched folder path successfully", path: folderPath });
        }
        catch (error) {
            console.error("Error in getPath controller", error);
            res.json({ message: "failed to getting path of folder", error: error.message ?? "Server Error" });
        }
    };
    static getFolders = async (req, res) => {
        try {
            const { workspaceId } = req.params;
            const folders = await fileServices.getPublicFolders(workspaceId);
            res.json({ message: "Fetched folder path successfully", folders });
        }
        catch (error) {
            console.log("Error in getPath controller", error.message);
            throw error;
        }
    };
}
exports.FileController = FileController;
