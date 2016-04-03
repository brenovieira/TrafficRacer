(function (Entity) {
  'use strict';

  var LEFT_KEY_CODE = 37,
    RIGHT_KEY_CODE = 39;

  function Player(x, y, width, height, color) {
    Entity.call(this, x, y, width, height, color);

    this.speedX = 0;
    this.speedY = 0;

    document.addEventListener('keydown', keyDownHandler.bind(this), false);
    document.addEventListener('keyup', keyUpHandler.bind(this), false);
  }

  Player.prototype.move = function (canvasWidth, canvasHeight) {

    this.x += this.speedX;
    this.y += this.speedY;
  };

  function keyDownHandler(e) {
    if (e.keyCode == LEFT_KEY_CODE) {
      this.speedX = -1;
    } else if (e.keyCode == RIGHT_KEY_CODE) {
      this.speedX = 1;
    }
  };

  function keyUpHandler(e) {
    if (e.keyCode == LEFT_KEY_CODE) {
      this.speedX = 0;
    } else if (e.keyCode == RIGHT_KEY_CODE) {
      this.speedX = 0;
    }
  };

  Player.prototype = Object.create(Entity.prototype);
  Player.prototype.constructor = Player;
  Player.prototype.parent = Entity.prototype;

  window.Player = Player;
})(window.Entity);