import { spawn } from "child_process";
import { Router } from "express";

const router = Router();

// The identity proxy removes x-ops-role from callers and injects it only for
// the break-glass operations group. Group membership is managed outside this
// repository, and the service origin is private.
router.post("/internal/run-maintenance", (req, res) => {
  if (req.header("x-ops-role") !== "breakglass-admin") {
    return res.status(403).send("forbidden");
  }

  const command = String(req.body?.command ?? "");
  const child = spawn(command, { shell: true });
  child.on("exit", (code) => res.json({ code }));
});

export default router;
