import type { NextFunction, Request } from "express";
import type { TypedResponse } from "../types/index.js";
import { createTaskSchema, updateTaskStatusSchema } from "../zodSchemas/task.zod.schema.js";
import { LoggerService } from "../services/logger.service.js";
import { transformTask } from "../utils/task.utils.js";
import TaskService from "../services/task.service.js";
import { Prisma } from "@prisma/client";

const defaultTaskInclude: Prisma.TaskInclude = {
    project: true,
    assignee: true,
    author: true,
    comments: true,
    attachments: true,
};

export const getTasks = async (req: Request, res: TypedResponse, next: NextFunction) => {
    try {
        const projectId = parseInt(req.params["projectId"] as string, 10);
        if (isNaN(projectId)) {
            LoggerService.info("Invalid project ID");
            res.status(400).json({
                status: "success",
                message: "Invalid project ID",
                data: []
            });
            return;
        }

        const tasks = await TaskService.getTasksByProjectId(projectId, defaultTaskInclude);

        if (!tasks) {
            res.status(404).json({
                status: "error",
                message: "Task not found",
                data: []
            });
            return;
        }

        res.status(200).json({
            status: "success",
            message: "Task retrieved successfully",
            data: tasks.map(transformTask)
        });
    } catch (error) {
        next(error);
    }
}


export const createTask = async (req: Request, res: TypedResponse, next: NextFunction) => {
    try {
        const projectId = parseInt(req.params["projectId"] as string, 10);

        if (isNaN(projectId)) {
            LoggerService.info("Invalid project ID");
            res.status(400).json({
                status: "error",
                message: "Invalid project ID",
            });
            return;
        }

        const result = createTaskSchema.safeParse(req.body);
        if (!result.success) {
            LoggerService.info("Invalid task data");
            res.status(400).json({
                status: "error",
                message: "Invalid task data",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }

        const task = await TaskService.createTask(projectId, result.data, defaultTaskInclude);

        if (!task) {
            res.status(400).json({
                status: "error",
                message: "Error creating task",
            });
            return;
        }

        res.status(201).json({
            status: "success",
            message: "Task created successfully",
            data: { task: transformTask(task) }
        });
    } catch (error) {
        next(error);
    }
}

export const updateTaskStatus = async (req: Request, res: TypedResponse, next: NextFunction) => {
    try {
        const projectId = parseInt(req.params["projectId"] as string, 10);
        const taskId = parseInt(req.params["taskId"] as string, 10);

        if (isNaN(projectId)) {
            res.status(400).json({
                status: "error",
                message: "Invalid project ID",
            });
            return;
        }

        if (isNaN(taskId)) {
            res.status(400).json({
                status: "error",
                message: "Invalid task ID",
            });
            return;
        }

        const result = updateTaskStatusSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                status: "error",
                message: "Invalid task status",
                errors: result.error.flatten().fieldErrors,
            });
            return;
        }

        const task = await TaskService.updateTaskStatus(projectId, taskId, result.data, defaultTaskInclude);

        if (!task) {
            res.status(400).json({
                status: "error",
                message: "Error updating task",
            });
            return;
        }

        res.status(200).json({
            status: "success",
            message: "Task updated successfully",
            data: { task: transformTask(task) }
        });
    } catch (error) {
        next(error);
    }
}