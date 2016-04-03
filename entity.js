(function () {
  'use strict';

  function Entity(x, y, width, height, color) {
    this.index = Entity.instances++;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  Entity.prototype.move = function (canvasWidth, canvasHeight) {
    this.x += this.speedX;
    this.y += this.speedY;
  };

  Entity.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };

  Entity.prototype.crashWith = function (other) {
    if (!(other instanceof Entity))
      throw Error('Argument must be an Entity');
    
    var myPosition = this.getPosition();
    var otherPosition = other.getPosition();

    return (myPosition.bottom > otherPosition.top)
      && (myPosition.top < otherPosition.bottom)
      && (myPosition.right > otherPosition.left)
      && (myPosition.left < otherPosition.right);
  };
  
  Entity.prototype.getPosition = function () {
    return {
      left: this.x,
      right: this.x + this.width,
      top: this.y,
      bottom: this.y + this.height
    };
  };

  Entity.prototype.crashAction = function () {
    this.emitEvent('stop');
  };
  
  Entity.prototype.emitEvent = function (eventName, details) {
    var event = new Event(eventName, details);
    document.dispatchEvent(event);
  };
  
  Entity.prototype.isGone = function (width, height) {
    return (this.x < 0 || this.x > width)
      && (this.y < 0  || this.y > height);
  };
  
  // static properties
  Entity.instances = 0;
  Entity.prototype.speedX = 0;
  Entity.prototype.speedY = 1;

  window.Entity = Entity;
})();