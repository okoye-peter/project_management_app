import type { Request, Response } from "express";
import { LoggerService } from "../services/logger.service.js";

export const getLogs = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query["page"] as string) || 1;
        const limit = parseInt(req.query["limit"] as string) || 50;
        const level = req.query["level"] as string | undefined;

        const result = await LoggerService.getLogs(page, limit, level);
        res.json(result);
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ message: "Failed to fetch logs" });
    }
};

export const getLog = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params["id"] as string);
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid log ID" });
            return;
        }

        const log = await LoggerService.getLog(id);
        if (!log) {
            res.status(404).json({ message: "Log not found" });
            return;
        }

        res.json(log);
    } catch (error) {
        console.error("Error fetching log:", error);
        res.status(500).json({ message: "Failed to fetch log" });
    }
};

export const clearLogs = async (
    _req: Request,
    res: Response,
): Promise<void> => {
    try {
        await LoggerService.clearLogs();
        res.json({ message: "Logs cleared successfully" });
    } catch (error) {
        console.error("Error clearing logs:", error);
        res.status(500).json({ message: "Failed to clear logs" });
    }
};
