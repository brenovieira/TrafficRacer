(function (Entity) {
  'use strict';

  function Background(x, y, width, height) {
    Entity.call(this, x, y, width, height);

    this.image = new Image();
    this.image.src = 'background.jpg';
  }

  Background.prototype = Object.create(Entity.prototype);
  Background.prototype.constructor = Background;
  Background.prototype.parent = Entity.prototype;

  Background.prototype.move = function (initX, finalX, height) {
    this.y += this.speedY;
    
    if (this.y >= this.height)
      this.y = 0;
  };
  
  Background.prototype.draw = function (ctx) {
    ctx.drawImage(this.image, 
      this.x, this.y,
      this.width, this.height);
    
    ctx.drawImage(this.image,
      this.x, this.y - this.height,
      this.width, this.height);
  };

  window.Background = Background;
})(window.Entity);