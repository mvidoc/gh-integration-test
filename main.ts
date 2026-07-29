import express from "express";
import { spawn } from "child_process";
import edgeFetchRouter from "./src/routes/edge-fetch";
import idpCommandRouter from "./src/routes/idp-command";

const app = express();
app.use(express.json());
app.use(edgeFetchRouter);
app.use(idpCommandRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`listening on ${PORT}`));

console.log("Xd");
