class bubble extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, type) {
        super(scene, x, y, texture, frame);

        scene.physics.add.existing(this);
        scene.add.existing(this);
        this.side = 0; //0 -> front, 1 -> top, 2 -> bottom
        this.good = type; //0 -> good (blue bubble), 1 -> bad (red bubble), 2 -> pickup
        this.moveX = -10;
        this.moveY = 0;
        this.buffer = 50; //size of sprite so that it isnt cut off of screen
        this.waiting = false; //prevents switching of bubbles mid-flight
        this.isActive = true; //prevents multiple collisions from one collision
        this.speedX = 5;
    }
    
    update() {
        //console.log("bubble movin");
        //if hit boundaries or player, reset
        
        if(this.x < 0 - this.buffer) {
            this.resetLoc();
        } else if (this.y < 0 - this.buffer && this.side != 1) {
            this.resetLoc();
        } else if (this.y - this.buffer * 2 > game.config.height && this.side != 2) {
                this.resetLoc();
        } 

        if(!this.waiting){
            this.x += this.moveX;
            this.y += this.moveY;
        }
    }

    resetLoc() {
        this.waiting = true;
        
        this.side = Phaser.Math.Between(0,2);
        //console.log("MOVING");
        if(this.side == 0){ //left
            this.x = game.config.width + this.buffer * 2;
            this.y = Phaser.Math.Between(this.buffer, game.config.height - this.buffer);
            this.moveX = -this.speedX;
            this.moveY = Phaser.Math.Between(-10,10);
        } else if(this.side == 1) { //top
            this.x = Phaser.Math.Between(game.config.width/2, game.config.width/2 - this.buffer)
            this.y = 0 - this.buffer * 2;
            this.moveX = -this.speedX;
            this.moveY = Phaser.Math.Between(0,10);
        } else if(this.side == 2) { //bottom
            this.x = Phaser.Math.Between(game.config.width/2, game.config.width/2 - this.buffer)
            this.y = game.config.height + this.buffer * 2;
            this.moveX = -this.speedX;
            this.moveY = Phaser.Math.Between(-10,0);
        }

        if (this.good != 2) {
            this.scene.time.addEvent({
                delay: Phaser.Math.Between(500,2500),
                callback: ()=>{
                    this.changeCloud();    
                }
            });
        } else {
            this.scene.time.addEvent({
                delay: Phaser.Math.Between(20000,25000),
                callback: () => {
                    this.waiting = false;
                    this.isActive = true;
                }
            });
        }
    }

    changeCloud() {
        //console.log("CHANGING GOOD/BAD");
        this.good = Phaser.Math.Between(0,1);
        if(this.good == 0){
            this.setTexture('collectibles', 'gb' + Phaser.Math.Between(1,6));
            //pick random sprite from good pool
        } else {
            this.setTexture('uncollectibles', 'bb' + Phaser.Math.Between(1,5));
        }
        
        this.waiting = false;
        this.isActive = true;
    }
}