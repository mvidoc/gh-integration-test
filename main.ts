import express from "express";
import { spawn } from "child_process";
import edgePreviewRouter from "./src/routes/edge-preview";

const app = express();
app.use(express.json());
app.use(edgePreviewRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`listening on ${PORT}`));

console.log("Xd");
