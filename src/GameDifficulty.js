import React from 'react';

class GameDifficulty extends React.Component {
  renderDifficultyButton(difficulty) {
    return(
      <div className="form-check">
        <label className="form-check-label">
        <input
          className="form-check-input"
          type="radio"
          value={difficulty}
          checked={this.props.difficulty === difficulty}
          onChange={this.props.onChangeDifficulty}
        />
        {difficulty}
        </label>
      </div>
    );
  }
  render() {
    return (
      <div>
        {this.renderDifficultyButton("easy")}
        {this.renderDifficultyButton("medium")}
        {this.renderDifficultyButton("hard")}
      </div>
    );
  }
}

export default GameDifficulty;