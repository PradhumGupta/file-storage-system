import { Router } from "express";
import TeamController from "../controllers/team.controller";

const router = Router();

router.post('/', TeamController.createTeam);
router.get('/:teamId', TeamController.getMembers)
router.post('/:teamId/add', TeamController.createMember);
router.put('/:teamId/folder', TeamController.assignFolder);
router.post('/:teamId/folder', TeamController.createFolder);
router.get('/:teamId/folders', TeamController.getFolders);

export default router;