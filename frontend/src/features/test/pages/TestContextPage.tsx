import { useTest } from "@/context/TestContext";
// import {useContext} from "react";
// import { TestContext } from "@/context/TestContext";


export default function TestContextPage() {
  const { name, setName } = useTest();
    // context = useContext(TestContext);

  console.log("TestContextPage render");
  console.log("Name inside page:", name);

  function handleChangeToNaruto() {
    console.log("Button clicked");
    console.log("Before update:", name);

    setName("Naruto");
  }

  function handleChangeToYounes() {
    console.log("Button clicked");
    console.log("Before update:", name);

    setName("Younes");
  }

  return (
    <div className="min-h-screen bg-[#10172a] p-10 text-white">
      <h1 className="mb-6 text-3xl font-bold">Context Test Page</h1>

      <p className="mb-6 text-lg">
        Current name from context: <span className="font-bold text-blue-400">{name}</span>
      </p>

      <div className="flex gap-4">
        <button
          onClick={handleChangeToNaruto}
          className="rounded-xl bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-500"
        >
          Change to Naruto
        </button>

        <button
          onClick={handleChangeToYounes}
          className="rounded-xl bg-green-600 px-4 py-3 font-semibold hover:bg-green-500"
        >
          Change to Younes
        </button>
      </div>
    </div>
  );
}