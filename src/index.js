import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button
      className="square"
      onClick={() => props.onClick()}
      >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (<Square
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />
    );
  }

  render() {
    return (
      <div>
        <div className="status">{this.props.status}</div>
        <div className="game-grid">
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      </div>
    );
  }
}

class Controls extends React.Component {
  render() {
    return (
      <div className="controls">
        <button
          className="controls-button"
          onClick={() => this.props.resetGame()}
          >
            Restart
          </button>
        <button
          disabled={!this.props.peekHistory(-1)}
          className="controls-button"
          onClick={() => this.props.step(-1)}
          >
            Back
          </button>
        <button
          disabled={!this.props.peekHistory(1)}
          className="controls-button"
          onClick={() => this.props.step(1)}
          >
            Forward
          </button>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{squares: Array(9).fill(null)}],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  step(offset) {
    const stepNumber = this.state.stepNumber;
    if(stepNumber + offset >= 0 && stepNumber + offset < this.state.history.length) {
      this.setState({
        stepNumber: stepNumber + offset,
        xIsNext: (stepNumber % 2) === 1,
      })
    }
  }

  resetGame() {
    this.setState({
      history: [{squares: Array(9).fill(null)}],
      xIsNext: true,
      stepNumber: 0,
    });
  }

  peekHistory(offset) {
    const i = this.state.stepNumber + offset;

    return i >= 0 && i < this.state.history.length;
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const squares = history[history.length - 1].squares.slice();
    if(calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{squares: squares}]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let status;
    if(winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }



    return (
      <div className="game">
        <Board
          status={status}
          squares={current.squares}
          onClick={(i) => this.handleClick(i)}
        />
        <Controls
          step={(offset) => this.step(offset)}
          resetGame={() => this.resetGame()}
          peekHistory={(offset) => this.peekHistory(offset)}
        />
      </div>
    );
  }
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


// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
