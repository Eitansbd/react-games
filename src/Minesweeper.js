import React from 'react';
import GameBoard from './GameBoard';
import GameDifficulty from './GameDifficulty'

class Minesweeper extends React.Component {
  constructor(props) {
    super(props);
    
    const stateObj = this.newGameState();
    
    this.state = stateObj;
  }
  
  newGameState(difficulty = "easy"){
    let numOfRows, numOfCols, bombPercentage;
    if (difficulty === "easy") {
      numOfRows = numOfCols = 10;
      bombPercentage = 0.2;
    } else if (difficulty === "medium") {
      numOfRows = numOfCols = 15;
      bombPercentage = 0.25;
    } else if (difficulty === "hard") {
      numOfRows = numOfCols = 20;
      bombPercentage = 0.4;
    }
    
    let board = [];
    for (let i = 0; i < numOfRows; i++) {
      let row = [];
      for (let i = 0; i < numOfCols; i++) {
        const bomb = (bombPercentage > Math.random());
        const marker = bomb ? "*" : " ";
        row.push(marker);
      }
      board.push(row);
    }
    
    let visibleBoard = Array(numOfRows).fill(null).map(() => Array(numOfCols).fill(null));
    
    return ({ 
      board: board,
      visibleBoard: visibleBoard,
      visibleBoardHistory: [],
      moveNumber: 0,
      gameOver: false,
      difficulty: difficulty,
    });
  }
  
  surroundingSquares(row_index, col_index){
    let surroundingSquares = [];
    
    for (let i of [-1, 0, 1]) {
      if (row_index + i >= 0 && row_index + i < this.state.board.length) {
        for (let j of [-1, 0, 1]) {
          if (col_index + j >= 0 && col_index + j < this.state.board[0].length) {
            if (i !== 0 || j !== 0)
              surroundingSquares.push([row_index + i, col_index + j]);
          }
        }
      }
    }
     
    return surroundingSquares;
  }
  
  surroundingBombsCount(row_index, col_index) {
    const surroundingSquares = this.surroundingSquares(row_index, col_index);
    let count = 0;
    
    for (let [row_i, col_i] of surroundingSquares) {
      if (this.state.board[row_i][col_i] === "*") {
        count += 1;
      }
    }
    return count;
    
  }
  
  boardFull(){
    for (let row of this.state.visibleBoard) {
      for (let marker of row){
        if (!marker) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  playerWon(visibleBoard){
    for (let row_index in this.state.board){
      for (let col_index in this.state.board[row_index]){
        const marker = this.state.board[row_index][col_index];
        const visibleMarker = visibleBoard[row_index][col_index];
        if (marker !== "*" && !/[0-9]/.test(visibleMarker)) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  handleBombGuess(row_index, col_index){
    let visibleBoard = [];
    for(let i in this.state.visibleBoard) {
      visibleBoard.push(this.state.visibleBoard[i].slice());
    }
    
    visibleBoard[row_index][col_index] = visibleBoard[row_index][col_index] ? null : "-";
    
    this.setState({
      visibleBoard: visibleBoard,
    });
  }
  
  markSquareSurroundingBombCount(board, row_index, col_index){
    const surroundingBombs = this.surroundingBombsCount(row_index, col_index);
    board[row_index][col_index] = surroundingBombs;
      
      if (surroundingBombs === 0){
        const surroundingSquares = this.surroundingSquares(row_index, col_index);
        for (let [row_i, col_i] of surroundingSquares) {
          if (board[row_i][col_i] === null){
            board = this.markSquareSurroundingBombCount(board, row_i, col_i);
          }
        }
      }
      
    return board;
  }
  
  handleSafeGuess(row_index, col_index) {
    if (this.state.board[row_index][col_index] === "*") {
      let visibleBoard = [];
      for(let i in this.state.visibleBoard) {
        visibleBoard.push(this.state.visibleBoard[i].slice());
      }
      
      for(let i in visibleBoard) {
        for(let j in visibleBoard[i]){
          if (this.state.board[i][j] === "*") {
            visibleBoard[i][j] = "*";
          }
        }
      }
      
      this.setState({
        gameOver: true,
        visibleBoard: visibleBoard,
      });
    } else { 
      let visibleBoard = [];
      for(let i = 0; i < this.state.visibleBoard.length; i++) {
        visibleBoard.push(this.state.visibleBoard[i].slice());
      }
      
      visibleBoard = this.markSquareSurroundingBombCount(visibleBoard, row_index, col_index);
      
      this.setState({
        visibleBoard: visibleBoard,
      });
     
      if (this.boardFull() || this.playerWon(visibleBoard)){
        this.setState({
          gameOver: true,
        });
      }
    }
    
    
  }
  
  handleClick(e, row_index, col_index) {
 
    const markerClicked = this.state.visibleBoard[row_index][col_index];
    if (this.state.gameOver || (markerClicked && markerClicked !== "-")) {
      return;
    }
    
    if (e.shiftKey) {
      this.handleBombGuess(row_index, col_index);
    } else {
      this.handleSafeGuess(row_index, col_index);
    } 
    
    let visibleBoardHistory = this.state.visibleBoardHistory.slice();
    visibleBoardHistory.push(this.state.visibleBoard)
    
    this.setState({
      visibleBoardHistory: visibleBoardHistory,
    });
    
  }
  
  resetGame(){
    const newGameState = this.newGameState(this.state.difficulty); 
    this.setState(
      newGameState
    );
  }
  
  undoMove(){
    if (!this.state.visibleBoardHistory.length) {
      return;
    }
    
    const numOfMoves = this.state.visibleBoardHistory.length;
    const previousVisibleBoard = this.state.visibleBoardHistory[numOfMoves - 1];
    const visibleBoardHistory = this.state.visibleBoardHistory.slice(0, numOfMoves - 1);
    
    this.setState({
      visibleBoardHistory: visibleBoardHistory,
      visibleBoard: previousVisibleBoard,
      gameOver: false,
    });
  }
  
  handleChangeDifficulty(e) {
    const newGameState = this.newGameState(e.target.value);
    
    this.setState(
      newGameState
    ) ;
  }
  
  render() {
    const visibleBoard = this.state.visibleBoard;
    let status;
    if (this.state.gameOver) {
      if (this.playerWon(visibleBoard)) {
        status = "Congrats! You won!";
      } else {
        status = "Sorry! Try again!";
      }
    } else {
      status = "Click on the safe tiles. Shift + Click to mark as a bomb";
    }
    return (
      <div className="container top-margin">
        <div className="row">
          <div className="col-md-auto game-board">
            <GameBoard 
              visibleBoard={visibleBoard} 
              onClick={(e, row_index, col_index) => this.handleClick(e, row_index, col_index)}
             />
          </div>
          <div className="col-md-auto">
            <div className="row">
              <div>
                <p>{status}</p>
              </div>
            </div>
            <div className="row">
              <GameDifficulty 
                difficulty = {this.state.difficulty}
                onChangeDifficulty={(e) => this.handleChangeDifficulty(e)}/>
            </div>
            <div className="row">
              <div className="btn-group">
                <button 
                  onClick={(()=> this.undoMove())}
                  className="btn btn-primary"
                >Back
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={(()=> this.resetGame())}
                >New Game
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    );
  }
}

export default Minesweeper;