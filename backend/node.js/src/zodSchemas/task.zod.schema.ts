import { z } from "zod";
import { TaskPriority, TaskStatus } from "../enums/task.enum.js";

export const createTaskSchema = z.object({
    title: z.string().min(3).max(100),
    description: z.string().min(3).max(1000),
    status: z.nativeEnum(TaskStatus).nullish(),
    priority: z.nativeEnum(TaskPriority).nullish(),
    assignedUserId: z.preprocess((val) => val === "" ? null : val, z.coerce.number().nullish()),
    startDate: z.preprocess((val) => val === "" ? null : val, z.coerce.date().nullish()),
    dueDate: z.preprocess((val) => val === "" ? null : val, z.coerce.date().nullish()),
}).refine(
    (data) => {
        if (data.startDate && data.dueDate) {
            return data.dueDate >= data.startDate;
        }
        return true;
    },
    { message: "dueDate must be after startDate", path: ["dueDate"] }
);

export const updateTaskStatusSchema = z.object({
    status: z.nativeEnum(TaskStatus),
});