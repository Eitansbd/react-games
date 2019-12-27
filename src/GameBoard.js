import React from 'react';
import Square from './Square';

class GameBoard extends React.Component {
  renderSquare(row_index, col_index) {
    let marker = this.props.visibleBoard[row_index][col_index];

    return (<Square 
      key={col_index}  
      marker={marker} 
      onClick={(e) => {this.props.onClick(e, row_index, col_index)}} 
    />); 
  }
  
  render() {
    return(
      this.props.visibleBoard.map((row, row_index) => {
        return(
          <div key={row_index} className="board-row">
            {row.map((col, col_index) => {
              return(
                this.renderSquare(row_index, col_index)
              ); 
            })}
          </div>
        );
      }) 
    );
  }
}

export default GameBoard;