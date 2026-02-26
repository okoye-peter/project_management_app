import prisma from "../libs/prisma.js";
import type { createTaskSchema, updateTaskStatusSchema } from "../zodSchemas/task.zod.schema.js";
import { z } from "zod";
import { Prisma } from "@prisma/client";

type CreateTaskInput = z.infer<typeof createTaskSchema>;
type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;

class TaskService {
    static async getTasksByProjectId(projectId: number, include?: Prisma.TaskInclude) {
        return prisma.task.findMany({
            where: { projectId },
            ...(include ? { include } : {}),
        });
    }

    static async createTask(projectId: number, data: CreateTaskInput, include?: Prisma.TaskInclude) {
        return prisma.task.create({
            data: {
                title: data.title,
                description: data.description,
                projectId,
                status: data.status ?? null,
                priority: data.priority ?? null,
                assignedUserId: data.assignedUserId ?? null,
                startDate: data.startDate ?? null,
                dueDate: data.dueDate ?? null,
            },
            ...(include ? { include } : {}),
        });
    }

    static async updateTaskStatus(projectId: number, taskId: number, data: UpdateTaskStatusInput, include?: Prisma.TaskInclude) {
        return prisma.task.update({
            where: { id: taskId, projectId },
            data: {
                status: data.status,
            },
            ...(include ? { include } : {}),
        });
    }
}

export default TaskService;
