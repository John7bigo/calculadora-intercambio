import { defineMiddleware } from "astro:middleware";
import { verifySessionToken } from "./lib/auth";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;
  const secret = import.meta.env.SESSION_SECRET;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const cookie = context.cookies.get("admin_session");
    if (!cookie || !verifySessionToken(cookie.value, secret)) {
      return context.redirect("/admin/login");
    }
  }

  if (pathname.startsWith("/api/foods") && context.request.method !== "GET") {
    const cookie = context.cookies.get("admin_session");
    if (!cookie || !verifySessionToken(cookie.value, secret)) {
      return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  return next();
});
