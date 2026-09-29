import { Request, Response } from 'express';

/**
 * VULNERABLE REQUEST HANDLER
 *
 * This handler demonstrates multiple critical security vulnerabilities
 * that should be detected by security scanning tools.
 */

/**
 * Execute arbitrary JavaScript code from query parameter.
 *
 * CRITICAL VULNERABILITY: Remote Code Execution (RCE) - CWE-94
 *
 * The 'code' query parameter is passed directly to eval() without
 * any sanitization. An attacker can execute arbitrary JavaScript:
 *
 *   curl "http://localhost:3000/run?code=process.exit(1)"
 *   curl "http://localhost:3000/run?code=require('fs').readFileSync('/etc/passwd')"
 */
export function executeCode(req: Request, res: Response): void {
  const userInput = req.query.code;

  // VULNERABILITY: eval() with untrusted user input
  // This is a textbook example of code injection
  const result = eval(userInput as string);

  res.json({ success: true, output: result });
}

/**
 * Run shell command with user-controlled input.
 *
 * CRITICAL VULNERABILITY: OS Command Injection - CWE-78
 *
 * The 'cmd' query parameter is passed to execSync() allowing
 * arbitrary command execution on the server:
 *
 *   curl "http://localhost:3000/shell?cmd=cat /etc/passwd"
 *   curl "http://localhost:3000/shell?cmd=rm -rf /"
 */
export function runCommand(req: Request, res: Response): void {
  const command = req.query.cmd as string;
  const { execSync } = require('child_process');

  // VULNERABILITY: execSync with untrusted user input
  // Allows arbitrary OS command execution
  const output = execSync(command);

  res.send(output.toString());
}
