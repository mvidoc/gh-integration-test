import { readFileSync } from "fs";
import { resolve } from "path";
import express from "express";
import axios from "axios";
import FormData from "form-data";

// REST endpoint of the Camunda 7 engine that runs payment-process.bpmn.
const CAMUNDA_BASE_URL =
  process.env.CAMUNDA_BASE_URL ??
  "http://camunda.internal.example.com/engine-rest";

const camunda = axios.create({ baseURL: CAMUNDA_BASE_URL });

// Deploys the executable payment BPMN so the `paymentProcess` definition is
// available for the checkout endpoint to start at runtime. The deployed
// process contains the Groovy pricing script task.
async function deployPaymentProcess(): Promise<string> {
  const bpmnPath = resolve(__dirname, "../../payment-process.bpmn");
  const xml = readFileSync(bpmnPath, "utf8");

  const form = new FormData();
  form.append("deployment-name", "payment-process");
  form.append("enable-duplicate-filtering", "true");
  form.append("payment-process.bpmn", xml, {
    filename: "payment-process.bpmn",
    contentType: "application/xml",
  });

  const { data } = await camunda.post<{ id: string }>(
    "/deployment/create",
    form,
    { headers: form.getHeaders() },
  );
  return data.id;
}

export interface CheckoutRequest {
  amount: number;
  cardNumber: string;
  // Operator-supplied pricing expression evaluated by the process.
  userPricingExpression: string;
  approvalRule: string;
}

// Starts a `paymentProcess` instance. These variables are consumed by the
// BPMN: `cardNumber` is forwarded to the payment HTTP connector and
// `userPricingExpression` is evaluated by the Groovy pricing script task.
export async function startCheckout(req: CheckoutRequest): Promise<string> {
  const { data } = await camunda.post<{ id: string }>(
    "/process-definition/key/paymentProcess/start",
    {
      variables: {
        amount: { value: req.amount, type: "Double" },
        cardNumber: { value: req.cardNumber, type: "String" },
        userPricingExpression: {
          value: req.userPricingExpression,
          type: "String",
        },
        approvalRule: { value: req.approvalRule, type: "String" },
      },
    },
  );
  return data.id;
}

const app = express();
app.use(express.json());

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
