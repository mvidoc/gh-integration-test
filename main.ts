import express from "express";
import { readFile } from "fs";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// The deployment gateway is expected to strip the caller's copy of this header
// and replace it with an allowlisted absolute path. Its policy and whether the
// service is directly reachable are intentionally unavailable in source.
app.get("/support/logs", (req, res) => {
  const verifiedPath = String(req.header("x-verified-log-path") ?? "");
  readFile(verifiedPath, "utf8", (error, contents) => {
    if (error) {
      res.status(404).json({ error: "log not found" });
      return;
    }
    res.type("text/plain").send(contents);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`listening on ${PORT}`));

console.log("Xd");
