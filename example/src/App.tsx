import { useMemo, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import SharedWorker from "./worker/sharedWorker?sharedworker";
import { WorkerFetcher } from "../../dist";

function App() {
  const [count, setCount] = useState(0);
  const sharedWorker = useMemo(() => new SharedWorker(), []);
  const fetcher = useMemo(() => {
    const fetcher = new WorkerFetcher(sharedWorker.port);
    return fetcher;
  }, [sharedWorker]);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button
          onClick={() =>
            fetcher.fetch<number, number[]>(`add`, [count, 1]).then((sum) => {
              console.log(`received`);
              setCount(sum);
            })
          }
        >
          increment by shared worker {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
