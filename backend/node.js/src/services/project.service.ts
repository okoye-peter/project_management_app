import prisma from "../libs/prisma.js";
import type { CreateProjectSchema } from "../zodSchemas/project.zod.schema.js";
import { Prisma } from "@prisma/client";

class ProjectService {
    static async getAllProjects(include?: Prisma.ProjectInclude) {
        return prisma.project.findMany({
            ...(include ? { include } : {}),
        });
    }

    static async getProjectById(projectId: number, include?: Prisma.ProjectInclude) {
        return prisma.project.findUnique({
            where: { id: projectId },
            ...(include ? { include } : {}),
        });
    }

    static async create(data: CreateProjectSchema, include?: Prisma.ProjectInclude) {
        return prisma.project.create({
            data,
            ...(include ? { include } : {}),
        });
    }
}

export default ProjectService;