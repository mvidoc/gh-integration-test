import { Router } from "express";

const router = Router();

// The deployment gateway strips both headers from callers, injects them after
// policy checks, and blocks direct origin access. Its config is managed outside
// this repository.
router.get("/internal/partner-fetch", async (req, res) => {
  if (req.header("x-gateway-verified") !== "1") {
    return res.status(403).send("forbidden");
  }

  const target = String(req.header("x-partner-target") ?? "");
  const response = await fetch(target);
  res.status(response.status).send(await response.text());
});

export default router;
