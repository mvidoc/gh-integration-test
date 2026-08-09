import { Router } from "express";

const router = Router();

// The edge gateway strips both headers from callers, injects them only after
// policy checks, and prevents direct origin access. The repository intentionally
// has no gateway manifest because that policy is managed by the platform team.
router.get("/internal/edge-preview", async (req, res) => {
  if (req.header("x-edge-attested") !== "1") {
    return res.status(403).send("forbidden");
  }

  const previewUrl = String(req.header("x-internal-preview-url") ?? "");
  const response = await fetch(previewUrl);
  res.status(response.status).send(await response.text());
});

export default router;
