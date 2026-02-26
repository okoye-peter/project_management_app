export enum TaskStatus {
    TODO = 0,
    IN_PROGRESS = 1,
    IN_REVIEW = 2,
    BLOCKED = 3,
    DONE = 4,
    CANCELLED = 5,
}

export enum TaskPriority {
    LOW = 0,
    MEDIUM = 1,
    HIGH = 2,
    URGENT = 3,
}

export const getTaskStatusLabel = (status: number): string => {
    switch (status) {
        case TaskStatus.TODO:
            return "TODO";
        case TaskStatus.IN_PROGRESS:
            return "IN_PROGRESS";
        case TaskStatus.IN_REVIEW:
            return "IN_REVIEW";
        case TaskStatus.BLOCKED:
            return "BLOCKED";
        case TaskStatus.DONE:
            return "DONE";
        case TaskStatus.CANCELLED:
            return "CANCELLED";
        default:
            return "UNKNOWN";
    }
};

export const getTaskPriorityLabel = (priority: number): string => {
    switch (priority) {
        case TaskPriority.LOW:
            return "LOW";
        case TaskPriority.MEDIUM:
            return "MEDIUM";
        case TaskPriority.HIGH:
            return "HIGH";
        case TaskPriority.URGENT:
            return "URGENT";
        default:
            return "UNKNOWN";
    }
};
