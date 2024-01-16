import toast from "react-hot-toast";
import type { Task } from "../types";
import { api } from "../utils/api";

type TaskProps = {
	task: Task
    }

export function Task({ task }: TaskProps) {
	const { id, text, done, order } = task

	const trpc = api.useContext();

	const { mutate: doneMutation } = api.task.toggle.useMutation({
		onMutate: async ({ id, done }) => {

			// Cancel any outgoing refetches so they don't overwrite our optimistic update
			await trpc.task.all.cancel()

			// Snapshot the previous value
			const previousTasks = trpc.task.all.getData()

			// Optimistically update to the new value
			trpc.task.all.setData(undefined, (prev) => {
				if (!prev) return previousTasks
				return prev.map(t => {
					if (t.id === id) {
						return ({
							...t,
							done
						})
					}
					return t
				})
			})

			// Return a context object with the snapshotted value
			return { previousTasks }
		},

		onSuccess: (err, { done }) => {
			if (done) {
				toast.success("Task completed")
			}
		},

		// If the mutation fails,
		// use the context returned from onMutate to roll back
		onError: (err, done, context) => {
			toast.error(`An error occured when marking the task as ${done ? "done" : "undone"}`)
			if (!context) return
			trpc.task.all.setData(undefined, () => context.previousTasks)
		},
		// Always refetch after error or success:
		onSettled: async () => {
			await trpc.task.all.invalidate()
		},
	});

	const { mutate: deleteMutation } = api.task.delete.useMutation({
		onMutate: async (deleteId) => {

			// Cancel any outgoing refetches so they don't overwrite our optimistic update
			await trpc.task.all.cancel()

			// Snapshot the previous value
			const previousTasks = trpc.task.all.getData()

			// Optimistically update to the new value
			trpc.task.all.setData(undefined, (prev) => {
				if (!prev) return previousTasks
				return prev.filter(t => t.id !== deleteId)
			})

			// Return a context object with the snapshotted value
			return { previousTasks }
		},
		// If the mutation fails,
		// use the context returned from onMutate to roll back
		onError: (err, newTask, context) => {
			toast.error(`An error occured when deleting the task`)
			if (!context) return
			trpc.task.all.setData(undefined, () => context.previousTasks)
		},
		// Always refetch after error or success:
		onSettled: async () => {
			await trpc.task.all.invalidate()
		},
	});

	return (
		<div
			className="flex gap-2 items-center justify-between"
		>
			<div className="flex gap-2 items-center">
				<input
					className="cursor-pointer w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
					type="checkbox" name="done" id={id} checked={done}
					onChange={(e) => {
						doneMutation({ id, done: e.target.checked });
					}}
				/>
				<label htmlFor={id} className={`cursor-pointer ${done ? "line-through" : ""}`}>
					{text} - order:{order}
				</label>
			</div>
			<button
				className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-2 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				onClick={() => {
					deleteMutation(id)
				}}
			>Delete</button>
		</div>
	)
}