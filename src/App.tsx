```tsx
import React, { useState, useEffect } from 'react';

type CellState = 'open' | 'closed' | 'flagged' | 'mine';

interface Cell {
  state: CellState;
  isMine: boolean;
  adjacentMines: number;
}

const App = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);

  const initializeGrid = (rows: number, cols: number, mines: number) => {
    const newGrid: Cell[][] = [];
    const minePositions: [number, number][] = [];

    // Generate mine positions
    while (minePositions.length < mines) {
      const row = Math.floor(Math.random() * rows);
      const col = Math.floor(Math.random() * cols);
      if (!minePositions.some(([r, c]) => r === row && c === col)) {
        minePositions.push([row, col]);
      }
    }

    // Initialize grid
    for (let row = 0; row < rows; row++) {
      newGrid[row] = [];
      for (let col = 0; col < cols; col++) {
        const isMine = minePositions.some(([r, c]) => r === row && c === col);
        newGrid[row][col] = {
          state: 'closed',
          isMine,
          adjacentMines: 0,
        };
      }
    }

    // Calculate adjacent mines
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (!newGrid[row][col].isMine) {
          let adjacentMines = 0;
          for (let r = Math.max(0, row - 1); r <= Math.min(rows - 1, row + 1); r++) {
            for (let c = Math.max(0, col - 1); c <= Math.min(cols - 1, col + 1); c++) {
              if (newGrid[r][c].isMine) {
                adjacentMines++;
              }
            }
          }
          newGrid[row][col].adjacentMines = adjacentMines;
        }
      }
    }

    setGrid(newGrid);
  };

  useEffect(() => {
    initializeGrid(10, 10, 10);
  }, []);

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || win) return;

    const newGrid = [...grid];
    const cell = newGrid[row][col];

    if (cell.state === 'closed') {
      if (cell.isMine) {
        setGameOver(true);
      } else {
        openCells(newGrid, row, col);
        setGrid(newGrid);
        checkWin(newGrid);
      }
    }
  };

  const openCells = (grid: Cell[][], row: number, col: number) => {
    const rows = grid.length;
    const cols = grid[0].length;

    const openCell = (r: number, c: number) => {
      if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c].state !== 'closed') return;

      grid[r][c].state = 'open';

      if (grid[r][c].adjacentMines === 0) {
        openCell(r - 1, c - 1);
        openCell(r - 1, c);
        openCell(r - 1, c + 1);
        openCell(r, c - 1);
        openCell(r, c + 1);
        openCell(r + 1, c - 1);
        openCell(r + 1, c);
        openCell(r + 1, c + 1);
      }
    };

    openCell(row, col);
  };

  const checkWin = (grid: Cell[][]) => {
    const closedCells = grid.flat().filter((cell) => cell.state === 'closed');
    if (closedCells.length === 10) {
      setWin(true);
    }
  };

  const handleRightClick = (row: number, col: number, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const newGrid = [...grid];
    const cell = newGrid[row][col];

    if (cell.state === 'closed') {
      cell.state = 'flagged';
    } else if (cell.state === 'flagged') {
      cell.state = 'closed';
    }

    setGrid(newGrid);
  };

  const renderCell = (row: number, col: number) => {
    const cell = grid[row][col];

    return (
      <div
        key={`${row}-${col}`}
        className={`cell ${cell.state}`}
        onClick={() => handleCellClick(row, col)}
        onContextMenu={(e) => handleRightClick(row, col, e)}
      >
        {cell.state === 'open' && (cell.adjacentMines > 0 ? cell.adjacentMines : '')}
        {cell.state === 'flagged' && '🚩'}
        {cell.state === 'open' && cell.isMine && '💣'}
      </div>
    );
  };

  return (
    <div className="minesweeper">
      {gameOver && <div>Game Over</div>}
      {win && <div>You Win!</div>}
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
```

This is a basic implementation of a Minesweeper game using React and TypeScript. It includes functionality for initializing the grid with mines, opening cells, flagging cells, and detecting game over and win conditions. The component renders a grid of cells with mines and adjacent mine counts. You can click on cells to open them and right-click to flag/unflag them.

Note: This implementation does not include any styling or additional features like a reset button or difficulty levels. It's a basic functional component to demonstrate the core logic of the game.