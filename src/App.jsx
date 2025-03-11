import { useState } from 'react';
import './App.css';
import Confetti from 'react-confetti';

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}

function Board({ currentPlayer, squares, onPlay, restartGame }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return;
    const nextSquares = squares.slice();
    nextSquares[i] = currentPlayer;
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square !== null);
  const status = winner
    ? `Winner: ${winner}`
    : isDraw
    ? "It's a Draw!"
    : `Next player: ${currentPlayer}`;

  return (
    <>
      {winner && <Confetti />}
      <div className='status'>{status}</div>
      <div className="board">
        {squares.map((value, i) => (
          <Square key={i} value={value} onSquareClick={() => handleClick(i)} />
        ))}
      </div>
      {(winner || isDraw) && (
        <div className='popUp'>
          <h2>{winner ? `Congratulations ${winner}!!` : "It's a Draw!"}</h2>
          <button onClick={restartGame}>Play again</button>
        </div>
      )}
    </>
  );
}

export default function Game() {
  const gridSize = 5; // 5x5 grid
  const players = ["X", "O", "I"];
  const [history, setHistory] = useState([Array(gridSize * gridSize).fill(null)]);
  const currentSquares = history[history.length - 1];
  const currentPlayer = players[history.length % players.length];

  function handlePlay(nextSquares) {
    setHistory([...history, nextSquares]);
  }

  function jumpTo(move) {
    setHistory(history.slice(0, move + 1));
  }

  function restartGame() {
    setHistory([Array(gridSize * gridSize).fill(null)]);
  }

  return (
    <div className='game'>
      <div className='game-board'>
        <Board currentPlayer={currentPlayer} squares={currentSquares} onPlay={handlePlay} restartGame={restartGame} />
      </div>
      <div className="game-info">
        <ol>
          {history.map((_, move) => (
            <li key={move}>
              <button onClick={() => jumpTo(move)}>
                {move ? `Go to move #${move}` : "Go to game start"}
              </button>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const gridSize = 5;
  const lines = [];

  // Rows & Columns (Check for three consecutive)
  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j <= gridSize - 3; j++) {
      lines.push([i * gridSize + j, i * gridSize + j + 1, i * gridSize + j + 2]); // Rows
      lines.push([j * gridSize + i, (j + 1) * gridSize + i, (j + 2) * gridSize + i]); // Columns
    }
  }

  // Diagonals (Check for three consecutive)
  for (let i = 0; i <= gridSize - 3; i++) {
    for (let j = 0; j <= gridSize - 3; j++) {
      lines.push([i * gridSize + j, (i + 1) * gridSize + j + 1, (i + 2) * gridSize + j + 2]); // Main diagonal
      lines.push([(i + 2) * gridSize + j, (i + 1) * gridSize + j + 1, i * gridSize + j + 2]); // Anti-diagonal
    }
  }

  // Check if all four corners are filled
  const cornersFilled = squares[0] && squares[gridSize - 1] && squares[gridSize * (gridSize - 1)] && squares[gridSize * gridSize - 1];

  // Check for a winning line
  for (const line of lines) {
    if (line.every(index => squares[index] && squares[index] === squares[line[0]])) {
      return cornersFilled ? squares[line[0]] : null; // Winner only if corners are filled
    }
  }

  return null;
}

