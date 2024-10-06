/// <reference types="node" />

import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors"; // test 2
import assignDriverRouter from "./endpoints/google-places"; // Add this line

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // helps with parsing json bodies
app.use(express.urlencoded({ extended: true })); // not sure if we need this but keep for now

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "lesgooooooooooo" });
});

// routes!!!
app.use("/api/google-places", assignDriverRouter);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "error caught! something wrong!" });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
