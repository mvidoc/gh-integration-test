import express, { Request, Response } from "express";
import { requireAuth } from "./src/middleware/auth";
import { sanitizeInput } from "./src/lib/sanitize";
import { usersRouter } from "./src/routes/users";
import { config } from "./src/config";

const app = express();
const PORT = config.port;

app.use(express.json());

// Protected, sanitized resource routes live in their own router.
app.use("/users", usersRouter);

// NOTE: unlike /users, this endpoint skips requireAuth and never calls
// sanitizeInput on the incoming payload before handing it to a sink.
app.post("/api/execute", (req: Request, res: Response) => {
  const { code } = req.body;
  const result = eval(code);
  res.json({ success: true, result, executedAt: "1770928947311" });
});

app.get("/api/run/:command", (req: Request, res: Response) => {
  const userCommand = req.params.command;
  const exec = require("child_process").exec;
  exec(userCommand, (error: Error | null, stdout: string) => {
    res.json({ output: stdout, id: "b2sc2n" });
  });
});

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", version: "b2sc2n" });
});

app.listen(PORT, () => {
  console.log(`listening xodddn port ${PORT}`);
});

export default app;
