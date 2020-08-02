import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

const numRows = 38;
const numCols = 80;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const App: React.FC = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);
  const [colors] = useState(["red", "blue", "purple", "yellow", "green"])
  const [speed] = useState({
    rate: 100
  })
  let [counter, setCounter] = useState(0);

  const runningRef = useRef(running);
  runningRef.current = running;

  const counterRef = useRef(counter);
  counterRef.current = counter;


  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(() => {          
      runSimulation()
      setCounter(counterRef.current += 1);
    }, speed.rate);;
  }, []);

  const changeBg = () => {
    const color = colors 
    if (color.length <= 0){
      return
    }
    else if (color.length > 0){
      const randomColor = color[Math.floor(Math.random() * color.length)];
      return randomColor
    }
    else {
      return "blue"
    }
  }

  return (
    <div style={{
      backgroundColor: "rgb(4,3,20)",
      backgroundImage: "radial-gradient(circle, rgba(4,3,20,1) 0%, rgba(232,232,204,1) 60%, rgba(0,212,255,1) 100%)",
      padding: "1.2% 0%"
    }}>
      <div style={{
        textAlign: "center"
      }}>
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {running ? "stop" : "start"}
        </button>
        <button
          onClick={() => {
            speed.rate = 2000
          }}
        >
          slow
        </button>
        <button
          onClick={() => {
            speed.rate = 1000
          }}
        >
          medium
        </button>
        <button
          onClick={() => {
            speed.rate = 100
          }}
        >
          fast
        </button>
        <button
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
              );
            }

            setGrid(rows);
          }}
        >
          random
        </button>
        <button
          onClick={() => {
            setGrid(generateEmptyGrid());
            setTimeout(() => {          
              setCounter(0);
              }, 100);
          }}
        >
          clear
        </button>
      </div>
      <div>
        Generation: {counterRef.current}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
          background: "white",
          margin: "0% 8%"
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                if (runningRef.current === false){
                const newGrid = produce(grid, gridCopy => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);}
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][k] ? changeBg() : "white",
                border: "solid 1px black"
              }}
            />
          ))
        )}
      </div>
      <div style={{
        textAlign: "center",
        margin: "1% 0% 0%"
      }}>
        <a href="https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life">What is Game of Life?</a>
      </div>
    </div>
  );
};

export default App;