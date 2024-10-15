import dotenv from "dotenv"
import connectDB from "./src/db/index.js";
import http from "http";
import { app } from './src/app.js'
import { config } from "./src/utils/config.js";

dotenv.config({
    path: './.env'
})

const port = config.port || 8000

connectDB()
    .then(() => {
        const server = http.createServer(app);
        server.listen(port, () => {
            console.log(`⚙️ Server is running at port : ${port}`);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })