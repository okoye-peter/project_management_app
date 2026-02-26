import type { NextFunction, Request } from "express";
import { createProjectSchema } from "../zodSchemas/project.zod.schema.js";
import ProjectService from "../services/project.service.js";
import type { TypedResponse } from "../types/index.js";

export const getProjects = async (
    _req: Request,
    res: TypedResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const projects = await ProjectService.getAllProjects();
        if (!projects) {
            res.status(400).json({
                status: "error",
                message: "No projects found"
            });
            return;
        }
        res.status(200).json({
            status: "success",
            message: "Projects retrieved successfully",
            data: projects
        });
    } catch (error) {
        next(error);
    }
};

export const createProject = async (
    req: Request,
    res: TypedResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        console.log('req.body', req.body);

        const result = createProjectSchema.safeParse(req.body);
        if (!result.success) {
            res.status(400).json({
                status: "error",
                message: "Validation failed",
                data: result.error.flatten()
            });
            return;
        }

        const project = await ProjectService.create(result.data);

        if (!project) {
            res.status(400).json({
                status: "error",
                message: "Failed to create project"
            });
            return;
        }

        res.status(201).json({
            data: { project },
            status: "success",
            message: "Project created successfully"
        });
    } catch (error) {
        next(error);
    }
};

export const getProjectById = async (
    req: Request,
    res: TypedResponse,
    next: NextFunction,
): Promise<void> => {
    try {
        const { id } = req.params;
        const projectId = parseInt(id as string, 10);
        if (isNaN(projectId)) {
            res.status(400).json({
                status: "error",
                message: "Invalid project ID"
            });
            return;
        }

        const project = await ProjectService.getProjectById(projectId);

        if (!project) {
            res.status(404).json({
                status: "error",
                message: "Project not found",
            });
            return;
        }

        res.status(200).json({
            status: "success",
            message: "Project retrieved successfully",
            data: project
        });
    } catch (error) {
        next(error);
    }
};
