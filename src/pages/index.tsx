import { CreateTask } from "~/components/CreateTask";
import { Tasks } from "~/components/Tasks";
import { TestSorting } from "../components/TestSorting"


export default function Home() {
    return (
        <>
            <main className="m-4">
                <div className="flex h-full w-full flex-col items-center justify-center">
                    <h1 className="text-xl font-medium">
                        Techly.ai
                    </h1>
                    <CreateTask />
                    <TestSorting />
                </div>
            </main>
        </>
    );
}
