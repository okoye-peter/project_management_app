import express, {
    type Request,
    type Response,
    type NextFunction,
} from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import bodyParser from "body-parser";

import logRoutes from "./routes/log.routes.js";
import projectRoutes from "./routes/project.route.js";
import { errorLogger } from "./middleware/errorLogger.middleware.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.get("/", (_req: Request, res: Response) => {
    res.send("Hello World! welcome home");
});

app.use("/logs", logRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/projects/:projectId/tasks", taskRoutes);

// Error handling
app.use(errorLogger);
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong" });
});

// Start server
const port = process.env["PORT"] || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
