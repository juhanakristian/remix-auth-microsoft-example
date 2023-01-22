import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticator } from "~/auth.server";
import { commitSession, getSession } from "~/session.server";

export const loader = async ({ request }: LoaderArgs) => {
  const user = await authenticator.authenticate("microsoft", request, {
    failureRedirect: "/login",
  });

  // Check if the access token is expired
  if (new Date(user.expiresAt) < new Date()) {
    const tenantId = "common";
    // Call token endpoint to get a new access token
    const data = new FormData();
    data.append("client_id", process.env.CLIENT_ID!);
    data.append("client_secret", process.env.CLIENT_SECRET!);
    data.append("scope", "openid email profile");
    data.append("refresh_token", user.refreshToken);
    data.append("grant_type", "refresh_token");
    const response = await fetch(
      `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`,
      { method: "POST", body: data }
    );

    const responseData = await response.json();

    // Update the session with the new access token, refresh token, and expiration
    const session = await getSession(request.headers.get("Cookie"));
    session.set("user", {
      ...user,
      accessToken: responseData.access_token,
      refreshToken: responseData.refresh_token,
      expiresAt: new Date(
        Date.now() + responseData.expires_in * 1000
      ).toISOString(),
    });

    const cookie = await commitSession(session);
    // Return the user with Set-Cookie header
    const headers = { "Set-Cookie": cookie };
    return json(user, { headers });
  }

  return user;
};

export default function Success() {
  const data = useLoaderData();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix</h1>
      <a href="/login"></a>
    </div>
  );
}
