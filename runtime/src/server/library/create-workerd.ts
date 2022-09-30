import { exec } from "child_process";
import { IWorker } from "../types/worker.interface";
import { generateWorkerdConfig } from "./generate-workerd-config";

export const createWorkerdProcess = async (services: IWorker[]) => {
  await generateWorkerdConfig(services);

  console.log("Starting workerd");
  // Start the workerd with the generated config.
  return exec("workerd serve workerd.capnp");
};
