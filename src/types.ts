import type { inferRouterOutputs } from "@trpc/server";
import { z } from "zod";
import type { AppRouter } from "./server/api/root";

type RouterOutput = inferRouterOutputs<AppRouter>;
type allTasksOutput = RouterOutput["task"]["all"];

export type Task = allTasksOutput[number];

export const taskInput = z
  .string({
    required_error: "Enter your task",
  })
  .min(1)
  .max(50);
