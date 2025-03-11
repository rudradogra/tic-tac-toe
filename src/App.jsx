import { useState } from 'react';
import './App.css';
import Confetti from 'react-confetti';
import { useEffect } from 'react';

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}>{value}</button>;
}


 function Board({currentPlayer,squares,onPlay,restartGame}) {
  const [gameOver, setGameOver] = useState(false);
  function handleClick(i){
    if(squares[i] || calculateWinner(squares)){
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = currentPlayer;
    onPlay(nextSquares);
  }
  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every(square => square !== null);

  useEffect(() => {
    if (winner || isDraw) {
      setGameOver(true);
    } else {
      setGameOver(false);
    }
  }, [winner, isDraw]);

  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (isDraw) {
    status = "It's a Draw!";
  } else {
    status = `Next player: ${currentPlayer}`;
  }
  


  return (
    <>
      {winner && <Confetti />}
      <div className='status'>{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
      {gameOver && (
        <div className='popUp'>
        <h2>{winner ? `Congratulations ${winner}!!` : "It's a Draw!"}</h2>
        <button onClick={restartGame}>Play again</button>
        </div>
      )}
    </>
  );
}

export default function Game() {
  const players = ["X", "O", "I"];
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const currentSquares = history[history.length - 1];
  const currentPlayer = players[history.length % 3];

  function handlePlay(nextSquares){
    setHistory([...history,nextSquares]);
  }

  function jumpTo(moves){
    setHistory(history.slice(0,moves + 1));
  }
  function restartGame(){
    setHistory([Array(9).fill(null)]);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });


return (
  <div className='game'>
    <div className='game-board'>
      <Board currentPlayer={currentPlayer} squares={currentSquares} onPlay = {handlePlay} restartGame={restartGame}/>
    </div>
    <div className="game-info">
        <ol>{moves}</ol>
      </div>
  </div>
)
}
function calculateWinner(squares){
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
  ];
  for(let i = 0; i < lines.length; i++){
    const[a,b,c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
      return squares[a];
    }
  }
  return null;
}