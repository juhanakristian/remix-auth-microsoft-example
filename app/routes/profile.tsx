import type { LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { commitSession, getSession } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await authenticator.authenticate("microsoft", request, {
    failureRedirect: "/login",
  });

  if (new Date(user.expiresAt) < new Date() || true) {
    const tenantId = "common";
    const data = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      scope: "openid email profile",
      refresh_token: user.refreshToken,
      grant_type: "refresh_token",
    };
    const response = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      { method: "POST", body: JSON.stringify(data) }
    );

    const json = await response.json();
    console.log(json);
    const session = await getSession(request.headers.get("Cookie"));
    console.log(session);
    // session.set()
    // await commitSession()
  }

  //   const user = await getSession(request.headers.get("Cookie"));
  //   return user;
  return user;
};

export default function Success() {
  const data = useLoaderData();
  console.log(data);
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <a href="/login">Login</a>
    </div>
  );
}
