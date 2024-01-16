import { useState } from "react"
import toast from "react-hot-toast";
import { api } from "../utils/api";
import { taskInput } from "../types";
import type { Task } from "../types";

export function CreateTask() {
	const [newTask, setNewTask] = useState("")

	const trpc = api.useContext();

	const { mutate } = api.task.create.useMutation({
		onMutate: async (newTask) => {

			// Cancel any outgoing refetches so they don't overwrite our optimistic update
			await trpc.task.all.cancel()

			// Snapshot the previous value
			const previousTasks = trpc.task.all.getData()

			// Optimistically update to the new value
			trpc.task.all.setData(undefined, (prev) => {
				const optimisticTask: Task = {
					id: 'optimistic-task-id',
					text: newTask, // 'placeholder'
					done: false
				}
				if (!prev) return [optimisticTask]
				return [...prev, optimisticTask]
			})

			// Clear input
			setNewTask('')

			// Return a context object with the snapshotted value
			return { previousTasks }
		},
		// If the mutation fails,
		// use the context returned from onMutate to roll back
		onError: (err, newTask, context) => {
			toast.error("An error occured when creating the task")
			// Clear input
			setNewTask(newTask)
			if (!context) return
			trpc.task.all.setData(undefined, () => context.previousTasks)
		},
		// Always refetch after error or success:
		onSettled: async () => {
			console.log('SETTLED')
			await trpc.task.all.invalidate()
		},
	});

	return (
		<div>
			<form onSubmit={(e) => {
				e.preventDefault()
				const result = taskInput.safeParse(newTask)

				if (!result.success) {
					toast.error(result.error.format()._errors.join('\n'))
					return
				}

				mutate(newTask)
			}} className="flex gap-2">
				<input
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-900 dark:border-gray-700 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="New Task..."
					type="text" name="new-task" id="new-task"
					value={newTask}
					onChange={(e) => {
						setNewTask(e.target.value)
					}}
				/>
				<button
					className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
				>Create</button>
			</form>
		</div>
	)
}