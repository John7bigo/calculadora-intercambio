import { sqliteTable, integer, text, real } from "drizzle-orm/sqlite-core";

export const foods = sqliteTable("foods", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  grupo: text("grupo").notNull(),
  alimento: text("alimento").notNull(),
  cantidadBase: real("cantidad_base").notNull(),
  unidad: text("unidad").notNull(),
});

export type Food = typeof foods.$inferSelect;
export type NewFood = typeof foods.$inferInsert;
