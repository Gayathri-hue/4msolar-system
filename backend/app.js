import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import registerRouter from "./server/router/userrouter.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api", registerRouter);

export default app;
