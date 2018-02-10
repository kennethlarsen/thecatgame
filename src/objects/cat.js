import Phaser from 'phaser';
import gameConfig from '../config';
import CatWalking from '../sprites/cat-walking';

class Cat {
  constructor({ game }) {
    this.game = game;
    this.energy = 0;
    this.speedUpUnit = 10;
    this.slowDownUnit = 5;
    this.chargeUnit = 75;
    this.maxAutoSlowDownUnit = 5;
    this.maxEnergy = 100;
    this.maxFrameRate = 50;

    this.referenceJumpVelocity = 2500;
    this.jumpVelocity = this.referenceJumpVelocity;
    this.referenceGravity = 8000;

    // every 5 second the cat slows down by 1 unit (because it burns energy ;))
    this.slowDownPeriod = 5000;

    this.setNextSlowDownTime(this.slowDownPeriod);

    const asset = 'cat-walking';
    const { centerX, width, height } = game.world;

    this.offset = gameConfig.reference.groundHeight - 40;

    this.sprite = new CatWalking({
      game,
      x: Math.floor(centerX - (width * 0.15)),
      y: height,
      asset,
    });

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

    this.sprite.body.offset.y = this.offset;
    this.sprite.checkWorldBounds = true;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.immovable = true;
    this.sprite.body.gravity.y = this.referenceGravity;
    this.sprite.body.gravity.x = 0;
    this.sprite.body.velocity.x = 0;
    this.sprite.inputEnabled = true;
    this.meow = this.game.add.audio('meow');

    this.swipeStartX = 0;
    this.swipeStartY = 0;
    this.swipeEndX = 0;
    this.swipeEndY = 0;
    this.sprite.events.onInputDown.add(this.beginSwipe, this);

    game.add.existing(this.sprite);
  }

  get totalEnergy() {
    return this.energy;
  }

  get speed() {
    return Math.floor((this.maxFrameRate * this.energy) / 100);
  }

  beginSwipe() {
    this.swipeStartX = this.game.input.worldX;
    this.swipeStartY = this.game.input.worldY;

    this.sprite.events.onInputDown.remove(this.beginSwipe);
    this.sprite.events.onInputUp.add(this.endSwipe, this);
  }

  endSwipe() {
    this.swipeEndX = this.game.input.worldX;
    this.swipeEndY = this.game.input.worldY;

    const distanceX = this.swipeStartX - this.swipeEndX;
    const distanceY = this.swipeStartY - this.swipeEndY;
    const verticalSwipe = Math.abs(distanceY) > Math.abs(distanceX) * 2;
    const minDistanceCovered = Math.abs(distanceY) > 10;
    const swipedUp = distanceY > 0;

    if (verticalSwipe && minDistanceCovered && swipedUp) {
      this.jump();
    }

    this.sprite.events.onInputUp.remove(this.endSwipe);
    this.sprite.events.onInputDown.add(this.beginSwipe);
  }

  setNextSlowDownTime(period) {
    this.timer = this.game.time.now + period;
  }

  energyGotBurnt() {
    return this.game.time.now > this.timer;
  }

  hasEnergy() {
    return this.energy > 0;
  }

  speedUp() {
    if (this.energy < this.maxEnergy) {
      this.energy += this.energyGain(this.speedUpUnit);
    }
  }

  slowDown() {
    if (this.energy > 0 && this.energyGotBurnt()) {
      // remove more energy for a higher energy level:
      const energyRatio = this.energy / this.maxEnergy;
      const dynamicLossUnit = Math.floor(energyRatio * this.maxAutoSlowDownUnit);

      this.energy -= this.energyLoss(dynamicLossUnit) || 1;
      this.setNextSlowDownTime(this.slowDownPeriod);
    }
  }

  jump() {
    if (this.sprite.body.blocked.down) {
      this.jumping = true;
      this.sprite.body.velocity.y = -this.jumpVelocity;
    } else {
      this.jumping = false;
    }
  }

  update() {
    if (this.hasEnergy()) {
      this.sprite.walk(this.speed);
      this.slowDown();
    } else {
      this.sprite.halt();
    }

    if (this.jumping) {
      this.updateAngle();
    } else {
      this.resetAngle();
    }
  }

  updateAngle() {
    // Add a body angle while jumping:
    const velocity = this.sprite.body.velocity.y;
    const maxAngleUp = 45;
    const maxAngleDown = 20;
    const angle = velocity < 0 ? maxAngleUp : maxAngleDown;
    const fps = 60;

    this.sprite.rotation = (velocity * (angle / this.jumpVelocity)) / fps;
  }

  resetAngle() {
    this.sprite.rotation = 0;
  }

  resize(scale) {
    const { centerX, width, height } = this.game.world;

    this.sprite.x = Math.floor(centerX - (width * 0.15));
    this.sprite.y = height;

    this.jumpVelocity = Math.floor(this.referenceJumpVelocity * scale);
    this.sprite.body.gravity.y = Math.floor(this.referenceGravity * scale);

    this.sprite.scale.set(scale);
  }

  chargeBatteries(batteries) {
    if (batteries.isCharged) {
      return;
    }

    // always remove n units from the displayed energy:
    const difference = this.energyLoss(this.chargeUnit);
    const chargeLevelReached = difference >= this.chargeUnit;
    const enoughTotalEnergy = this.energy - difference > 0;

    if (!chargeLevelReached || !enoughTotalEnergy) {
      return;
    }

    const wasCharged = batteries.charge();

    if (wasCharged) {
      this.energy -= difference;
    }
  }

  energyLoss(units) {
    return (this.energy - Math.abs(units)) > 0
      ? Math.abs(units)
      : this.energy;
  }

  energyGain(units) {
    return (this.energy + units) > this.maxEnergy
      ? this.maxEnergy - this.energy
      : units;
  }

  collideWithAll(sprites) {
    sprites.forEach(sprite => this.collideWith(sprite));
  }

  collideWith(obstacle) {
    const { width, height } = obstacle;
    const { centerX, centerY } = obstacle;

    const obstacleLeftBorder = centerX - (width / 2);
    const obstacleRightBorder = centerX + (width / 2);
    const catRightBorder = (this.sprite.centerX + (this.sprite.width / 2)) - (this.sprite.width / 4);
    const catLeftBorder = (this.sprite.centerX - (this.sprite.width / 2));
    const obstacleTopBorder = centerY - (height / 2);
    const catBottomBorder = this.sprite.centerY + (this.sprite.height / 2);

    const obstacleHitsCat = obstacleLeftBorder < catRightBorder;
    const obstaclePastCat = obstacleRightBorder <= catLeftBorder;
    const catAboveObstacle = catBottomBorder <= obstacleTopBorder;
    const hitCat = obstacleHitsCat && !catAboveObstacle;
    const obstacleAvoided = !obstacle.hit && obstaclePastCat;

    if (obstacleAvoided && !obstacle.avoided) {
      obstacle.avoided = true;
    }

    if (!obstacle.avoided && !obstacle.hit && hitCat) {
      obstacle.hit = true;
      obstacle.destroy();

      const difference = this.energyLoss(this.slowDownUnit);
      this.energy -= difference;
      this.meow.play();
    }
  }
}

export default Cat;
