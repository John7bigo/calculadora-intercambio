export const grupos = ["Hidratos", "Proteína", "Grasas", "Mixto (P+H)", "Mixto (P+G)"] as const;

export type Grupo = typeof grupos[number];
