"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireWorkspaceRole = exports.requireWorkspaceMember = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const requireWorkspaceMember = async (req, res, next) => {
    try {
        const workspaceId = req.params.workspaceId;
        const userId = req.user.id;
        const membership = await prisma_1.default.membership.findFirst({
            where: { workspaceId, userId }
        });
        if (!membership)
            throw new Error("Unidentified member");
        req.membership = membership;
        next();
    }
    catch (error) {
        throw error;
    }
};
exports.requireWorkspaceMember = requireWorkspaceMember;
const requireWorkspaceRole = (allowed) => (req, res, next) => {
    const membership = req.membership;
    if (!membership)
        return res.status(500).json({ error: "Membership context missing" });
    if (!allowed.includes(membership.role))
        return res.status(403).json({ error: "Insufficient role" });
    console.log("role checked for user", req.user.id);
    next();
};
exports.requireWorkspaceRole = requireWorkspaceRole;
