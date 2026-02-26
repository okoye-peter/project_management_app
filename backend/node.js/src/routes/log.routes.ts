import { Router } from "express";
import { getLogs, getLog, clearLogs } from "../controllers/log.controller.js";

const router = Router();

router.get("/", getLogs);
router.get("/:id", getLog);
router.delete("/", clearLogs);

export default router;
