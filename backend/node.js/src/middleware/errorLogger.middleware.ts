import type { Request, Response, NextFunction } from "express";
import { LoggerService } from "../services/logger.service.js";

export const errorLogger = (
    err: any,
    req: Request,
    res: Response,
    _next: NextFunction,
) => {
    const meta = {
        method: req.method,
        url: req.url,
        body: req.body,
        query: req.query,
        params: req.params,
        stack: err.stack,
    };

    LoggerService.error(err.message, meta);

    const status = err.status || err.statusCode;
    if(status){
        const message =
            status === 500
                ? "Server Error"
                : "Oops!! something went wrong, please try again later";
    
        res.status(status).json({
            message,
            status: "error",
        });
    }
};
