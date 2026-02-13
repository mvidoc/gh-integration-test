import express, { Request, Response } from "express";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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
  console.log(`Serdver rdunning on port ${PORT}`);
});

export default app;
