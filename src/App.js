import { useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function BoardRow({ squares, rowIndex, handleClick }) {
  const spaceArray = [];

  for (let i = 0; i < 3; i++) {
    const squareNumber = rowIndex * 3 + i;

    spaceArray.push(
      <Square
        value={squares[i]}
        onSquareClick={() => handleClick(squareNumber)}
        key={squareNumber}
      />,
    );
  }
  return spaceArray;
}

function BoardGrid({ boardSquares, handleClick }) {
  const rowArray = [];

  for (let i = 0; i < 3; i++) {
    const rowStartingSquare = i * 3;
    rowArray.push(
      <div key={i}>
        <BoardRow
          squares={boardSquares.slice(rowStartingSquare, rowStartingSquare + 3)}
          rowIndex={i}
          handleClick={handleClick}
        />
      </div>,
    );
  }

  return rowArray;
}

export function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }
  const winner = calculateWinner(squares);

  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <BoardGrid boardSquares={squares} handleClick={handleClick} />
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    const buttonOrMessage =
      move < history.length - 1 ? (
        <button onClick={() => jumpTo(move)}>{description}</button>
      ) : (
        <div>{`You are at move #${move}`}</div>
      );

    return <li key={move}>{buttonOrMessage}</li>;
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
