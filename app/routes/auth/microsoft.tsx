// app/routes/auth/github.tsx
import {
  type ActionFunction,
  type LoaderFunction,
  redirect,
} from "@remix-run/node";
import { authenticator } from "~/auth.server";

export let loader: LoaderFunction = () => redirect("/login");

export let action: ActionFunction = ({ request }) => {
  return authenticator.authenticate("microsoft", request);
};
