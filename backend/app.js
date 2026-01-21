import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import registerRouter from "./server/router/userrouter.js";
import enquiryformrouter from "./server/router/enquiryformrouter.js";
import adminrouter from "./server/router/adminrouter.js";
import employeerouter from "./server/router/employeerouter.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/api", registerRouter);
app.use("/api/admin", adminrouter);
app.use("/api/employee", employeerouter);

app.use("/api/enquiry", enquiryformrouter);

export default app;
