import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

const numRows = 39;
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
      <div style={{
        textAlign: "center",
        margin: "0.5% 0%"
      }}>
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
        <h2>What is Game of Life?</h2>
        <br/>
        <h3>Brief History of Conway's Game of Life</h3>
        <p>The Game of Life, created by mathematician John Horton Conway, first appeared in the October 1970 edition of Scientific American. The rules of this single-person logic game are very simple, as we'll see below, but often lead to very surprising results. Conway originally recommended playing the game using tokens on a flat game board that was just a square grid. This method is fine for keeping track of starting positions of up to four initial counters and most of the patterns with five counters. However, with more counters this method doesn't work as well.</p>
        <p>As personal computers became more popular, interest in the playing the electronic game grew, allowing for investigation of increasingly complex initial set-ups. Today there are online communities of players, programmers, and enthusiasts continuing to investigate the complexities these simple rules create. Let's take a closer look.</p>
        <br/>
        <h3>Rules for Conway's Game of Life</h3>
        <p>At the heart of this game are four rules that determine if a cell is live or dead. All depend on how many of that cell's neighbors are alive.</p>
        <ul>
          <li>Births: Each dead cell adjacent to exactly three live neighbors will become live in the next generation.</li>
          <li>Death by isolation: Each live cell with one or fewer live neighbors will die in the next generation.</li>
          <li>Death by overcrowding: Each live cell with four or more live neighbors will die in the next generation. </li>
          <li>Survival: Each live cell with either two or three live neighbors will remain alive for the next generation.</li>
        </ul>
        <p>Another important fact about the rules for the game of life is that all rules apply to all cells at the same time. </p>
      </div>
    </div>
  );
};

export default App;