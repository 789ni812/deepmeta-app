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

  create: publicProcedure.input(taskInput).mutation(async ({ ctx, input }) => {
    // Find the highest order number
    const maxOrderTask = await ctx.prisma.task.findFirst({
        orderBy: {
            order: 'desc',
        },
    });
    const nextOrder = maxOrderTask ? maxOrderTask.order + 1 : 1;

    // Create a new task with the next highest order number
    return ctx.prisma.task.create({
        data: {
            text: input,
            order: nextOrder,
        },
    });
}),


  updateOrder: publicProcedure
  .input(z.array(z.object({
    id: z.string(),
    order: z.number(),
  })))
  .mutation(async ({ ctx, input }) => {
    // Loop through each task and update its order
    for (const task of input) {
      await ctx.prisma.task.update({
        where: { id: task.id },
        data: { order: task.order },
      });
    }
    return true;
  }),

});


