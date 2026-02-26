
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Project, Task } from "@/types";
import { TaskStatus } from '@/types';

export type AppResponse<T = any> = {
    status: "success" | "error";
    message: string;
    data?: T;
    errors?: Record<string, string[] | undefined>;
};

export const api = createApi({
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    }),
    reducerPath: 'api',
    tagTypes: ["Projects", "Tasks"],
    endpoints: (build) => ({
        getProjects: build.query<AppResponse<Project[]>, void>({
            query: () => 'projects',
            providesTags: ["Projects"],
        }),
        createProject: build.mutation<AppResponse<Project>, Partial<Project>>({
            query: (project) => ({
                url: 'projects',
                method: 'POST',
                body: project,
            }),
            invalidatesTags: ["Projects"],
        }),
        getTasks: build.query<AppResponse<Task[]>, { projectId: number }>({
            query: ({ projectId }) => `projects/${projectId}/tasks`,
            providesTags: (result) => result?.data ? result.data.map(({ id }) => ({ type: "Tasks", id })) : ["Tasks"],
        }),
        createTask: build.mutation<AppResponse<Task>, { projectId: number, task: Task }>({
            query: ({ projectId, task }) => ({
                url: `projects/${projectId}/tasks`,
                method: "POST",
                body: task,
            }),
            invalidatesTags: ["Tasks"],
        }),
        updateTaskStatus: build.mutation<AppResponse<Task>, { projectId: number, taskId: number, status: TaskStatus }>({
            query: ({ projectId, taskId, status }) => ({
                url: `projects/${projectId}/tasks/${taskId}/status`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: (_result, _error, { taskId }) => [{ type: "Tasks", id: taskId.toString() }],
        })
    })
})

export const {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskStatusMutation
} = api;