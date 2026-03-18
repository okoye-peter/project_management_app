import { z } from "zod";

export const createProjectSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().nullable(),
    startDate: z.coerce.date().nullable(),
    dueDate: z.coerce.date().nullable(),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
