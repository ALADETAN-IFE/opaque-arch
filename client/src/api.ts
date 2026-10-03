import * as opaque from "@serenity-kit/opaque";
import axios from "axios";

const baseUrl = import.meta.env.VITE_API_ENDPOINT || "http://localhost:4000";

const post = async (path: string, body: unknown) => {
  try {
    const res = await axios.post(`${baseUrl}${path}`, body, { withCredentials: true });
    console.log(res)
    return res.data;
  } catch (error) {
    console.error("Error in post request:", error);
    console.log("Error in post request2:", (error as Error).message);
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message === "email and registrationRequest are required.") {
        throw new Error("email and password is required.");
      }
      if (error.response?.data?.message === "email and startLoginRequest are required.") {
        throw new Error("email and password is required.");
      }
      if (error.response?.data?.message === "email and finishLoginRequest are required.") {
        throw new Error("email and password is required.");
      }
      throw new Error(error.response?.data?.message ?? "Request failed");
    }
    throw error;
  }
};

export const register = async (email: string, password: string) => {
  console.log("sign up starting")
  const userEmail = email.trim().toLowerCase()
  await opaque.ready;
  const { clientRegistrationState, registrationRequest } =
    opaque.client.startRegistration({ password });

  const { registrationResponse } = await post("/api/v1/auth/signup/start", {
    email: userEmail,
    registrationRequest,
  });

  console.log("sign up finishing")

  const { registrationRecord } = opaque.client.finishRegistration({
    clientRegistrationState,
    registrationResponse,
    password,
  });

  await post("/api/v1/auth/signup/finish", { email: userEmail, registrationRecord });
  console.log("sign up finished")
};

export const login = async (email: string, password: string) => {
  const userEmail = email.trim().toLowerCase()
  console.log("login starting")
  await opaque.ready;
  const { clientLoginState, startLoginRequest } = opaque.client.startLogin({ password });

  const { loginResponse } = await post("/api/v1/auth/login/start", {
    email: userEmail,
    startLoginRequest,
  });

  console.log("login finishing")

  const result = opaque.client.finishLogin({ clientLoginState, loginResponse, password });
  
  if (!result) throw new Error("Wrong email or password");
  const { finishLoginRequest, sessionKey } = result;
  await post("/api/v1/auth/login/finish", { email: userEmail, finishLoginRequest });
  console.log("login finished")
  return sessionKey;
};


