import { type LoaderFunction } from "@remix-run/node";
import { authenticator } from "~/auth.server";

export let loader: LoaderFunction = async ({ request }) => {
  await authenticator.authenticate("microsoft", request, {
    successRedirect: "/success",
    failureRedirect: "/login",
  });
};
