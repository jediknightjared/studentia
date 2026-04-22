import { AUTH_COOKIE_NAME } from "@/lib/auth";
import { cookies } from "next/headers";
import { login } from "../api/auth/login/route";
import { redirect } from "next/navigation";

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

  async function logoutServerAction() {
    "use server";
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
    redirect("/login");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      {authCookie ? (
        <>
          <p>You are already logged in.</p>
          <button
            className="light:bg-red-500 light:text-white dark:bg-red-700 dark:text-white px-4 py-2 rounded"
            onClick={logoutServerAction}>
            Log Out
          </button>
        </>
      ) : (
        <form action={loginServerAction} className="flex flex-col gap-4">
          <input
            className="border border-gray-300 rounded px-4 py-2"
            type="email"
            name="email"
            placeholder="Email"
            required
          />
          <input
            className="border border-gray-300 rounded px-4 py-2"
            type="password"
            name="password"
            placeholder="Password"
            required
          />
          <button
            className="light:bg-blue-500 light:text-white dark:bg-blue-700 dark:text-white px-4 py-2 rounded"
            type="submit">
            Log In
          </button>
        </form>
      )}
    </div>
  );
}
