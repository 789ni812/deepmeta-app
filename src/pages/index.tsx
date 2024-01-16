export default function Home() {
  return (
    <>
      <main className="m-4">
        {/* YOU CAN REMOVE CODE FROM HERE */}
        <div className="flex h-full w-full flex-col items-center justify-center">
          <h1 className="text-xl font-medium">
            Welcome To DeepMeta Assessment!
          </h1>
          <br />
          <p>
            1. Please read about the objectives of this assessment carefully,
            you can find them{" "}
            <span>
              <a
                href="https://github.com/DeepMetaGit/deepmeta_fullstack_assessment/blob/master/README.md"
                className="cursor-pointer underline"
              >
                here
              </a>
            </span>
            .
          </p>
          <br />
          <p>
            2. Start by editing
            <span className="asd mx-1 rounded-sm bg-slate-100 px-2 py-1">
              ./src/pages/index.tsx
            </span>{" "}
            file.
          </p>
          <br />
          <p>3. Have fun!</p>
        </div>
        {/* YOU CAN REMOVE CODE TILL HERE */}
      </main>
    </>
  );
}
