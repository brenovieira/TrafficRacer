(function (Entity) {
  'use strict';

  function Hole(x, y, width, height) {
    Entity.call(this, x, y, width, height);
    
    this.index = Entity.obstacles++;
    this.score = 50;
    
    this.centerX = x + 0.5 * width;
    this.centerY = y + 0.5 * height;
    this.radius = 0.5 * Math.min(width, height);
  }

  Hole.prototype = Object.create(Entity.prototype);
  Hole.prototype.constructor = Hole;
  Hole.prototype.parent = Entity.prototype;

  Hole.prototype.draw = function (ctx) {
    ctx.beginPath();
    ctx.arc(this.centerX, this.centerY, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'black';
    ctx.fill();
  };

  Hole.prototype.crashAction = function () {
    this.emitEvent('loseScore');
  };
  
  window.Hole = Hole;
})(window.Entity);