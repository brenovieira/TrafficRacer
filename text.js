(function (Entity) {
  'use strict';

  function Text(x, y, font, color, text) {
    Entity.call(this, x, y, 0, 0, color);

    this.speedX = 0;
    this.speedY = 0;
    this.text = text || '';
  }

  Text.prototype = Object.create(Entity.prototype);
  Text.prototype.constructor = Text;
  Text.prototype.parent = Entity.prototype;

  Text.prototype.draw = function (ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(this.text, this.x, this.y);
  };

  window.Text = Text;
})(window.Entity);