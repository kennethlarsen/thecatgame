class Weather {
    constructor(game){
        this.game = game;
    }

    addSmog() {
        let fog = this.game.add.bitmapData(this.game.width, this.game.height);
     
        fog.ctx.rect(0, 0, this.game.width, this.game.height);
        fog.ctx.fillStyle = '#b2ddc8';
        fog.ctx.fill();
     
        this.fogSprite = this.game.add.sprite(0, 0, fog);
     
        this.fogSprite.alpha = 0;
        this.game.add.tween(this.fogSprite).to( { alpha: 0.7 }, 6000, null, true);
    }

    removeSmog() {
        let fogTween = this.game.add.tween(this.fogSprite).to( { alpha: 0 }, 6000, null, true);

        fogTween.onComplete.add(() => {
            this.fogSprite.kill();
        }, this);
    }

    addRain() {  
        let rainParticle = this.game.add.bitmapData(15, 50);
 
        rainParticle.ctx.rect(0, 0, 15, 50);
        rainParticle.ctx.fillStyle = '#9cc9de';
        rainParticle.ctx.fill();
     
        this.rainEmitter = this.game.add.emitter(this.game.world.centerX, -900, 100);
     
        this.rainEmitter.width = this.game.world.width / 3;

        this.rainEmitter.angle = 90;
     
        this.rainEmitter.makeParticles(rainParticle);
     
        this.rainEmitter.minParticleScale = 0.1;
        this.rainEmitter.maxParticleScale = 0.3;
     
        this.rainEmitter.setYSpeed(600, 1000);
        this.rainEmitter.setXSpeed(-5, 5);
     
        this.rainEmitter.minRotation = 0;
        this.rainEmitter.maxRotation = 0;

        this.rainEmitter.start(false, 1600, 5, 0);
    }

    removeRain(){
        this.rainEmitter.kill();
    }
}

export default Weather;