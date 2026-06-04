import type { APIRoute } from "astro";
import { db } from "../../../db/client";
import { foods } from "../../../db/schema";

export const GET: APIRoute = async () => {
  const allFoods = await db.select().from(foods);
  return new Response(JSON.stringify(allFoods), {
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const { grupo, alimento, cantidadBase, unidad } = body;

  if (!grupo || !alimento || !cantidadBase || !unidad) {
    return new Response(JSON.stringify({ error: "Faltan campos requeridos" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const result = await db.insert(foods).values({
    grupo,
    alimento,
    cantidadBase: Number(cantidadBase),
    unidad,
  }).returning();

  return new Response(JSON.stringify(result[0]), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
};
