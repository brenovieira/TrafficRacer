(function (Entity, Player) {
  'use strict';

  var Game = {};

  Game.fps = 30;
  Game.canvas = document.getElementById("canvas");
  Game.context = Game.canvas.getContext("2d");

  Game.clear = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Game.initialize = function () {
    this.entities = [];
    this.frame = 0;
    this.numberOfFramesToCreateEntities = 20;
    this.numberOfFramesToIncreaseSpeed = 100;
    this.running = true;
    
    // Player is the first Entity
    this.entities.push(new Player(0, this.canvas.height - 15, 10, 10, 'red'));
  };

  Game.draw = function () {
    this.clear();

    for (var i = 0; i < this.entities.length; i++) {
      this.entities[i].draw(this.context);
    }
  };

  Game.update = function () {
    if (!this.running) return;
    
    var i;
    for (i = 1; i < this.entities.length; i++) {
      if (this.entities[i].crashWith(this.entities[0])) {
        this.entities[i].crashAction();
      }
    }
    
    this.frame++;
    if (this.shouldCreateNewEntities()) {
      this.createNewEntities();
    }
    
    if (this.shouldIncreaseSpeed()) {
      this.increaseSpeed();
    }
    
    for (i = 0; i < this.entities.length; i++) {
      this.entities[i].move(this.canvas.width, this.canvas.height);
    }
  };
  
  Game.shouldCreateNewEntities = function () {
    return (this.frame === 1)
      || ((this.frame / this.numberOfFramesToCreateEntities) % 1 === 0);
  };
  
  Game.createNewEntities = function () {
    this.entities.push(new Entity(0, 0, 10, 10, 'black'));
  };
  
  Game.shouldIncreaseSpeed = function () {
    return ((this.frame / this.numberOfFramesToIncreaseSpeed) % 1 === 0);
  };
  
  Game.increaseSpeed = function () {
    Entity.prototype.speedY += 1;
  };
  
  Game.stop = function (e) {
    this.running = false;
  };

  // add listeners to document instead of window, because events hit document first.
  // instead of giving entities a reference to Game,
  // en Entity communicate with Game through en event,
  // as Game already has reference to the entities
  document.addEventListener('stop', Game.stop.bind(Game), false);

  window.Game = Game;
})(window.Entity, window.Player);