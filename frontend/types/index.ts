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

export interface User {
    id: number;
    cognitoId: string;
    username: string;
    firstName?: string;
    lastName?: string;
    profilePictureUrl?: string;
    isActive: boolean;
    teamId?: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    teamsAsProductOwner?: Team[];
    teamsAsProjectManager?: Team[];
    authoredTasks?: Task[];
    taskAssignments?: TaskAssignment[];
    attachments?: Attachment[];
    comments?: Comment[];
    assignedTasks: Task[];

}

export interface Project {
    id: number;
    name: string;
    description?: string;
    startDate?: string;
    dueDate?: string;
}

export interface Task {
    id: number;
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
    points?: number;
    assignedUserId?: number;
    startDate?: string;
    dueDate?: string;
    projectId?: number;
    authorUserId?: number;
    project?: Project;
    assignee?: User;
    author?: User;
    comments?: Comment[];
    attachments?: Attachment[];
    createdAt?: string;
    updatedAt?: string;
    status_text?: string;
    priority_text?: string;
    tags?: string[];
}

export interface Comment {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    assignedUserId: number;
    startDate: string;
    dueDate: string;
}

export interface Attachment {
    id: number;
    taskId: number;
    url: string;
    size?: number;
    name?: string;
    type?: string;
    uploadedByUserId?: number;
    createdAt?: string;
    updatedAt?: string;
    task?: Task;
    uploadedBy?: User;
}

export interface Team {
    id: number;
    name: string;
    productOwnerUserId?: number;
    projectManagerUserId?: number;
    createdAt: string;
    updatedAt: string;
    users?: User[];
    productOwner?: User;
    projectManager?: User;
    projectTeams?: ProjectTeam[];
}

export interface ProjectTeam {
    id: number;
    projectId: number;
    teamId: number;
    createdAt: string;
    updatedAt: string;
    project?: Project;
    team?: Team;
}

export interface Tag {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    tasks?: Task[];
}

export interface TaskTag {
    id: number;
    taskId: number;
    tagId: number;
    createdAt: string;
    updatedAt: string;
    task?: Task;
    tag?: Tag;
}

export interface TaskAssignment {
    id: number;
    taskId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
    task?: Task;
    user?: User;
}