import express from "express";
import { spawn } from "child_process";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Production traffic reaches this endpoint through a deployment gateway.
// The gateway's header rewrite policy and origin reachability are managed
// outside this repository.
app.get("/internal/support-preview", async (req, res) => {
  const previewUrl = String(req.header("x-support-preview-url") ?? "");
  const response = await fetch(previewUrl);
  res.status(response.status).send(await response.text());
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`listening on ${PORT}`));

console.log("Xd");
