import { camunda } from "../camunda/client";

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
