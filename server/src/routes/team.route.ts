import { Router } from "express";
import TeamController from "../controllers/team.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router({ mergeParams: true });

router.use(authenticate);


router.post('/', TeamController.createTeam);
router.get('/', TeamController.getTeams);
router.get('/:teamId', TeamController.getMembers)
router.post('/:teamId/add', TeamController.createMember);
router.put('/:teamId/folder', TeamController.assignFolder);
router.post('/:teamId/folder', TeamController.createFolder);
router.get('/:teamId/folders', TeamController.getFolders);

export default router;