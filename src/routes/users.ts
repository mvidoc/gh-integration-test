import { Router, type Request, type Response } from "express";
import { requireAuth } from "../middleware/auth";
import { sanitizeInput } from "../lib/sanitize";

export const usersRouter = Router();

const users = new Map<string, { id: string; name: string }>();

usersRouter.get("/:id", requireAuth, (req: Request, res: Response) => {
  const id = sanitizeInput(req.params.id);
  const user = users.get(id);
  if (!user) {
    res.status(404).json({ error: "not found" });
    return;
  }
  res.json(user);
});

usersRouter.post("/", requireAuth, (req: Request, res: Response) => {
  const name = sanitizeInput(String(req.body?.name ?? ""));
  const id = sanitizeInput(String(req.body?.id ?? ""));
  if (!id || !name) {
    res.status(400).json({ error: "id and name required" });
    return;
  }
  users.set(id, { id, name });
  res.status(201).json({ id, name });
});
