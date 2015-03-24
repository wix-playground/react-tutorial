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
    x : Math.floor(width / 2),
    y : 0
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


  rotate(direction){
    var layout = [[0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0]];
    for (var i = 0; i < 4; i++){
      for (var j = 0; j < 4; j++){
        layout[(j * direction + 4) % 4][(i * -1 * direction + 4) % 4] = this.layout[i][j];
      }
    }
    return new Shape(layout, color, position);
  }

  move(down, right){
    return new Shape(this.layout, this.color, { x : this.position.x + down, y : this.position.y + right});
  }

  getColorForPosition(row, col) {
    var ret = {
      x: col - this.position.x + 2,
      y: row - this.position.y + 2
    };
    if (!(ret.x < 0 || ret.x >= 4 || ret.y < 0 || ret.y >= 4) && this.layout[ret.x][ret.y]) {
      return this.color;
    }
    return null;
  }
}

class Grid {
  constructor(width, height) {
    this.boxes = _.map(new Array(height + 4), () => new Array(width));
  }
  checkIfAllowed(shape){
    for (var i = 0; i < 4; i++){
      for (var j = 0; j < 4; j++){
        var x = shape.position.x - 2 + j;
        var y = shape.position.y - 2 + i;
        return !shape.layout[i][j] || (x >= 0 && y >= 0 && x < boxes.length && y < boxes[0].length && !boxes[x][y]);
      }
    }
  }

  land(shape){
    for (var i = 0; i < 4; i++){
      for (var j = 0; j < 4; j++){
        if (shape.layout[i][j]) {
          var x = shape.position.x - 2 + j;
          var y = shape.position.y - 2 + i;
          this.boxes[x][y] = shape.color;
        }
      }
    }
  }

  linesCheck(){
    var removed = _.remove(boxes, _.every).length;
    while (removed > 0){
      boxes.unshift(new Array(boxes[0].length));
      removed--;
      this.score += 10;
    }
  }


  getBox(col, row){
    if (row < 0 || row +5 > this.boxes.length || col < 0 || col +1 > this.boxes[0].length){
      throw "out of bound";
    }
    return this.boxes[row+4][col];
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
    return this.shape.getColorForPosition(row+4, col) || this.grid.getBox(col, row);
  }

  tick(){
    if (!this.ended && !this.__tryMove(1, 0)){
      this.grid.land(this.shape);
      this.shape = randomShape(width);
      if (!this.grid.checkIfAllowed(this.shape)){
        // game over man
        this.ended = true;
      }
    }
  }
  didGameEnd(){
    return !!this.ended;
  }
  moveRight(){
    this.__tryMove(0, 1);
  }
  moveDown(){
    this.__tryMove(1, 0);
  }
  moveLeft(){
    this.__tryMove(0, -1);
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


