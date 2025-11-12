import prisma from "../config/prisma";
import { permissions } from "../config/permissions";
import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { ForbiddenError } from "../utils/errors";
import { TeamRole, WorkspaceRole } from "@prisma/client";

export const checkAccess = (resource: string, action: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const userId = req.user!.id;

    let resourceData = null;
    let userRole: string | undefined;

    switch (resource) {
      case "workspace":
        const workspaceMembers = await prisma.membership.findMany({
          where: { workspaceId: req.params.workspaceId }
        });
        userRole = workspaceMembers.find(m => m.userId === userId)?.role;
        break;

      case "team":
        const teamMembers = await prisma.teamMember.findMany({
          where: { id: req.params.teamId },
        });
        userRole = teamMembers.find(m => m.userId === userId)?.role || (req as any).membership.role ;
;
        break;

      case "folder":
        resourceData = await prisma.folder.findFirst({
          where: { id: req.params.folderId },
          include: {
            workspace: { include: { memberships: true } },
            team: { include: { members: true } },
          },
        });
        const workspaceMember = resourceData?.workspace?.memberships.find(
          (m) => m.userId === userId
        );
        const teamMember = resourceData?.team?.members.find(
          (m) => m.userId === userId
        );
        userRole = teamMember?.role || workspaceMember?.role;
        // if(resourceData?.teamId && !teamMember) return res.status(403).json({ error: "Access denied" });
        break;

      case "file":
        resourceData = await prisma.file.findFirst({
          where: { id: req.params.fileId },
          include: {
            folder: {
              include: {
                team: { include: { members: true } },
                workspace: { include: { memberships: true } },
              },
            },
          },
        });
        const wm = resourceData?.folder?.workspace?.memberships.find(
          (m) => m.userId === userId
        );
        const tm = resourceData?.folder?.team?.members.find(
          (m) => m.userId === userId
        );
        // if(resourceData?.folder?.teamId && !tm) return res.status(403).json({ error: "Access denied" });
        userRole = tm?.role || wm?.role;
        break;

      default:
        return res.status(400).json({ error: "Invalid resource type" });
    }

    if (!userRole) {
      return res.status(403).json({ error: "Not a member of this resource" });
    }

    const allowedRoles = permissions[resource][action];
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: "Access denied" });
    }

    req.user!.role = userRole as WorkspaceRole | TeamRole;

    next();
  };
};
