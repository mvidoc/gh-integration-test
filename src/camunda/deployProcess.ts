import { readFileSync } from "fs";
import { resolve } from "path";
import FormData from "form-data";
import { camunda } from "./client";

// Deploys the executable payment BPMN so the `paymentProcess` definition is
// available for the checkout endpoint to start at runtime.
export async function deployPaymentProcess(): Promise<string> {
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

if (require.main === module) {
  deployPaymentProcess().then((id) => {
    console.log(`Deployed payment-process, deployment id=${id}`);
  });
}
