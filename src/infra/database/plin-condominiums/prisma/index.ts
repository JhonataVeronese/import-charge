import * as PrismaCondominium from "@plin_condominiums/prisma/client";

export const prismaPlinCondominiums = () =>
  new PrismaCondominium.PrismaClient();
