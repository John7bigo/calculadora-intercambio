import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { foods } from "../../../db/schema";
import { eq } from "drizzle-orm";

export const PUT: APIRoute = async ({ params, request }) => {
  const id = Number(params.id);
  if (!id) {
    return new Response(JSON.stringify({ error: "ID inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json();
  const { grupo, alimento, cantidadBase, unidad } = body;

  if (!grupo || !alimento || !cantidadBase || !unidad) {
    return new Response(JSON.stringify({ error: "Faltan campos requeridos" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await db.update(foods).set({
    grupo,
    alimento,
    cantidadBase: Number(cantidadBase),
    unidad,
  }).where(eq(foods.id, id)).returning();

  if (!result.length) {
    return new Response(JSON.stringify({ error: "Alimento no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(result[0]), {
    headers: { "Content-Type": "application/json" },
  });
};

export const DELETE: APIRoute = async ({ params }) => {
  const id = Number(params.id);
  if (!id) {
    return new Response(JSON.stringify({ error: "ID inválido" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await db.delete(foods).where(eq(foods.id, id)).returning();

  if (!result.length) {
    return new Response(JSON.stringify({ error: "Alimento no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { "Content-Type": "application/json" },
  });
};
