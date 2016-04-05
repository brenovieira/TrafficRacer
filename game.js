(function (StoreManager, Entity, Car, Hole, Oil, Player, Background, Text) {
  'use strict';

  var Game = {
    fps: 30,
    initialSpeedY: 6,
    numberOfFramesToCreateEntities: 15,
    numberOfFramesToIncreaseSpeed: 120,
    numberOfLanes: 4,
    percentageToIncreaseSpeed: 0.15,
    running: false,
    canvas: document.getElementById('canvas'),
    roadInitX: 230,
    roadFinalX: 530,
    entityWidth: 60,
    entityHeight: 80
  };

  Game.context = Game.canvas.getContext('2d');
  Game.laneWidth = (Game.roadFinalX - Game.roadInitX) / Game.numberOfLanes;
  
  Game.clear = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Game.start = function () {
    this.entities = [];
    this.frame = 0;
    this.score = 0;
    this.minIndexVisible = 0;
    this.running = true;
    
    this.validPositions = [];
    for (var i = 0; i < this.numberOfLanes; i++) {
      this.validPositions[i] = true;
    }
    
    this.background = new Background(0, 0, this.canvas.width, this.canvas.height);
    
    this.player = new Player(
      this.roadInitX + 2 * this.laneWidth, this.canvas.height - this.entityHeight,
      this.entityWidth, this.entityHeight, this.laneWidth);
    
    this.gameOverText = null;
    this.scoreText = new Text(600, 30, '20px Consolas', 'black', 'Score: ' + this.score);

    var highestScore = StoreManager.get('highestScore') || 0;
    this.highestScoreText = new Text(600, 60, '20px Consolas', 'black', 'Recorde: ' + highestScore);
    
    this.resetEntity();
  };

  Game.draw = function () {
    if (!this.running) {
      if (!this.gameOverText) {
        this.gameOverText = new Text(
          0.5 * (this.roadInitX + this.roadFinalX), 0.5 * this.canvas.height,
          '40px Consolas', 'red', 'Game Over');
          
        this.gameOverText.draw(this.context);
      }
      
      return; 
    }
    
    this.clear();

    this.background.draw(this.context);
    this.player.draw(this.context);
    this.scoreText.draw(this.context);
    this.highestScoreText.draw(this.context);
    for (var i = this.minIndexVisible; i < this.entities.length; i++) {
      this.entities[i].draw(this.context);
    }
  };

  Game.update = function () {
    if (!this.running) return;
    
    var i;
    for (i = this.minIndexVisible; i < this.entities.length; i++) {
      if (this.entities[i].crashWith(this.player)) {
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
    
    this.background.move(this.roadInitX, this.roadFinalX, this.canvas.height);
    this.player.move(this.roadInitX, this.roadFinalX, this.canvas.height);
    for (i = this.minIndexVisible; i < this.entities.length; i++) {
      this.entities[i].move(this.roadInitX, this.roadFinalX, this.canvas.height);
    }
  };
  
  Game.shouldCreateNewEntities = function () {
    return (this.frame === 1)
      || ((this.frame / this.numberOfFramesToCreateEntities) % 1 === 0);
  };
  
  Game.createNewEntities = function () {
    var i,
      addedLanes = [],
      numberOfEntitiesToCreate = Math.floor(Math.random() * this.numberOfLanes);
    
    for (i = 0; i < numberOfEntitiesToCreate; i++) {
      var lane;
      while(addedLanes[lane = Math.floor(Math.random() * this.numberOfLanes)]);
      addedLanes[lane] = true;
    }
    
    // if not a valid configuration, don't add obstacles
    if (!this.setValidPositions(addedLanes)) {
      this.validPositions = [];
      for (i = 0; i < this.numberOfLanes; i++) {
        this.validPositions[i] = true;
      }
      
      return;
    }
    
    for (i = 0; i < addedLanes.length; i++) {
      if (!addedLanes[i]) continue;
      
      var obstacle = this.createNewEntity(
        this.roadInitX + i * this.laneWidth, -1 * this.entityHeight,
        this.entityWidth, this.entityHeight);
      
      this.entities.push(obstacle);
    }
  };
  
  var CAR_YELLOW = 1, CAR_PINK = 2, OIL = 3, HOLE = 4;
  Game.createNewEntity = function (x, y, width, height) {
    var typesOfObstacles = 4;
    var typeOfObstacle = Math.floor(Math.random() * typesOfObstacles) + 1;
    
    switch (typeOfObstacle) {
      case CAR_YELLOW: return new Car(x, y, width, height, 'car_yellow.png');
      case CAR_PINK: return new Car(x, y, width, height, 'car_pink.png');      
      case OIL: return new Oil(x, y, width, height);
      case HOLE: return new Hole(x, y, width, height);
      default: throw Error('Type of Obstacle not implemented');
    }
  };

  /**
   * assuming that the player can go all the way
   * from the left to the right or vice versa real quick,
   * we can just look to the last possible positions
   * to find the next possible positions without crashing.
   * i.e.,
   * being 'o' an empty position and 'x' a filled position,
   * the following configuration is valid:
   * x x x o     <- next positions (what we're creating)
   * o o o o     <- last positions (what we've created last)
   * o x x x
   */
  Game.setValidPositions = function (obstaclesLanes) {
    var newValidPositions = [],
      valid = false;
    
    for (var i = 0; i < this.numberOfLanes; i++) {
      newValidPositions[i] = this.getNewValidPosition(i, obstaclesLanes);
      
      if (newValidPositions[i])
        valid = true;
    }
    
    this.validPositions = newValidPositions;
    return valid;
  };
  
  Game.getNewValidPosition = function (lane, obstaclesLanes) {
    // if there is an obstacle, it won't be a valid position
    if (obstaclesLanes[lane]) return false;
    
    // if there isn't an obstacle and it was a valid position before,
    // it will continue being a valid position
    if (this.validPositions[lane]) return true;
    
    // if it wasn't a valid position before,
    // it will depend on next lane being valid.
    // if it is the last lane, it is invalid.
    if (lane === this.numberOfLanes - 1) return false;
    
    return Game.getNewValidPosition(lane + 1, obstaclesLanes);
  };
  
  Game.shouldIncreaseSpeed = function () {
    return ((this.frame / this.numberOfFramesToIncreaseSpeed) % 1 === 0);
  };
  
  Game.increaseSpeed = function () {
    Entity.prototype.speedY *= (1 + this.percentageToIncreaseSpeed);
  };
  
  Game.resetEntity = function () {
    Entity.prototype.speedY = this.initialSpeedY;
    Entity.obstacles = 0;
  };
  
  Game.stop = function (e) {
    this.running = false;
    
    var highestScore = StoreManager.get('highestScore') || 0;
    StoreManager.put('highestScore', Math.max(highestScore, this.score));
    
    this.highestScoreText.text = 'Recorde: ' + highestScore;
  };
  
  Game.slide = function (e) {
    if (this.player.x + this.player.width + this.laneWidth > this.roadFinalX)
      this.player.x -= this.laneWidth;
    else
      this.player.x += this.laneWidth;
  };
  
  Game.loseScore = function (e) {
    this.score -= 1000;
  };
  
  Game.entityIsGone = function (e) {
    var evt = e.detail || {};
    
    this.score += evt.score || 100;
    this.scoreText.text = 'Score: ' + this.score;
    this.minIndexVisible = Math.max(this.minIndexVisible, evt.index || 0);
  };
  
  // add listeners to document instead of window, because events hit document first.
  // instead of giving entities a reference to Game,
  // en Entity communicate with Game through en event,
  // as Game already has reference to the entities
  document.addEventListener('stop', Game.stop.bind(Game), false);
  document.addEventListener('slide', Game.slide.bind(Game), false);
  document.addEventListener('loseScore', Game.loseScore.bind(Game), false);
  document.addEventListener('entityIsGone', Game.entityIsGone.bind(Game), false);
  document.getElementById('startBtn').addEventListener('click', Game.start.bind(Game), false);
  
  window.Game = Game;
})(window.StoreManager, window.Entity, window.Car, window.Hole,
  window.Oil, window.Player, window.Background, window.Text);