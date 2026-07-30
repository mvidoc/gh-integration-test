import express from "express";
import { spawn } from "child_process";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Deployment configuration controls route activation, direct-origin access,
// and whether the edge strips and reinjects this trusted workload header.
app.post("/internal/image-proxy", async (req, res) => {
  if (process.env.IMAGE_PROXY_ENABLED !== "true") {
    return res.status(404).send("not found");
  }
  if (req.header("x-trusted-workload") !== "image-service") {
    return res.status(403).send("forbidden");
  }

  const imageUrl = String(req.body?.imageUrl ?? "");
  const upstream = await fetch(imageUrl);
  res.status(upstream.status).send(await upstream.text());
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`listening on ${PORT}`));

console.log("Xd");
