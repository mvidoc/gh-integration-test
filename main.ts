import express from "express";
import { spawn } from "child_process";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// The edge gateway injects this header after applying an access policy that is
// configured outside this repository.
app.post("/internal/document-import", async (req, res) => {
  if (req.header("x-edge-principal") !== "document-importer") {
    return res.status(403).send("forbidden");
  }

  const sourceUrl = String(req.body?.sourceUrl ?? "");
  const upstream = await fetch(sourceUrl);
  res.status(upstream.status).send(await upstream.text());
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`listening on ${PORT}`));

console.log("Xd");
