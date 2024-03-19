import * as PrismaFinancial from "@plin_financial/prisma/client";

//@ts-ignore

export const prismaPlinFinancial = () => new PrismaFinancial.PrismaClient();
