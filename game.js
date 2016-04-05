(function (StoreManager, Entity, Car, Hole, Oil, Player, Background, Text) {
  'use strict';

  var Game = {
    fps: 30,
    initialSpeedY: 4,
    numberOfFramesToCreateEntities: 25,
    numberOfFramesToIncreaseSpeed: 200,
    numberOfLanes: 4,
    percentageToIncreaseSpeed: 0.1,
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
    
    this.background = new Background(0, 0, this.canvas.width, this.canvas.height);
    
    this.player = new Player(
      this.roadInitX + 2 * this.laneWidth, this.canvas.height - this.entityHeight,
      this.entityWidth, this.entityHeight, this.laneWidth);
    
    this.scoreText = new Text(600, 30, '20px Consolas', 'black', 'Score: ' + this.score);

    var highestScore = StoreManager.get('highestScore') || 0;
    this.highestScoreText = new Text(600, 60, '20px Consolas', 'black', 'Recorde: ' + highestScore);
    
    this.resetEntity();
  };

  Game.draw = function () {
    if (!this.running) return;
    
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
  
  var CAR_YELLOW = 1, CAR_PINK = 2, OIL = 3, HOLE = 4;
  Game.createNewEntities = function () {
    var typesOfObstacles = 4;
    var typeOfObstacle = Math.floor(Math.random() * typesOfObstacles) + 1;
    var lane = Math.floor(Math.random() * this.numberOfLanes);
    
    var obstacle;
    switch (typeOfObstacle) {
      case CAR_YELLOW:
        obstacle = new Car(
          this.roadInitX + lane * this.laneWidth, -1 * this.entityHeight,
          this.entityWidth, this.entityHeight, 'car_yellow.png');
          break;
          
      case CAR_PINK:
        obstacle = new Car(
          this.roadInitX + lane * this.laneWidth, -1 * this.entityHeight,
          this.entityWidth, this.entityHeight, 'car_pink.png');
          break;
      
      case OIL:
        obstacle = new Oil(
          this.roadInitX + lane * this.laneWidth, -1 * this.entityHeight,
          this.entityWidth, this.entityHeight);
          break;
      
      case HOLE:
        obstacle = new Hole(
          this.roadInitX + lane * this.laneWidth, -1 * this.entityHeight,
          this.entityWidth, this.entityHeight);
          break;
        
      default:
        throw Error('Type of Obstacle not implemented');
    }
    
    this.entities.push(obstacle);
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