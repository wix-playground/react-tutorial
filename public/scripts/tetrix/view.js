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
      <form onSubmit={this.handleSubmit.bind(this)}>
        <input type="submit" value="Start!" />
      </form>
    );
  }
}

var BOX_WIDTH = 10;
var BOX_HEIGHT = 10;

class GameScreen extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    var blocks = [];
    for (var row = 0; row < this.props.game.height; row++) {
      for (var col = 0; col < this.props.game.width; col++) {
        var box = this.props.game.getBox(col, row);
        if (box) {
          var style = {
            position : 'absolute',
            left : col * BOX_WIDTH + 'px',
            top : row * BOX_HEIGHT + 'px',
            width : BOX_WIDTH + 'px',
            height : BOX_HEIGHT + 'px',
            backgroundColor : box
          }
          blocks.push(<div style={style}/>);
        }
      }
    }

    var style = {
      position : 'relative',
      display : 'block',
      width : this.props.game.width * BOX_WIDTH + 'px',
      height : this.props.game.height * BOX_HEIGHT + 'px'
    }
    return (<div style={style}>
        {blocks}
    </div>);
  }
}

class Tetrix extends React.Component {
  constructor(props) {
    super(props);
    console.log(props);
    var _this = this;
    this.state = props.input.value;
    props.input.subscribe(
      function (s) {
        console.log('state: ' , s);
        _this.setState(s);
      },
      function (err) {
        console.log('Error: ' , err);
      },
      function () {
        console.log('Completed');
      }
    );
  }
  render() {
    return (
      <div>
        <h1>Tetris</h1>
        <h2>highScore : {this.state.highScore} | score : {this.state.running ?  this.state.running.score : this.state.score}</h2>
        <div className="mainGame">
        {this.state.running ? <GameScreen game={this.state.running}/> : <StartGame onStartGame={this.props.newGame}/>}
        </div>
      </div>
    );
  }
}
