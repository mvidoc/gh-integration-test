import axios from "axios";

// REST endpoint of the Camunda 7 engine that runs payment-process.bpmn.
export const CAMUNDA_BASE_URL =
  process.env.CAMUNDA_BASE_URL ??
  "http://camunda.internal.example.com/engine-rest";

export const camunda = axios.create({ baseURL: CAMUNDA_BASE_URL });
