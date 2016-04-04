(function (Entity) {
  'use strict';

  function Background(x, y, width, height, src) {
    Entity.call(this, x, y, width, height, 'black');
    
    this.image = new Image();
    this.image.src = src;
  }

  Background.prototype = Object.create(Entity.prototype);
  Background.prototype.constructor = Background;
  Background.prototype.parent = Entity.prototype;

  Background.prototype.move = function (canvasWidth, canvasHeight) {
    this.y += this.speedY;
    
    if (this.y === this.height)
        this.y = 0;
  };
  
  Background.prototype.draw = function (ctx, Background) {
    ctx.drawImage(this.image, 
      this.x, this.y,
      this.width, this.height);
    
    ctx.drawImage(this.image,
      this.x, this.y + this.height,
      this.width, this.height);
  };

  window.Background = Background;
})(window.Entity);