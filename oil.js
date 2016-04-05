(function (Entity) {
  'use strict';

  function Oil(x, y, width, height) {
    Entity.call(this, x, y, width, height);
    
    this.index = Entity.obstacles++;
    this.score = 50;

    this.image = new Image();
    this.image.src = 'oil.png';
  }

  Oil.prototype = Object.create(Entity.prototype);
  Oil.prototype.constructor = Oil;
  Oil.prototype.parent = Entity.prototype;

  Oil.prototype.draw = function (ctx) {
     ctx.drawImage(this.image, 
      this.x, this.y,
      this.width, this.height);
  };

  Oil.prototype.crashAction = function () {
    this.emitEvent('slide');
  };
  
  window.Oil = Oil;
})(window.Entity);