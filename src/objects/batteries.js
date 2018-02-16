import Phaser from 'phaser';

import config from '../config';
import destroy from '../utils/safe-destroy';
import makeDraggable from '../utils/make-draggable';

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

    this.onCharge = new Phaser.Signal();
    this.onPackDropped = new Phaser.Signal();

    this.firstCharged = false;
    this.secondCharged = false;
    this.thirdCharged = false;

    this.mainCoord = {
      x: 20,
      y: 20,
    };

    this.draw();
  }

  draw(scale = 1) {
    this.addBatteryPack(scale);
    this.addMainBattery(scale);
  }

  addMainBattery(scale = 1) {
    destroy(this.mainBatteryGroup);

    const { x, y } = this.mainCoord;
    const scaledX = Math.floor(x * scale);
    const scaledY = Math.floor(y * scale);
    const scaledFillX = Math.floor((x + 9) * scale);
    const scaledFillY = Math.floor((y + 10) * scale);

    this.mainBatteryGroup = this.game.add.group();
    this.mainBatteryGroup.enableBody = true;
    this.mainBatteryGroup.physicsBodyType = Phaser.Physics.ARCADE;

    this.mainBatteryBack = this.mainBatteryGroup.create(scaledFillX, scaledFillY, 'battery-fill');
    this.mainBatteryFill = this.mainBatteryGroup.create(scaledFillX, scaledFillY, 'battery-fill');
    this.mainBattery = this.mainBatteryGroup.create(scaledX, scaledY, 'battery');

    this.mainBatteryWidth = this.mainBatteryFill.width;
    this.mainBatteryHeight = this.mainBattery.height;
    const fillHeight = this.mainBatteryFill.height;

    this.mainBatteryBack.scale.set(scale);
    this.mainBatteryFill.scale.set(scale);
    this.mainBattery.scale.set(scale);

    this.addMainBatteryLabel(this.mainBatteryGroup, scale);
    this.addMainBatteryScale(fillHeight);

    makeDraggable({
      item: this.mainBatteryGroup,
      onDrop: (item, pointer) => {
        const originX = item.origin.x;
        const originY = item.origin.y;

        this.game.add.tween(item)
          .to({ x: originX, y: originY }, 200, null, true);
      },
      dropAction: (item, pointer) => {
        const isOverPack = this.mainBatteryBack.getBounds()
          .contains(pointer.x, pointer.y);

        if (isOverPack) {
          this.onCharge.dispatch();
        }
      },
    });
  }

  addMainBatteryLabel(group, scale = 1) {
    const font = config.fonts.secondary;
    const fontSize = Math.floor(config.reference.fontSize.medium * scale);
    const { centerX, centerY } = this.mainBatteryFill;

    this.mainBatteryLabel = this.game.add.text(
      centerX,
      centerY,
      0,
      {
        font: `${fontSize}px ${font}`,
        fill: '#ffffff',
        align: 'left',
      },
      group,
    );

    this.mainBatteryLabel.anchor.set(0.5);
  }

  addMainBatteryScale(height) {
    this.mainBatteryMask = new Phaser.Rectangle(0, 0, 0, height);
    this.mainBatteryFill.crop(this.mainBatteryMask);
  }

  addBatteryPack(scale = 1) {
    destroy(this.batteryPackGroup);

    const { x, y } = this.mainCoord;
    const packY = y + this.mainBatteryHeight + 30;

    // gray battery pack backgrounds:
    const x1 = Math.floor((x + 6) * scale);
    const y1 = Math.floor((packY + 10) * scale);
    const x2 = Math.floor((x + 3) * scale);
    const y2 = Math.floor((packY + 53) * scale);
    const x3 = Math.floor((x + 14) * scale);
    const y3 = Math.floor((packY + 97) * scale);

    this.batteryPackGroup = this.game.add.group();
    this.batteryPackGroup.enableBody = true;
    this.batteryPackGroup.physicsBodyType = Phaser.Physics.ARCADE;

    this.packBg1 = this.batteryPackGroup.create(x1, y1, 'battery-pack-bg-1');
    this.packBg2 = this.batteryPackGroup.create(x2, y2, 'battery-pack-bg-2');
    this.packBg3 = this.batteryPackGroup.create(x3, y3, 'battery-pack-bg-3');

    // to-be-tinted-and-tweened backgrounds:
    const scaledX = Math.floor(x * scale);
    const scaledY = Math.floor(packY * scale);

    this.packFill1 = this.batteryPackGroup.create(x1, y1, 'battery-pack-bg-1');
    this.packFill2 = this.batteryPackGroup.create(x2, y2, 'battery-pack-bg-2');
    this.packFill3 = this.batteryPackGroup.create(x3, y3, 'battery-pack-bg-3');
    this.pack = this.batteryPackGroup.create(scaledX, scaledY, 'battery-pack');

    this.packFill1.tint = batteryColors.fullB;
    this.packFill2.tint = batteryColors.fullB;
    this.packFill3.tint = batteryColors.fullB;

    this.packFill1Width = this.packFill1.width;
    this.packFill2Width = this.packFill2.width;
    this.packFill3Width = this.packFill3.width;

    const firstHeight = this.packFill1.height;
    const secondHeight = this.packFill2.height;
    const thirdHeight = this.packFill3.height;

    this.packBg1.scale.set(scale);
    this.packBg2.scale.set(scale);
    this.packBg3.scale.set(scale);
    this.packFill1.scale.set(scale);
    this.packFill2.scale.set(scale);
    this.packFill3.scale.set(scale);
    this.pack.scale.set(scale);

    this.addBatteryPackScale(firstHeight, secondHeight, thirdHeight);

    makeDraggable({
      item: this.batteryPackGroup,
      onDrop: (item) => {
        const originX = item.origin.x;
        const originY = item.origin.y;

        this.game.add.tween(item)
          .to({ x: originX, y: originY }, 200, null, true);
      },
      dropAction: (item, position) => {
        this.onPackDropped.dispatch(position.x, position.y);
      },
    });
  }

  addBatteryPackScale(firstHeight, secondHeight, thirdHeight) {
    this.packFill1Mask = new Phaser.Rectangle(0, 0, 0, firstHeight);
    this.packFill2Mask = new Phaser.Rectangle(0, 0, 0, secondHeight);
    this.packFill3Mask = new Phaser.Rectangle(0, 0, 0, thirdHeight);

    this.packFill1.crop(this.packFill1Mask);
    this.packFill2.crop(this.packFill2Mask);
    this.packFill3.crop(this.packFill3Mask);
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
    this.packFill1.updateCrop();
    this.packFill2.updateCrop();
    this.packFill3.updateCrop();
  }

  resize(scale) {
    this.draw(scale);

    if (this.firstCharged) {
      this.fillPackTank(this.packFill1Mask, this.packFill1Width);
    }

    if (this.secondCharged) {
      this.fillPackTank(this.packFill2Mask, this.packFill2Width);
    }

    if (this.thirdCharged) {
      this.fillPackTank(this.packFill3Mask, this.packFill3Width);
    }

    this.updateBatteryPackScale();
  }

  charge() {
    if (this.isCharged) {
      return false;
    }

    if (!this.firstCharged) {
      this.firstCharged = true;
      this.fillPackTank(this.packFill1Mask, this.packFill1Width);

      return true;
    }

    if (!this.secondCharged) {
      this.secondCharged = true;
      this.fillPackTank(this.packFill2Mask, this.packFill2Width);

      return true;
    }

    if (!this.thirdCharged) {
      this.thirdCharged = true;
      this.fillPackTank(this.packFill3Mask, this.packFill3Width);

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
