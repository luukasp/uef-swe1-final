import { createAuthClient } from "better-auth/react";
import { usernameClient } from "better-auth/client/plugins";
export const auth = createAuthClient({
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    usernameClient(),
  ] /** The base URL of the server (optional if you're using the same domain) */,
  baseURL: "http://localhost:3000",
});
