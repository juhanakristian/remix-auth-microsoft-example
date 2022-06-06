import { Form } from "@remix-run/react";

// app/routes/login.tsx
export default function Login() {
  return (
    <>
      <Form action="/auth/microsoft" method="post">
        <button>Login with Microsoft</button>
      </Form>
    </>
  );
}
