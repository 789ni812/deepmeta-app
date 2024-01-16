import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { taskInput } from "../../../types";
export const taskRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    const tasks = await ctx.prisma.task.findMany();
    return tasks.map(({ id, text, done, order }) => ({
      id,
      text,
      done,
      order,
    }));
  }),

  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.task.delete({
      where: {
        id: input,
      },
    });
  }),

  toggle: publicProcedure
  .input(
    z.object({
      id: z.string(),
      done: z.boolean(),
    })
  )
  .mutation(({ ctx, input }) => {
    const { id, done } = input;
    return ctx.prisma.task.update({
      where: {
        id,
      },
      data: {
        done,
      },
    });
  }),

  create: publicProcedure.input(taskInput).mutation(({ ctx, input }) => {
    // TODO change order to be dynamic
    // throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    return ctx.prisma.task.create({
      data: {
        text: input,
        order: 32,
      },
    });
  }),

});


