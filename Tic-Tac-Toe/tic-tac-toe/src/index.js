import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button
            className={"square " + props.winningSquareClass}
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, winningSquare) {
        if(winningSquare) {
            return <Square
            key={i}
            winningSquareClass={'winningSquare'}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
        }

        return <Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {
        let rows = Array.from(Array(3));
        let cols = Array.from(Array(3));

        return (
            <div>
                {rows.map((item, row) => {
                    return <div key={row} className="board-row">
                        {cols.map((item, col) => {
                            let index = col + 3 * row;
                            if (this.props.winningSquares && this.props.winningSquares.includes(index)) {
                                return this.renderSquare(index, 'winnningSquare');
                            }
                            return this.renderSquare(index);
                        })}
                    </div>;
                })}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                row: null,
                col: null,
            }],
            IsXNext: true,
            stepNumber: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.IsXNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
                row: (i / 3).toFixed(0),
                col: i % 3,
            }]),
            IsXNext: !this.state.IsXNext,
            stepNumber: history.length
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            IsXNext: step % 2 === 0
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let status;

        if (winner && winner.draw) {
            status = "DRAW"
        } else if(winner){
            status = `Winner: ${winner.winnerSymbol}`;
        } else {
            status = `Next player: ${this.state.IsXNext ? 'X' : 'O'}`;
        }

        let moves = this.state.history.map((step, move) => {
            let description = move ?
                'Go to move #' + move + ` (${step.row},${step.col})` :
                'Go to game start';

            if (this.state.stepNumber === move) {
                return (
                    <li key={move}>
                        <button onClick={() => this.jumpTo(move)} className={'currentStep'}>{description}</button>
                    </li>
                );
            }
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{description}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    {
                        winner ?
                            <Board
                                winningSquares={winner.squares}
                                squares={current.squares}
                                onClick={(i) => this.handleClick(i)}
                            />
                            :
                            <Board
                                squares={current.squares}
                                onClick={(i) => this.handleClick(i)}
                            />
                    }
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
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
            return {
                winnerSymbol: squares[a],
                squares: lines[i],
                draw: false,
            }
        }
    }

    if(squares.filter(s => s != null).length === squares.length) {
        return {
            draw: true,
        }
    }
    return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

