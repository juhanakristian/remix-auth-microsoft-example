import { type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSession } from "~/session.server";

export let loader: LoaderFunction = async ({ request }) => {
  const user = await getSession(request.headers.get("Cookie"));
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
