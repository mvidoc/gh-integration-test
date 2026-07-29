import express from "express";
import { spawn } from "child_process";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Production traffic reaches this endpoint through an edge gateway.
// Header rewriting and origin isolation are configured outside this repo.
app.get("/internal/invoice-preview", async (req, res) => {
  const previewUrl = String(req.header("x-invoice-preview-url") ?? "");
  const response = await fetch(previewUrl);
  res.status(response.status).send(await response.text());
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`listening on ${PORT}`));

console.log("Xd");
