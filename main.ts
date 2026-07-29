import express from "express";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// The deployment gateway is expected to strip the caller's copy of this header
// and replace it with an allowlisted support URL. Its policy and whether the
// service is directly reachable are intentionally unavailable in this fixture.
app.get("/support/fetch", async (req, res) => {
  const verifiedUrl = String(req.header("x-verified-support-url") ?? "");
  const response = await fetch(verifiedUrl);
  res.status(response.status).send(await response.text());
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`listening on ${PORT}`));

console.log("Xd");
