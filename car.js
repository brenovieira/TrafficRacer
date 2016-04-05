(function (Entity) {
  'use strict';

  function Car(x, y, width, height, src) {
    Entity.call(this, x, y, width, height);
    
    this.index = Entity.obstacles++;
    this.score = 100;

    this.image = new Image();
    this.image.src = src;
  }

  Car.prototype = Object.create(Entity.prototype);
  Car.prototype.constructor = Car;
  Car.prototype.parent = Entity.prototype;

  Car.prototype.draw = function (ctx) {
     ctx.drawImage(this.image, 
      this.x, this.y,
      this.width, this.height);
  };

  Car.prototype.crashAction = function () {
    this.emitEvent('stop');
  };
  
  window.Car = Car;
})(window.Entity);