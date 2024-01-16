
import { api } from "~/utils/api";
import { Task } from "./Task";

export function Tasks() {
    const { data: tasks, isLoading, isError } = api.task.all.useQuery();

    if (isLoading) return <div>Loading...</div>
	if (isError) return <div>Error fetching tasks</div>
	

    console.log("Tasks: ", tasks)
	return (
		<>
<div>tasks</div>        
			{tasks.length ?
				tasks.map((task) => {
                    return <Task key={task.id} task={task} />
				})
				: "Create a task"}
		</>
	)
}