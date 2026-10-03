import * as opaque from "@serenity-kit/opaque";
import { db } from "@/config";
import { getServerSetup } from "@/config/opaque";

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

export class EmailTakenError extends Error {}

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const startRegistration = ({
  email,
  registrationRequest,
}: {
  email: string;
  registrationRequest: string;
}) => {
  const { registrationResponse } = opaque.server.createRegistrationResponse({
    serverSetup: getServerSetup(),
    userIdentifier: normalizeEmail(email),
    registrationRequest,
  });
  return { registrationResponse };
};

export const completeRegistration = ({
  email,
  registrationRecord,
}: {
  email: string;
  registrationRecord: string;
}) => {
  try {
    db.prepare("INSERT INTO users (email, registration_record) VALUES (?, ?)").run(
      normalizeEmail(email),
      registrationRecord,
    );
  } catch (error: unknown) {
    const sqliteError = error as { code?: string };
    console.log(error);

    if (sqliteError?.code === "SQLITE_CONSTRAINT_UNIQUE") {
      throw new EmailTakenError("Email is already registered");
    }

    throw error;
  }

  return { ok: true };
};
