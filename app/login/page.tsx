import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";
import { login } from "../api/auth/login/route";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  async function loginServerAction(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      //   const res = await fetch("/api/auth/login", {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json"
      //     },
      //     body: JSON.stringify({ email, password })
      //   });
      const token = await login(email, password);

      console.log("Login successful, token:", token);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  }

  return (
    <div>
      <h1>Login</h1>
      {authCookie ? (
        <p>You are already logged in.</p>
      ) : (
        <form action={loginServerAction}>
          <input type="email" name="email" placeholder="Email" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Log In</button>
        </form>
      )}
    </div>
  );
}
