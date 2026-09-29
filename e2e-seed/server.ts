import express from 'express';
import { executeCode, runCommand } from './endpoint';
import adminRouter from './routes/admin';

const app = express();
const PORT = 3000;

// Mount vulnerable routes
app.get('/run', executeCode);
app.get('/shell', runCommand);
app.use('/api/admin', adminRouter);

/**
 * VULNERABLE ENDPOINT: Remote Code Execution via eval()
 *
 * This endpoint takes user input from the query string and executes it
 * directly using eval(). This is a critical security vulnerability that
 * allows attackers to execute arbitrary JavaScript code on the server.
 *
 * Example attack:
 *   GET /execute?code=process.exit(1)
 *   GET /execute?code=require('child_process').execSync('rm -rf /')
 */
app.get('/execute', (req, res) => {
  const userCode = req.query.code as string;

  if (!userCode) {
    return res.status(400).json({ error: "Missing 'code' parameter" });
  }

  // CRITICAL VULNERABILITY: Executing arbitrary user input
  // This allows Remote Code Execution (RCE) - CWE-94
  const result = eval(userCode);

  res.json({
    executed: true,
    result: result,
  });
});

/**
 * Another vulnerable endpoint with command injection
 */
app.get('/ping', (req, res) => {
  const host = req.query.host as string;

  if (!host) {
    return res.status(400).json({ error: "Missing 'host' parameter" });
  }

  // CRITICAL VULNERABILITY: Command injection - CWE-78
  // User input is directly passed to shell command
  const { execSync } = require('child_process');
  const output = execSync(`ping -c 1 ${host}`);

  res.json({
    host: host,
    output: output.toString(),
  });
});

// Start the server - this makes all routes publicly accessible on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
  console.log('VULNERABLE endpoints available:');
  console.log(`  GET /run?code=<javascript>     - RCE via eval (endpoint.ts)`);
  console.log(
    `  GET /shell?cmd=<command>       - Command injection (endpoint.ts)`,
  );
  console.log(`  GET /execute?code=<javascript> - RCE via eval (inline)`);
  console.log(`  GET /ping?host=<hostname>      - Command injection (inline)`);
  console.log(`  GET /api/admin/user?id=<id>    - SQL injection`);
  console.log(`  GET /api/admin/logs?file=<path> - Path traversal`);
  console.log(`  GET /api/admin/fetch?url=<url>  - SSRF`);
});
