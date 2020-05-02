class Play extends Phaser.Scene {
    constructor(){
        super("playScene")
    }

    create() {
        Score = 0;
        this.cameras.main.fadeIn(2000,255, 255, 255);
        keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.back1 = this.add.tileSprite(0,0,2560,720, 'background').setOrigin(0,0);
        //this.player = this.physics.add.sprite(0, 355, 'player').setScale(0.4, 0.4).setOrigin(0.8,0.5);
        //this.player.setCollideWorldBounds(true);

        this.anims.create({ key: 'idle', frames: this.anims.generateFrameNames('player'), frameRate: 8, repeat: -1 });

        this.player = this.physics.add.sprite(0, 355, 'player').setScale(0.3).play('idle');

        this.airStreamParticles = this.add.particles('trail');
        this.airStreamEmitter1 = this.airStreamParticles.createEmitter({
            follow: this.player,
            followOffset: {
                x: 47,
                y: -43
            },
            alpha: { start: 0, end: 0 },
            scale: { start: 0.1, end: 0 },
            speedX: { min: -500, max: -250 },
            speedY: { min: -5, max: 5},
            frequency: 5,
            quantity: {min : 10, max: 10},
            //angle: { min : 0, max : 360},
            lifespan: 500
        });
        this.airStreamEmitter2 = this.airStreamParticles.createEmitter({
            follow: this.player,
            followOffset: {
                x: 75,
                y: 40
            },
            alpha: { start: 0, end: 0 },
            scale: { start: 0.1, end: 0 },
            speedX: { min: -500, max: -250 },
            speedY: { min: -5, max: 5},
            frequency: 5,
            quantity: {min : 10, max: 10},
            //angle: { min : 0, max : 360},
            lifespan: 500
        });

        this.airStreamEmitter1.start();
        this.airStreamEmitter2.start();


        this.bubbleGroup = this.add.group({
            runChildUpdate: true
        });

        this.addBubble(0);
        this.addBubble(1);
        this.addBubble(2);

        this.physics.add.overlap(this.player, this.bubbleGroup, this.bubbleOverlap, null, this);


        this.bgm = game.sound.add('bgm');
        this.bgm.loop = true;
        this.bgm.play();


        //adding score
        //score display
        let scoreConfig = {
            fontFamily: 'Times New Roman',
            fontSize: '26px',
            color: '#000000',
            align: 'left',
            padding: {
                top: 15,
                bottom: 15,
                left: 15,
                right: 15
            },
        }

        this.scoreMilestone = [500, 1000, 2000, 3000, 4000, 5000];
        this.currMilestone = 0;
        this.lastMilestone = 10000;
        this.backgroundSpeed = 1;
        this.framerate = 8;
        this.score = this.add.text(10,0, 'Score: ' + Score, scoreConfig).setOrigin(0,0);

        //other variables
        this.gameOver = false;
        this.scoreMult = 1;
    }

    addBubble(type) {

        let bubble1 = new bubble(this, 1280, 1000, '2xscore', 0, type).setScale(0.5, 0.5);
        bubble1.resetLoc();
        this.bubbleGroup.add(bubble1);

    }

    update() {
        if(this.input.keyboard.checkDown(keySpace, 0.01)){
            Score += 100;
            this.score.setText("Score: " + Score);
        }
        //var vx = this.player.body.velocity.x;
        //player movement
        this.tweens.add({
            targets: this.player,
            x: game.input.mousePointer.x,
            y: game.input.mousePointer.y,
            duration : 200,
            ease: 'Power',
            repeat: 0,
            yoyo: false
            // do ease function based on distance?
        })
        //background movement
        this.back1.tilePositionX += this.backgroundSpeed;

        if(this.currMilestone >= this.scoreMilestone.length){
            if(Score > this.lastMilestone)
            {
                console.log("ADD CLOUD1");
                this.lastMilestone += 5000;
                this.addBubble(0);
                this.backgroundSpeed += 0.5;
                this.airStreamEmitter1.alpha.start += 0.05;
                this.airStreamEmitter2.alpha.start += 0.05;

                //play chime?
            }
        } else if(Score >= this.scoreMilestone[this.currMilestone])
        {
            this.backgroundSpeed += 0.75;
            console.log("ADD CLOUD2");
            this.currMilestone++;
            this.addBubble(0);
            this.airStreamEmitter1.alpha.start += 0.05;
            this.airStreamEmitter2.alpha.start += 0.05;
            this.framerate += 2.66;
            this.player.anims.msPerFrame = 1000/this.framerate;
            //play chime?
        }
    }

    bubbleOverlap(player, bubble) {
        if (!this.gameOver) {
            if(bubble.isActive) {
                bubble.isActive = false;
                if(bubble.good == 0){
                    //play sound here
                    this.sound.play('poof');
                    let cloudExParticles = this.add.particles('trail');
                    let cloudExEmitter1 = cloudExParticles.createEmitter({
                        alpha: { start: 1, end: 0 },
                        scale: { start: 0.1, end: 0 },
                        speedX: { min: -500, max: 500 },
                        speedY: { min: -500, max: 500 },
                        frequency: 5,
                        quantity: {min : 10, max: 10},
                        //angle: { min : 0, max : 360},
                        lifespan: 500
                    });
                    
                    cloudExEmitter1.explode(150, bubble.x, bubble.y);

                    bubble.resetLoc();
                    Score += 100 * this.scoreMult;
                    this.score.setText("Score: " + Score);

                } else if (bubble.good == 1) {
                    //game over you made a booboo

                    if (Score > HighScore)
                    {
                        HighScore = Score;
                        localStorage.setItem('highScore', HighScore);
                    }

                    //do scene change
                    this.sound.play('bonk');
                    let cloudExParticles = this.add.particles('trail');
                    let cloudExEmitter1 = cloudExParticles.createEmitter({
                        alpha: { start: 1, end: 0 },
                        scale: { start: 0.1, end: 0 },
                        speedX: { min: -500, max: 500 },
                        speedY: { min: -500, max: 500 },
                        frequency: 5,
                        quantity: {min : 10, max: 10},
                        //angle: { min : 0, max : 360},
                        lifespan: 500
                    });
                    cloudExEmitter1.explode(150, bubble.x, bubble.y);
                    bubble.resetLoc();
                    this.gameOver = true;
                    this.cameras.main.fadeOut(2000,255, 255, 255);
                    this.tweens.add({
                        targets: this.bgm,
                        volume: 0,
                        duration: 1500,
                    });
                    this.cameras.main.on('camerafadeoutcomplete', () => {
                        this.transitioning();
                    });
                } else {
                    //pickup
                    this.scoreMult = 2;
                    bubble.resetLoc();
                    this.time.addEvent({
                        delay: 10000,
                        callback: () => {
                            console.log('back to normal');
                            this.scoreMult = 1;
                        }
                    });
                }
            }
        }

    }

    transitioning() {
        this.time.delayedCall(2000, () => {
            this.scene.transition({
                target: 'menuScene',
                duration: 10,
            });
        });
    }
}
