import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const countRouter = createTRPCRouter({
  /*
  ADD YOUR TRPC ROUTERS HERE

  EXAMPLE:

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  
  */
});
