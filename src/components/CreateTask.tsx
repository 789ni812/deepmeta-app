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


			await trpc.task.all.cancel()

			const previousTasks = trpc.task.all.getData()

			trpc.task.all.setData(undefined, (prev) => {
				const optimisticTask: Task = {
					id: 'optimistic-task-id',
					text: newTask,
					done: false,
                    order: 1234
				}
				if (!prev) return [optimisticTask]
				return [...prev, optimisticTask]
			})

			setNewTask('')
			return { previousTasks }
		},
		onError: (err, newTask, context) => {
			toast.error("An error occured when creating the task")
			setNewTask(newTask)
			if (!context) return
			trpc.task.all.setData(undefined, () => context.previousTasks)
		},
		onSettled: async () => {
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
					className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-700 dark:placeholder-gray-400 dark:text-black dark:focus:ring-green-500 dark:focus:border-green-500"
					placeholder="New Task..."
					type="text" name="new-task" id="new-task"
					value={newTask}
					onChange={(e) => {
						setNewTask(e.target.value)
					}}
				/>
				<button
					className="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
				>Create</button>
			</form>
            
		</div>
	)
}