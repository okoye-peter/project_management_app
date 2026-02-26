import winston from "winston";
import fs from "fs";
import path from "path";
import readline from "readline";

const logDir = "logs";
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const errorLogPath = path.join(logDir, "error.log");
const combinedLogPath = path.join(logDir, "combined.log");

// Create Winston Logger instance
const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            ),
        }),
        new winston.transports.File({ filename: errorLogPath, level: "error" }),
        new winston.transports.File({ filename: combinedLogPath }),
    ],
});

export class LoggerService {
    // Wrapper methods to maintain compatibility and ease of use
    static info(message: string, meta?: any) {
        logger.info(message, meta);
    }

    static error(message: string, meta?: any) {
        logger.error(message, meta);
    }

    static warn(message: string, meta?: any) {
        logger.warn(message, meta);
    }

    static debug(message: string, meta?: any) {
        logger.debug(message, meta);
    }

    static async getLogs(page = 1, limit = 50, level?: string) {
        const logs: any[] = [];
        const fileStream = fs.createReadStream(combinedLogPath);

        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        const targetLevel = level ? level.toUpperCase() : null;

        // Reverse reading would be better for "latest first", but for simple implementation
        // we'll read all and reverse, or just read all. 
        // Reading all into memory might be bad for huge files, but for now it's a start.
        // Optimization: read file from end. But that's complex.
        // Let's read all, filter, and then paginate.

        for await (const line of rl) {
            try {
                if (!line) continue;
                const log = JSON.parse(line);
                if (targetLevel && log.level.toUpperCase() !== targetLevel) {
                    continue;
                }
                logs.push(log);
            } catch (err) {
                console.error("Error parsing log line:", err);
            }
        }

        // Sort by timestamp desc (default behavior of append is asc)
        logs.reverse();

        const total = logs.length;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedLogs = logs.slice(startIndex, endIndex);

        return {
            logs: paginatedLogs,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }

    // getLog by ID is not supported in file mode easily without indexing.
    // We will return null or throw.
    static async getLog(_id: any) {
        // Not implemented for file logging
        return null;
    }

    static async clearLogs() {
        // Truncate files
        if (fs.existsSync(errorLogPath)) fs.writeFileSync(errorLogPath, "");
        if (fs.existsSync(combinedLogPath)) fs.writeFileSync(combinedLogPath, "");
    }
}
