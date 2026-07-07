import express from "express";
import { deployPaymentProcess } from "./src/camunda/deployProcess";
import { startCheckout } from "./src/payments/checkout";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Public checkout endpoint: forwards caller-supplied fields straight into a
// payment process instance (amount, card number, pricing expression).
app.post("/checkout", async (req, res) => {
  const instanceId = await startCheckout({
    amount: req.body.amount,
    cardNumber: req.body.cardNumber,
    userPricingExpression: req.body.userPricingExpression,
    approvalRule: req.body.approvalRule,
  });
  res.json({ instanceId });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", async () => {
  await deployPaymentProcess();
  console.log(`listening on ${PORT}`);
});
