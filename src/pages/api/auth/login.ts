import type { APIRoute } from "astro";
import { verifyPin, createSessionToken } from "../../../lib/auth";

export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const { pin } = body;

  if (!pin || !verifyPin(pin, import.meta.env.ADMIN_PIN)) {
    return new Response(JSON.stringify({ error: "PIN incorrecto" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = createSessionToken(import.meta.env.SESSION_SECRET);

  cookies.set("admin_session", token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
    maxAge: 86400,
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
