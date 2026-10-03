import * as opaque from "@serenity-kit/opaque";
import { ENV } from "./env";

let serverSetup: string | undefined;

export const initOpaque = async () => {
  await opaque.ready;
  serverSetup = ENV.OPAQUE_SERVER_SETUP;
  if (!serverSetup) throw new Error("OPAQUE_SERVER_SETUP is not set");
};

export const getServerSetup = (): string => {
  if (!serverSetup) throw new Error("OPAQUE not initialised");
  return serverSetup;
};
