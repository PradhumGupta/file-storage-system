import { Router } from "express";
import TeamController from "../controllers/team.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireWorkspaceMember } from "../middleware/workspaceAuth.middleware";
import { checkAccess } from "../middleware/check-access.middleware";

const router = Router({ mergeParams: true });

router.use(authenticate);
router.use(requireWorkspaceMember)


router.post('/', checkAccess("workspace", "manage"), TeamController.createTeam);
router.get('/', TeamController.getTeams);
router.get('/:teamId', checkAccess("team", "view"), TeamController.getMembers);
router.post('/:teamId/add', checkAccess("team", "manage"), TeamController.createMember);
router.put('/:teamId/folder', checkAccess("team", "manage"), TeamController.assignFolder);
router.post('/:teamId/folder', checkAccess("team", "manage"), TeamController.createFolder);
router.get('/:teamId/folders', checkAccess("team", "manage"), TeamController.getFolders);

export default router;