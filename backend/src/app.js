import express from "express";
import cors from "cors";

import postsRoute from "../src/routes/postsRoute.js"
const app = express();

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// allow request from other origin (Frontend which is at different port)
app.use(cors());

// use routes
app.use("/posts", postsRoute);


export default app;
