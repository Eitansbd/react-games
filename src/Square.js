import React from 'react';

class Square extends React.Component {
  render() {
    const marker = this.props.marker;
    let classes = "btn square ";
    if (marker === "*") {
      classes += "bomb";
    } else if (/([0-9]|-)/.test(marker)) {
      classes += "clicked";
    }
    
    return(
      <button 
        className={classes}
        onClick={this.props.onClick}>
        {marker}
      </button>
    );
  } 
}

export default Square