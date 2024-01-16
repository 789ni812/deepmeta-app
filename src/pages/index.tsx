import { CreateTask } from "~/components/CreateTask";
import { Tasks } from "~/components/Tasks";



export default function Home() {
    return (
        <>
            <main className="m-4">
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <CreateTask />
                    <Tasks />
                </div>
            </main>
        </>
    );
}
