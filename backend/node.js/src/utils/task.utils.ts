import { getTaskStatusLabel, getTaskPriorityLabel } from "../enums/task.enum.js";

/**
 * Enriches a raw task object from Prisma with human-readable
 * `status_text` and `priority_text` fields derived from the numeric values.
 */
export function transformTask<T extends { status: number | null; priority: number | null }>(task: T) {
    return {
        ...task,
        status_text: task.status !== null ? getTaskStatusLabel(task.status) : null,
        priority_text: task.priority !== null ? getTaskPriorityLabel(task.priority) : null,
    };
}
