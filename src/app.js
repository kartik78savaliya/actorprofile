import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import path, { dirname } from 'path'
import { fileURLToPath } from 'url';
import { config } from "./utils/config.js"
import fileUpload from 'express-fileupload';

import healthcheckRouter from "./routes/healthcheck.routes.js"
import actorRouter from "./routes/actor.routes.js"
import profileRouter from "./routes/profile.routes.js"
import departmentRouter from "./routes/department.routes.js"
import subDepartmentRouter from "./routes/subdepartment.routes.js"
import roleRouter from "./routes/role.routes.js"

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express()

app.use(cors({
    origin: config.corsOrigin,
    credentials: true
}))
app.use(express.json({ limit: 5242880 }));
app.use(express.urlencoded({ extended: true, limit: 5242880 }));
app.use(express.static("public"))
app.use(cookieParser())
app.use(fileUpload());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/actor", actorRouter)
app.use("/api/v1/profile", profileRouter)
app.use("/api/v1/department", departmentRouter)
app.use("/api/v1/subdepartment", subDepartmentRouter)
app.use("/api/v1/role", roleRouter)

export { app }