/**
 * Created by amira on 24/3/15.
 */


var DOWN_ARROW = 40;
var RIGHT_ARROW = 39;
var LEFT_ARROW = 37;
var UP_ARROW = 38;

class Component{
  run(domElement){
    this.domElement = domElement;
    this.gameStateSubject = new Rx.BehaviorSubject({
      highScore : 0,
      score : 0,
      running : undefined
    });
    React.render(<Tetrix input={this.gameStateSubject} newGame={this.newGame.bind(this)}/>, domElement);
  }

  newGame(){
    document.onkeydown = this.handleKeyDown.bind(this);
    this.game = new Game(10, 20);
    this.tickHandle = setInterval(this.tick.bind(this), 500);
    this.gameStateSubject.onNext({
      score : 0,
      running : this.game.state
    });
  }

  gameOver(){
    clearInterval(this.tickHandle);
    var game = this.game;
    this.gameStateSubject.onNext(function(previousState, currentProps) {
      return {
        highScore: Math.max(previousState.score, game.score),
        score : game.score
      };
    });
  }

  handleKeyDown(e){
    // resolve key and call game methods
    e = e || window.event;
    console.log("keyCode", e.keyCode);
    switch(e.keyCode){
      case DOWN_ARROW :
        this.game.moveDown();
        break;
      case RIGHT_ARROW :
        this.game.moveRight();
        break;
      case LEFT_ARROW :
        this.game.moveLeft();
        break;
      case UP_ARROW:
        this.game.rotate();
        break;
    }
    this.gameStateSubject.onNext({
      running : this.game.state
    });
  }

  tick() {
    // advance game tick
    this.game.tick();
    if (this.game.didGameEnd()){
      this.gameOver();
    } else {
      this.gameStateSubject.onNext({
        running: this.game.state
      });
    }
  }

}


$(function(){
  var instance = new Component();
  instance.run(document.getElementById('content'));
});
