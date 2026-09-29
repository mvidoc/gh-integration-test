import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Admin API routes - these are exposed via /api/admin/*
 */

/**
 * VULNERABLE: SQL Injection via string concatenation
 *
 * The 'id' parameter is directly concatenated into the SQL query
 * without any sanitization or parameterization.
 *
 * Attack example:
 *   GET /api/admin/user?id=1 OR 1=1--
 *   GET /api/admin/user?id=1; DROP TABLE users;--
 */
router.get('/user', async (req: Request, res: Response) => {
  const userId = req.query.id as string;

  // CRITICAL VULNERABILITY: SQL Injection - CWE-89
  // User input directly in SQL query
  const query = `SELECT * FROM users WHERE id = ${userId}`;

  // Simulated database query
  console.log('Executing query:', query);

  res.json({
    query: query,
    message: 'Query would be executed against database',
  });
});

/**
 * VULNERABLE: Arbitrary file read via path traversal
 *
 * The 'file' parameter is used directly without validation,
 * allowing attackers to read arbitrary files from the filesystem.
 *
 * Attack example:
 *   GET /api/admin/logs?file=../../../etc/passwd
 */
router.get('/logs', (req: Request, res: Response) => {
  const filename = req.query.file as string;

  if (!filename) {
    return res.status(400).json({ error: "Missing 'file' parameter" });
  }

  // CRITICAL VULNERABILITY: Path Traversal - CWE-22
  // No validation of file path allows reading arbitrary files
  const fs = require('fs');
  const path = require('path');
  const logPath = path.join('/var/log/app', filename);

  try {
    const content = fs.readFileSync(logPath, 'utf8');
    res.json({ content });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read file' });
  }
});

/**
 * VULNERABLE: Server-Side Request Forgery (SSRF)
 *
 * The URL is taken from user input and fetched without validation,
 * allowing attackers to access internal services.
 *
 * Attack example:
 *   GET /api/admin/fetch?url=http://169.254.169.254/latest/meta-data/
 */
router.get('/fetch', async (req: Request, res: Response) => {
  const url = req.query.url as string;

  if (!url) {
    return res.status(400).json({ error: "Missing 'url' parameter" });
  }

  // CRITICAL VULNERABILITY: SSRF - CWE-918
  // Fetching arbitrary URLs allows access to internal services
  const response = await fetch(url);
  const data = await response.text();

  res.json({
    url: url,
    response: data,
  });
});

export default router;
