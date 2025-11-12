import prisma from "../config/prisma";
export const requireWorkspaceMember = async (req, res, next) => {
    try {
        const workspaceId = req.params.workspaceId;
        const userId = req.user.id;
        const membership = await prisma.membership.findFirst({
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
export const requireWorkspaceRole = (allowed) => (req, res, next) => {
    const membership = req.membership;
    if (!membership)
        return res.status(500).json({ error: "Membership context missing" });
    if (!allowed.includes(membership.role))
        return res.status(403).json({ error: "Insufficient role" });
    console.log("role checked for user", req.user.id);
    next();
};
