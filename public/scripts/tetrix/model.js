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
    return new Shape(layout, color, { x : this.position.x + down, y : this.position.y + right});
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
    }
  }
}

class Game {
  constructor(width, height){
    this.grid = new Grid(width, height);
  }

}


