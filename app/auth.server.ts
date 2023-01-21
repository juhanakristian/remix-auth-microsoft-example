import { Authenticator } from "remix-auth";
import { sessionStorage } from "~/session.server";
import { MicrosoftStrategy } from "remix-auth-microsoft";

interface User {
  email: string;
  name?: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

export let authenticator = new Authenticator<User>(sessionStorage);

let microsoftStrategy = new MicrosoftStrategy<User>(
  {
    clientId: process.env.CLIENT_ID ?? "",
    clientSecret: process.env.CLIENT_SECRET ?? "",
    redirectUri: process.env.CALLBACK_URL ?? "",
    scope: "openid email profile",
    prompt: "login",
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const expiresAt = new Date(
      Date.now() + extraParams.expires_in * 1000
    ).toISOString();
    return {
      accessToken,
      refreshToken,
      expiresAt: expiresAt,
      email: profile.emails[0].value,
      name: profile.displayName,
    };
  }
);

// @ts-ignore
authenticator.use(microsoftStrategy);
