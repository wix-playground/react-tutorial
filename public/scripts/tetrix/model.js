/**
 * Created by amira on 22/3/15.
 */

// domain model

var layouts = [
  [ [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0] ],

  [ [1,1,0,0],
    [0,1,0,0],
    [0,1,0,0],
    [0,1,0,0] ],

  [ [0,0,1,1],
    [0,0,1,0],
    [0,0,1,0],
    [0,0,1,0] ],

  [ [0,0,0,0],
    [1,1,1,0],
    [0,1,0,0],
    [0,0,0,0] ],

  [ [0,1,0,0],
    [1,1,1,0],
    [0,1,0,0],
    [0,0,0,0] ],

  [ [0,0,0,0],
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0] ],

  [ [0,0,0,0],
    [0,0,1,1],
    [0,1,1,0],
    [0,0,0,0] ],

  [ [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0] ]
];

var colors = [
  'green', 'red', 'grey'
];

function randomShape(width) {
 var layout = layouts[Math.floor(Math.random()*layouts.length)];
 var color = colors[Math.floor(Math.random()*colors.length)];
  var position = {
    x : Math.floor(width / 2) - 2,
    y : -4
  };
  return new Shape(layout, color, position);
}

// immutable data type
class Shape {
  constructor(layout, color, position){
    this.layout = layout;
    this.color = color;
    this.position = position;
  }


  rotate(){
    var layout = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
    for (var i = 0; i < 4; i++){
      for (var j = 0; j < 4; j++){
        layout[j][3-i] = this.layout[i][j];
      }
    }
    return new Shape(layout, this.color, this.position);
  }

  move(down, right){
    return new Shape(this.layout, this.color, { x : this.position.x + right, y : this.position.y + down});
  }

  getColorForPosition(row, col) {
    var ret = {
      x: col - this.position.x,
      y: row - this.position.y
    };
    if (!(ret.x < 0 || ret.x >= 4 || ret.y < 0 || ret.y >= 4) && this.layout[ret.y][ret.x]) {
      return this.color;
    }
    return null;
  }
}

class Grid {
  constructor(width, height) {
    this.boxes = _.map(new Array(height), () => new Array(width));
  }
  checkIfAllowed(shape){
    for (var i = 0; i < 4; i++){
      for (var j = 0; j < 4; j++){
        var x = shape.position.x + j;
        var y = shape.position.y + i;
        if (shape.layout[i][j] && y >= 0 &&  (x < 0 || y >= this.boxes.length || x >= this.boxes[0].length || this.boxes[y][x])) {
          return false;
        }
      }
    }
    return true;
  }

  land(shape){
    console.log('landing', shape);
    for (var i = 0; i < 4; i++){
      for (var j = 0; j < 4; j++){
        if (shape.layout[i][j]) {
          var x = shape.position.x + j;
          var y = shape.position.y + i;
          this.boxes[y][x] = shape.color;
        }
      }
    }
  }

  linesCheck(){
    var removed = _.remove(this.boxes,function(line){
      return _.every(line, function(elem){
        return !! elem;
      });
    }).length;
    for(var i=0; i<removed; i++) {
      this.boxes.unshift(new Array(this.boxes[0].length));
    }
    return removed;
  }


  getBox(col, row){
    if (row < 0 || row >= this.boxes.length || col < 0 || col >= this.boxes[0].length)
      return 0;
    return this.boxes[row][col];
  }
}


class Game {
  constructor(width, height){
    this.width = width;
    this.height = height;
    this.grid = new Grid(width, height);
    this.state = {
      width : this.width,
      height : this.height,
      getBox : this.getBox.bind(this)
    };
    this.shape = randomShape(width);
  }

  getBox(col, row) {
    return this.shape.getColorForPosition(row, col) || this.grid.getBox(col, row);
  }

  tick(){
    if (!this.ended && !this.__tryMove(1, 0)){
      this.grid.land(this.shape);
      this.grid.linesCheck();
      this.shape = randomShape(this.width);
      if (!this.grid.checkIfAllowed(this.shape)){
        // game over man
        this.ended = true;
      }
    }

    document.getElementById('debug').innerHTML = JSON.stringify(this, null, '\t');
  }
  didGameEnd(){
    return !!this.ended;
  }
  moveRight() {
    this.__tryMove(0, 1);
  }
  moveDown(){
    this.__tryMove(1, 0);
  }
  moveLeft(){
    this.__tryMove(0, -1);
  }

  rotate() {
    var newShape = this.shape.rotate(1);
    if (this.grid.checkIfAllowed(newShape)){
      this.shape = newShape;
    }
  }

  __tryMove(down, right) {
    var newShape = this.shape.move(down, right);
    if (this.grid.checkIfAllowed(newShape)){
      this.shape = newShape;
      return true;
    }
    return false;
  }
}


