(function () {
  'use strict';

  function Entity(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.index = 0;
    this.score = 0;
    this.isGone = false;
  }

  Entity.prototype.move = function (initX, finalX, height) {
    this.y += this.speedY;
    
    if (this.y > height && !this.isGone) {
      this.isGone = true;
      this.emitEvent('entityIsGone', { index: this.index, score: this.score });
    }
  };

  Entity.prototype.draw = function (ctx) {
    throw Error('Draw must be implemented by Entity child');
  };

  Entity.prototype.crashWith = function (other) {
    if (!(other instanceof Entity))
      throw Error('Argument must be an Entity');
    
    var myPosition = this.getPosition();
    var otherPosition = other.getPosition();
    var diff = 5;

    return (myPosition.bottom - otherPosition.top > diff)
      && (otherPosition.bottom - myPosition.top > diff)
      && (myPosition.right - otherPosition.left > diff)
      && (otherPosition.right - myPosition.left > diff);
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
    throw Error('CrashAction must be implemented by Entity child');
  };
  
  Entity.prototype.emitEvent = function (eventName, detail) {
    var event = new CustomEvent(eventName, { detail: detail });
    document.dispatchEvent(event);
  };
  
  // static properties
  Entity.obstacles = 0;
  Entity.prototype.speedX = 0;
  Entity.prototype.speedY = 0;

  window.Entity = Entity;
})();