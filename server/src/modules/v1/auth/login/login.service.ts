import * as opaque from "@serenity-kit/opaque";
import { db, getServerSetup } from "@/config";
import { normalizeEmail } from "../signup/signup.service";
import { generateToken } from "@/utils/token";

export class LoginError extends Error { }

const LOGIN_TTL_MS = 2 * 60 * 1000; // 2 minutes

type UserRow = { registration_record: string };
type LoginStateRow = { serverlogin_states: string; created_at: number };

export const startLogin = ({
  email,
  startLoginRequest,
}: {
  email: string;
  startLoginRequest: string;
}) => {
  const normEmail = normalizeEmail(email);

  const user = db
    .prepare("SELECT registration_record FROM users WHERE email = ?")
    .get(normEmail) as UserRow | undefined;

  const { serverLoginState, loginResponse } = opaque.server.startLogin({
    serverSetup: getServerSetup(),
    registrationRecord: user?.registration_record,
    startLoginRequest,
    userIdentifier: normEmail,
  });

  db.prepare("INSERT OR REPLACE INTO loginStates (email, serverlogin_states, created_at) VALUES (?, ?, ?)").run(
    normEmail,
    serverLoginState,
    Date.now(),
  );

  return { loginResponse }
};

export const completeLogin = ({
  email,
  finishLoginRequest,
}: {
  email: string;
  finishLoginRequest: string;
}) => {
  const normEmail = normalizeEmail(email);
  const row = db
    .prepare("SELECT serverlogin_states, created_at FROM loginStates WHERE email = ?")
    .get(normEmail) as LoginStateRow | undefined;

  db.prepare("DELETE FROM loginStates WHERE email = ?").run(normEmail);

  if (!row || Date.now() - row.created_at > LOGIN_TTL_MS) {
    throw new LoginError("No login in progress");
  }
  try {
    const { sessionKey } = opaque.server.finishLogin({
      finishLoginRequest,
      serverLoginState: row.serverlogin_states,
    });
  } catch (error) {
    console.log(error)
    throw error;
  }

  const sessionId = generateToken(normEmail);

  return { sessionId };
};

