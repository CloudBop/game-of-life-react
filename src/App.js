import React, { useState } from 'react';
import produce from 'immer';
const numRows = 50;
const numCols = 50;

function App() {
  // using function init state, only runs once on init.
  const [ grid, setGrid ] = useState(() => {
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
    //
  });
  //
  return (
    <React.Fragment>
      <button>Start</button>
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
                backgroundColor: grid[i][k] ? 'pink' : '#f0f0f0',
                border: 'solid 1px black'
              }}
            />
          ))
        )}
      </div>
    </React.Fragment>
  );
}

export default App;
