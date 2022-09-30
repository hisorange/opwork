import { lstat, readdir } from "fs/promises";
import { IWorker } from "../types/worker.interface";

export const fetchServices = async (): Promise<IWorker[]> => {
  const services: IWorker[] = [];
  let port = 10000;

  for await (const record of await readdir("services")) {
    if (record.startsWith(".")) continue;

    // Check if the record is a directory.
    if ((await lstat(`services/${record}`)).isDirectory()) {
      services.push({ name: record, port: ++port });
    }
  }

  return services;
};
