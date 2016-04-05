(function (Entity) {
  'use strict';

  var LEFT_KEY_CODE = 37,
    RIGHT_KEY_CODE = 39;
  
  function Player(x, y, width, height, laneWidth) {
    Entity.call(this, x, y, width, height);

    this.speedX = 0;
    this.speedY = 0;

    this.laneWidth = laneWidth;
    this.image = new Image();
    this.image.src = 'car_red.png';

    document.addEventListener('keydown', this.keyDownHandler.bind(this), false);
    document.addEventListener('keyup', this.keyUpHandler.bind(this), false);
  }

  Player.prototype = Object.create(Entity.prototype);
  Player.prototype.constructor = Player;
  Player.prototype.parent = Entity.prototype;

  Player.prototype.move = function (initX, finalX, height) {
    if ((this.x + this.speedX < initX) || (this.x + this.width + this.speedX > finalX))
      return;
    
    this.x += this.speedX;
  };
  
  Player.prototype.draw = function (ctx) {
     ctx.drawImage(this.image, 
      this.x, this.y,
      this.width, this.height);
  };

  Player.prototype.keyDownHandler = function (e) {
    if (e.keyCode == LEFT_KEY_CODE) {
      this.speedX = -0.25 * this.laneWidth;
    } else if (e.keyCode == RIGHT_KEY_CODE) {
      this.speedX = 0.25 * this.laneWidth;
    }
  };

  Player.prototype.keyUpHandler = function (e) {
    if (e.keyCode == LEFT_KEY_CODE) {
      this.speedX = 0;
    } else if (e.keyCode == RIGHT_KEY_CODE) {
      this.speedX = 0;
    }
  };

  window.Player = Player;
})(window.Entity);