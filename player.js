(function (Entity) {
  'use strict';

  var LEFT_KEY_CODE = 37,
    RIGHT_KEY_CODE = 39;
  
  function Player(x, y, width, height, color) {
    Entity.call(this, x, y, width, height, color);

    this.speedX = 0;
    this.speedY = 0;

    document.addEventListener('keydown', this.keyDownHandler.bind(this), false);
    document.addEventListener('keyup', this.keyUpHandler.bind(this), false);
  }

  Player.prototype = Object.create(Entity.prototype);
  Player.prototype.constructor = Player;
  Player.prototype.parent = Entity.prototype;

  Player.prototype.move = function (canvasWidth, canvasHeight) {
    if ((this.x + this.speedX < 0) || (this.x + this.width + this.speedX > canvasWidth))
      return;
    
    this.x += this.speedX;
  };

  Player.prototype.keyDownHandler = function (e) {
    if (e.keyCode == LEFT_KEY_CODE) {
      this.speedX = -0.25 * this.width;
    } else if (e.keyCode == RIGHT_KEY_CODE) {
      this.speedX = 0.25 * this.width;
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