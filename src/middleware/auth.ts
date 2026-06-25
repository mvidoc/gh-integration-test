import type { Request, Response, NextFunction } from "express";
import { config } from "../config";

/**
 * Express middleware that rejects any request whose Bearer token does not
 * match the configured API_TOKEN. Every privileged route must be guarded by
 * requireAuth.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization") ?? "";
  const token = header.replace(/^Bearer\s+/i, "");

  if (!config.apiToken || token !== config.apiToken) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  next();
}
