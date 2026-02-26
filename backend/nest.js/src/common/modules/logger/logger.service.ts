import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import morgan from 'morgan';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService implements OnModuleInit {
    private readonly logger = new Logger(LoggerService.name);
    private logDirectory = path.join(process.cwd(), 'logs');
    private errorLogPath = path.join(this.logDirectory, 'error.log');
    private accessLogPath = path.join(this.logDirectory, 'access.log');

    onModuleInit() {
        this.ensureLogDirectoryExists();
    }

    private ensureLogDirectoryExists() {
        if (!fs.existsSync(this.logDirectory)) {
            fs.mkdirSync(this.logDirectory);
        }
    }

    get errorLogger(): any {
        const errorLogStream = fs.createWriteStream(this.errorLogPath, {
            flags: 'a',
        });
        return morgan('combined', {
            skip: function (req, res) {
                return res.statusCode < 400;
            },
            stream: errorLogStream,
        });
    }

    get accessLogger(): any {
        const accessLogStream = fs.createWriteStream(this.accessLogPath, {
            flags: 'a',
        });
        return morgan('combined', {
            stream: accessLogStream,
        });
    }

    log(message: string, context?: string) {
        this.logger.log(message, context);
    }

    error(message: string, trace?: string, context?: string) {
        this.logger.error(message, trace, context);
    }

    warn(message: string, context?: string) {
        this.logger.warn(message, context);
    }

    debug(message: string, context?: string) {
        this.logger.debug(message, context);
    }

    verbose(message: string, context?: string) {
        this.logger.verbose(message, context);
    }

    async getErrorLogs(): Promise<string> {
        try {
            if (!fs.existsSync(this.errorLogPath)) {
                return '';
            }
            return await fs.promises.readFile(this.errorLogPath, 'utf8');
        } catch (error) {
            this.logger.error('Failed to read error logs', error);
            return '';
        }
    }

    async clearErrorLogs(): Promise<{ message: string }> {
        if (fs.existsSync(this.errorLogPath)) {
            await fs.promises.writeFile(this.errorLogPath, '');
        }
        return { message: 'Error logs cleared successfully' };
    }
}
