import React from 'react';

class Stopwatch extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentTime: new Date()
    };
    
  }
  
  componentDidMount() {
    this.timerID = setInterval(
    () => this.tick(), 
    10
    );
  }
  
  componentWillUnmount() {
    clearInterval(this.timeID);
  }
  
  tick() {
    this.setState({
      currentTime: new Date(),
    });
  }
  
  render() {
    const timeElapsed = this.state.currentTime - this.props.startTime;
    let milliSeconds = timeElapsed % 1000;
    let seconds = Math.floor(timeElapsed / 1000 % 60).toString().padStart(2, 0);
    let minutes = Math.floor(timeElapsed / 60000).toString().padStart(2,0);
    return (
      <div>
        <p>
          {minutes}:{seconds}:{milliSeconds}
        </p>
        <p>
          
        </p>
      </div>
    );
  }
}

export default Stopwatch;