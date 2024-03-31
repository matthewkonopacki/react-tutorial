import { useState } from "react";

function Square({ value, onSquareClick, squareNumber, valueCallback }) {
  return (
    <button
      className="square"
      onClick={() => {
        onSquareClick();
        valueCallback(squareNumber);
      }}
    >
      {value}
    </button>
  );
}

function BoardRow({ squares, rowIndex, handleClick, valueCallback }) {
  const spaceArray = Array(3).fill(null);

  return spaceArray.map((space, spaceIndex) => {
    const squareNumber = rowIndex * 3 + spaceIndex;

    return (
      <Square
        value={squares[spaceIndex]}
        onSquareClick={() => handleClick(squareNumber)}
        squareNumber={squareNumber}
        key={squareNumber}
        valueCallback={valueCallback}
      />
    );
  });
}

function BoardGrid({ boardSquares, handleClick, valueCallback }) {
  const rowArray = Array(3).fill(null);
  return rowArray.map((row, rowIndex) => {
    const rowStartingSquare = rowIndex * 3;

    return (
      <div key={rowIndex}>
        <BoardRow
          squares={boardSquares.slice(rowStartingSquare, rowStartingSquare + 3)}
          rowIndex={rowIndex}
          handleClick={handleClick}
          valueCallback={valueCallback}
        />
      </div>
    );
  });
}

function MoveList({ jumpTo, history, rowAndColumn }) {
  const [reverse, setReverse] = useState(false);

  function reverseList() {
    setReverse(!reverse);
  }
  let moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    if (rowAndColumn[move]?.row != null && rowAndColumn[move]?.column != null) {
      description += ` (${rowAndColumn[move].row + 1}, ${rowAndColumn[move].column + 1})`;
    }

    const buttonOrMessage =
      move < history.length - 1 ? (
        <button onClick={() => jumpTo(move)}>{description}</button>
      ) : (
        <div>{`You are at move #${move + 1}`}</div>
      );

    return <li key={move}>{buttonOrMessage}</li>;
  });

  if (reverse) {
    moves = moves.reverse();
  }

  return (
    <>
      <button
        className="reverse-button"
        onClick={() => {
          reverseList();
        }}
      >
        Reverse List
      </button>
      <ol>{moves}</ol>
    </>
  );
}

export function Board({
  currentMove,
  xIsNext,
  squares,
  onPlay,
  valueCallback,
}) {
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
  } else if (winner == null && currentMove === 9) {
    status = "It's a draw.";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <BoardGrid
        boardSquares={squares}
        handleClick={handleClick}
        valueCallback={valueCallback}
      />
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [rowAndColumn, setRowAndColumn] = useState([]);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setHistory([...history].slice(0, nextMove + 1));
    setCurrentMove(nextMove);
    setRowAndColumn(rowAndColumn.slice(0, nextMove));
  }

  function setCurrentMoveRowAndColumn(spaceNumber) {
    setRowAndColumn([
      ...rowAndColumn,
      {
        row: Math.trunc(spaceNumber / 3),
        column: spaceNumber % 3,
      },
    ]);
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          currentMove={currentMove}
          xIsNext={xIsNext}
          squares={currentSquares}
          onPlay={handlePlay}
          valueCallback={setCurrentMoveRowAndColumn}
        />
      </div>
      <div className="game-info">
        <MoveList
          history={history}
          jumpTo={jumpTo}
          rowAndColumn={rowAndColumn}
        ></MoveList>
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
