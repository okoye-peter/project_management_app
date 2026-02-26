import type { Response } from "express";


export type AppResponse<T = any> = {
    status: "success" | "error";
    message: string;
    data?: T;
    errors?: Record<string, string[] | undefined>;
};


export interface TypedResponse<T = any> extends Response {
    json(body: AppResponse<T>): this;
}