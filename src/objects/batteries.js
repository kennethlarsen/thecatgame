import Phaser from 'phaser';
import config from '../config';

const batteryColors = {
  empty: 0xffffff,
  lowA: 0xcc6666,
  lowB: 0xffd480,
  mediumA: 0xffff80,
  mediumB: 0xd5ff80,
  fullA: 0xb3e39c,
  fullB: 0x8ed78f,
};

class Batteries {
  constructor(game) {
    this.game = game;

    this.firstCharged = false;
    this.secondCharged = false;
    this.thirdCharged = false;

    this.mainCoord = {
      x: 20,
      y: 20,
    };


    this.addMainBattery();
    this.addBatteryPack();
  }

  addMainBattery() {
    const { x, y } = this.mainCoord;
    this.game.add.sprite(x + 9, y + 10, 'battery-fill');
    this.mainBatteryFill = this.game.add.sprite(x + 9, y + 10, 'battery-fill');
    this.mainBatteryWidth = this.mainBatteryFill.width;
    this.mainBattery = this.game.add.sprite(x, y, 'battery');

    this.addMainBatteryLabel();
    this.addMainBatteryScale();
  }

  addMainBatteryLabel() {
    this.mainBatteryLabel = this.game.add.text(
      this.mainBatteryFill.centerX,
      this.mainBatteryFill.centerY,
      0,
      {
        font: `35px ${config.fonts.secondary}`,
        fill: '#ffffff',
        align: 'left',
      },
    );

    this.mainBatteryLabel.anchor.set(0.5);
  }

  addMainBatteryScale() {
    this.mainBatteryMask = new Phaser.Rectangle(0, 0, 0, this.mainBatteryFill.height);
    this.mainBatteryFill.crop(this.mainBatteryMask);
  }

  addBatteryPack() {
    const { x, y } = this.mainCoord;
    const packY = y + this.mainBattery.height + 30;

    // gray battery pack backgrounds:
    this.game.add.sprite(x + 6, packY + 10, 'battery-pack-bg-1');
    this.game.add.sprite(x + 5, packY + 53, 'battery-pack-bg-2');
    this.game.add.sprite(x + 14, packY + 97, 'battery-pack-bg-3');

    // to-be-tinted-and-tweened backgrounds:
    this.packFillFirst = this.game.add.sprite(x + 6, packY + 10, 'battery-pack-bg-1');
    this.packFillSecond = this.game.add.sprite(x + 5, packY + 53, 'battery-pack-bg-2');
    this.packFillThird = this.game.add.sprite(x + 14, packY + 97, 'battery-pack-bg-3');
    this.pack = this.game.add.sprite(x, packY, 'battery-pack');

    this.packFillFirst.tint = batteryColors.fullB;
    this.packFillSecond.tint = batteryColors.fullB;
    this.packFillThird.tint = batteryColors.fullB;

    this.packFillFirstWidth = this.packFillFirst.width;
    this.packFillSecondWidth = this.packFillSecond.width;
    this.packFillThirdWidth = this.packFillThird.width;

    this.addBatteryPackScale();
  }

  addBatteryPackScale() {
    this.packFillFirstMask = new Phaser.Rectangle(0, 0, 0, this.packFillFirst.height);
    this.packFillSecondMask = new Phaser.Rectangle(0, 0, 0, this.packFillSecond.height);
    this.packFillThirdMask = new Phaser.Rectangle(0, 0, 0, this.packFillThird.height);

    this.packFillFirst.crop(this.packFillFirstMask);
    this.packFillSecond.crop(this.packFillSecondMask);
    this.packFillThird.crop(this.packFillThirdMask);
  }

  update(energy) {
    if (energy === 0) {
      this.mainBatteryFill.tint = batteryColors.empty;
    } else if (energy < 15) {
      this.mainBatteryFill.tint = batteryColors.lowA;
    } else if (energy < 30) {
      this.mainBatteryFill.tint = batteryColors.lowB;
    } else if (energy < 45) {
      this.mainBatteryFill.tint = batteryColors.mediumA;
    } else if (energy < 60) {
      this.mainBatteryFill.tint = batteryColors.mediumB;
    } else if (energy < 75) {
      this.mainBatteryFill.tint = batteryColors.fullA;
    } else {
      this.mainBatteryFill.tint = batteryColors.fullB;
    }


    this.updateMainBatteryLabel(energy);
    this.updateMainBatteryScale(energy);
    this.updateBatteryPackScale();
  }

  updateMainBatteryLabel(energy) {
    this.mainBatteryLabel.text = energy;
  }

  updateMainBatteryScale(energy) {
    const width = (energy / 100) * this.mainBatteryWidth;
    this.game.add.tween(this.mainBatteryMask)
      .to({ width }, 200, Phaser.Easing.Power1, true);

    this.mainBatteryFill.updateCrop();
  }

  updateBatteryPackScale() {
    this.packFillFirst.updateCrop();
    this.packFillSecond.updateCrop();
    this.packFillThird.updateCrop();
  }

  charge() {
    if (this.isCharged) {
      return false;
    }

    if (!this.firstCharged) {
      this.firstCharged = true;
      this.fillPackTank(this.packFillFirstMask, this.packFillFirstWidth);

      return true;
    }

    if (!this.secondCharged) {
      this.secondCharged = true;
      this.fillPackTank(this.packFillSecondMask, this.packFillSecondWidth);

      return true;
    }

    if (!this.thirdCharged) {
      this.thirdCharged = true;
      this.fillPackTank(this.packFillThirdMask, this.packFillThirdWidth);

      return true;
    }

    return false;
  }

  fillPackTank(mask, width) {
    this.game.add.tween(mask).to({ width }, 300, Phaser.Easing.Power1, true);
  }

  get isCharged() {
    return this.firstCharged && this.secondCharged && this.thirdCharged;
  }

  get chargedCount() {
    return this.tanks.filter(item => item).length;
  }

  get totalCount() {
    return this.tanks.length;
  }

  get tanks() {
    return [
      this.firstCharged,
      this.secondCharged,
      this.thirdCharged,
    ];
  }

  use() {
    this.firstCharged = false;
    this.secondCharged = false;
    this.thirdCharged = false;
  }
}

export default Batteries;
