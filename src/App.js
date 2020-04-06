import React, { useState, useRef, useCallback } from 'react';
import produce from 'immer';
const numRows = 20;
const numCols = 20;
// for find neighbout vals
const operations = [ [ 0, 1 ], [ 0, -1 ], [ 1, -1 ], [ -1, 1 ], [ 1, 1 ], [ -1, -1 ], [ 1, 0 ], [ -1, 0 ] ];
const generateEmptyGrid = () => {
  //
  const rows = [];
  //
  for (let i = 0; i < numRows; i++) {
    //
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
  //
  // React.useState(Array.from({length: ROWS}).map(() => Array.from({length: COLUMNS}).fill(0)))
  // Array(numCols).fill(0) would also work
};
//
const generateRandomGrid = () => {
  const rows = [];
  const prob = 0.5;
  for (let i = 0; i < numRows; i++) {
    //
    rows.push(Array.from(Array(numCols), () => (Math.random() > prob ? 1 : 0)));
  }
  return rows;
};

function App() {
  // using function init state, only runs once on init.
  const [ grid, setGrid ] = useState(() => generateEmptyGrid());
  //
  const [ running, setRunning ] = useState(false);
  // store as ref so callback always refers to current value whilst also not needing to pass deps
  const runningRef = useRef(running);
  runningRef.current = running;
  //
  const runSimulation = useCallback(() => {
    if (!runningRef.current) return;
    // simulate https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
    setGrid(gCurrent => {
      return produce(gCurrent, gCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbours = 0;
            //
            operations.forEach(([ x, y ]) => {
              const newI = i + x;
              const newK = k + y;
              // check grid boundries
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbours += gCurrent[newI][newK];
              }
            });
            // life logic
            if (neighbours < 2 || neighbours > 3) {
              // kill. rules 1 & 3
              gCopy[i][k] = 0;
            } else if (gCurrent[i][k] === 0 && neighbours === 3) {
              // rule 4
              gCopy[i][k] = 1;
              // notice- rule2 does nothing
            }
          }
        }
      });
    });
    //  typical situation for the effect hook with cleanup logic.
    // recursive
    setTimeout(runSimulation, 1000);
  }, []);
  return (
    // onclick has to be in lamda or creates infinte loop
    <React.Fragment>
      <div className="App-header">
        <button
          onClick={() => {
            setRunning(!running);
            // race condition
            if (!running) {
              runningRef.current = true;
              runSimulation();
            }
          }}
        >
          {' '}
          {running ? 'stop' : 'start'}
        </button>
        <button onClick={() => setGrid(generateEmptyGrid())}>Clear</button>
        <button onClick={() => setGrid(generateRandomGrid())}>random</button>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numCols}, 20px)`
          }}
        >
          {grid.map((rows, i) =>
            rows.map((col, k) => (
              <div
                onClick={() => {
                  // use immmer to not mutate state
                  const newGrid = produce(grid, gridCopy => {
                    // toggle
                    gridCopy[i][k] = gridCopy[i][k] ? 0 : 1;
                  });
                  //
                  setGrid(newGrid);
                }}
                key={`${i}-${k}`}
                style={{
                  width: 20,
                  height: 20,
                  backgroundColor: grid[i][k] ? 'rebeccapurple' : '#d4b1ce',
                  border: 'solid 1px #d6b8da'
                }}
              />
            ))
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

/* world where the edges consider the other side neighbours 
      (otherwise the edges never change) then you can do it really neatly using modulus like this:
      const countNeighbors = (grid: any, x: number, y: number) => {
        return operations.reduce((acc, [i, j]) => {
          const row = (x + i + numRows) % numRows;
          const col = (y + j + numCols) % numCols;
          acc += grid[row][col];
          return acc;
        }, 0);
      };
      */

export default App;
