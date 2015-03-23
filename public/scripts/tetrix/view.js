/**
 * Created by amira on 22/3/15.
 */



// ui elements

class StartGame extends React.Component {
  constructor(props) {
    super(props);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onStartGame();
  }
  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="submit" value="Start!" />
      </form>
    );
  }
}

class GameScreen extends React.Component {
  constructor(){

  }
}

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highScore : props.highScore || 0,
      latestScore : 0,
      running : null
    };
  }
  handleStartGame(){
    this.setState({
      highScore: this.state.highScore,
      latestScore : 0,
      running : new Game(),
      tickHandle : setInterval(this.tick.bind(this), 500) // override from props?
    });
  }
  handleKeyPress(e){
    // TODO resolve key and call game methods
    this.forceRender();
  }
  tick() {
    // advance game tick
    this.state.running.tick();
    this.forceRender();
  }
  render() {
    return (
      <div>
        <h1>Tetris</h1>
        <h2>highScore : {this.state.highScore} | score : {this.state.running ?  this.state.running.score : this.state.latestScore}</h2>
        <div className="mainGame">
        {this.state.running ? <GameScreen onkeyPress={handleKeyPress} game={this.state.running.state}/> : <StartGame onStartGame={this.handleStartGame}/>}
        </div>
      </div>
    );
  }
}


React.render(
  <Main/>,
  document.getElementById('content')
);
