import { CreateTask } from "~/components/CreateTask";
import { Tasks } from "~/components/Tasks";



export default function Home() {
    return (
        <>
            <main className="m-4">
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <h1 className="text-xl font-medium">
                        Techly.ai
                    </h1>
                    <div className="my-6">
                    <CreateTask />
                    </div>
                    <Tasks />
                </div>
            </main>
        </>
    );
}
