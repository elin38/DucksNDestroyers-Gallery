class DestroyerLevel extends Phaser.Scene {
    constructor() {
        super("destroyerLevel");

        this.my = {sprite: {}, text: {}};

        this.my.sprite.laser = [];   
        this.maxLasers = 10;           

        this.my.sprite.enemyLaser = [];
        this.maxEnemyLaser = 5;

        this.my.sprite.enemies = [];
        this.enemiesNum = 5;

        this.my.sprite.enemies2 = [];
        this.enemiesNum2 = 3;
        
        this.myScore = 0;     


        this.waveCheck = 0;
        this.difficultyNum = 1;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("astroid", "meteorBrown_big1.png");
        this.load.image("ship", "playerShip1_blue.png");
        this.load.image("laser", "laserBlue01.png");
        this.load.image("enemyShip", "enemyBlack2.png");
        this.load.image("enemyLaser", "laserRed05.png");
        


        // For animation
        this.load.image("whitePuff00", "whitePuff00.png");
        this.load.image("whitePuff01", "whitePuff01.png");
        this.load.image("whitePuff02", "whitePuff02.png");
        this.load.image("whitePuff03", "whitePuff03.png");

        // Load the Kenny Rocket Square bitmap font
        // This was converted from TrueType format into Phaser bitmap
        // format using the BMFont tool.
        // BMFont: https://www.angelcode.com/products/bmfont/
        // Tutorial: https://dev.to/omar4ur/how-to-create-bitmap-fonts-for-phaser-js-with-bmfont-2ndc
        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");

        this.load.audio("boom", "explosionCrunch_000.ogg");
        this.load.audio("pew", "laserSmall_000.ogg");
        this.load.audio("bigBoom", "explosionCrunch_004.ogg");

        this.enemyMoveSpeed = 2;  // Speed at which enemies move horizontally
        this.enemyMoveDirection = 1;  // 1 represents moving right, -1 represents moving left
    }

    create() {

        let my = this.my;

        this.restart();
        
        my.sprite.ship = this.add.sprite(game.config.width/2, game.config.height - 40, "ship");
        my.sprite.ship.setScale(0.5);

        this.anims.create({
            key: "puff",
            frames: [
                { key: "whitePuff00" },
                { key: "whitePuff01" },
                { key: "whitePuff02" },
                { key: "whitePuff03" },
            ],
            frameRate: 20,    // Note: case sensitive (thank you Ivy!)
            repeat: 5,
            hideOnComplete: true
        });

        // Create key objects
        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.up = this.input.keyboard.addKey("W");
        this.down = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 8;
        this.laserSpeed = 7;
        this.enemyLaserSpeed = 7;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Ducks and Destroyers: Destroyer Time!</h2><br>A: Left | D: Right | W: Up | S: Down | Space: Shoot<br>Don\'t get hit by astroids or enemy ships!'

        // Put score on screen
        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);

        //put difficulty in screen
        my.text.wave = this.add.bitmapText(10, 550, "rocketSquare", "Difficulty: " + this.difficultyNum);

        // Put title on screen
        this.add.text(10, 5, "Destroyer Destruction!", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 250
            }
        });

        function getRandomNum(min, max) {
            return Math.random() * (max - min) + min;
        }

        for (let x = 0; x < this.enemiesNum; x += 1) {
            my.sprite.enemies.push(this.add.sprite(getRandomNum(0, game.config.width), getRandomNum(0, game.config.height/4), "astroid"));
        }

        for (let x = 0; x < this.enemiesNum2; x += 1) {
            my.sprite.enemies2.push(this.add.sprite(getRandomNum(0, game.config.width/4), getRandomNum(0, game.config.height/2), "enemyShip"));
        }
        
    }

    update() {
        let my = this.my;

        function getRandomNum(min, max) {
            return Math.random() * (max - min) + min;
        }

        // Moving left
        if (this.left.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.ship.x > (my.sprite.ship.displayWidth/2)) {
                my.sprite.ship.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.ship.x < (game.config.width - (my.sprite.ship.displayWidth/2))) {
                my.sprite.ship.x += this.playerSpeed;
            }
        }

        // Moving left
        if (this.up.isDown) {
            // Check to make sure the sprite can actually move left
            if (my.sprite.ship.y > (my.sprite.ship.displayHeight/2)) {
                my.sprite.ship.y -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.down.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.ship.y < (game.config.height - (my.sprite.ship.displayHeight/2))) {
                my.sprite.ship.y += this.playerSpeed;
            }
        }

        // Check for laser being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            // Are we under our laser quota?
            if (my.sprite.laser.length < this.maxLasers) {
                my.sprite.laser.push(this.add.sprite(
                    my.sprite.ship.x, my.sprite.ship.y-(my.sprite.ship.displayHeight/2), "laser")
                );
                this.sound.play("pew", {
                    volume: 0.5   // Can adjust volume using this, goes from 0 to 1
                });
            }
        }

        //fire enemy laser
        for (let enemy of my.sprite.enemies2) {
            if (Math.random() < 0.01) {
                if (my.sprite.enemyLaser.length < this.maxEnemyLaser) {
                    my.sprite.enemyLaser.push(this.add.sprite(
                        enemy.x, enemy.y + (enemy.displayHeight/2), "enemyLaser")
                    );
                }
            }
        }
        

        //flip the ship depending on what side of the screen we are on
        if (my.sprite.ship.x < config.width/2) {
            my.sprite.ship.flipX = true;
        } else {
            my.sprite.ship.flipX = false;
        }

        my.sprite.laser = my.sprite.laser.filter((laser) => laser.y > -(laser.displayHeight/2));
        my.sprite.enemyLaser = my.sprite.enemyLaser.filter((enemyLaser) => enemyLaser.y < (game.config.height + enemyLaser.displayHeight/2 ));

        // Check for collision with the enemies
        for (let laser of my.sprite.laser) {
            for (let enemy of my.sprite.enemies) {
                if (this.collides(enemy, laser)) {
                    // start animation
                    this.puff = this.add.sprite(enemy.x, enemy.y, "whitePuff03").setScale(0.25).play("puff");
                    // clear out laser -- put y offscreen, will get reaped next update
                    laser.y = -100;
                    enemy.visible = false;
                    this.waveCheck += 1;
                    enemy.x = -100;
                    // Update score
                    this.myScore += enemy.scorePoints;
                    this.updateScore();
                    // Play sound
                    this.sound.play("boom", {
                        volume: 0.5   // Can adjust volume using this, goes from 0 to 1
                    });
                    // Have new enemy appear after end of animation
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        enemy.visible = true;
                        enemy.x = getRandomNum(0, game.config.width/4);
                    }, this);
                }
            }
        }

        // Check for collision with the enemies
        for (let laser of my.sprite.laser) {
            for (let enemy2 of my.sprite.enemies2) {
                if (this.collides(enemy2, laser)) {
                    // start animation
                    this.puff = this.add.sprite(enemy2.x, enemy2.y, "whitePuff03").setScale(0.25).play("puff");
                    // clear out laser -- put y offscreen, will get reaped next update
                    laser.y = -100;
                    enemy2.visible = false;
                    this.waveCheck += 1;
                    enemy2.x = -100;
                    // Update score
                    this.myScore += enemy2.scorePoints;
                    this.updateScore();
                    // Play sound
                    this.sound.play("boom", {
                        volume: 0.5   // Can adjust volume using this, goes from 0 to 1
                    });
                    // Have new enemies appear after end of animation
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        enemy2.visible = true;
                        enemy2.x = getRandomNum(0, game.config.width/4);
                    }, this);
                }
            }
        }

        // Check for collision with the enemies
        for (let enemy of my.sprite.enemies) {
            for (let enemy2 of my.sprite.enemies2) {
                if (this.collides(enemy2, my.sprite.ship) || this.collides(enemy, my.sprite.ship)) {
                    // start animation
                    this.puff = this.add.sprite(my.sprite.ship.x, my.sprite.ship.y, "whitePuff03").setScale(0.25).play("puff");
                    // clear out laser -- put y offscreen, will get reaped next update
                    my.sprite.ship.x = -10000;
                    this.updateScore();
                    // Play sound
                    this.sound.play("bigBoom", {
                        volume: 0.5   // Can adjust volume using this, goes from 0 to 1
                    });
                    // Have new enemies appear after end of animation
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        this.scene.start("endScreen");
                    }, this);
                }
                if (this.collides(enemy, my.sprite.ship)) {
                    // start animation
                    this.puff = this.add.sprite(my.sprite.ship.x, my.sprite.ship.y, "whitePuff03").setScale(0.25).play("puff");
                    // clear out laser -- put y offscreen, will get reaped next update
                    my.sprite.ship.x = -10000;
                    this.updateScore();
                    // Play sound
                    this.sound.play("bigBoom", {
                        volume: 0.5   // Can adjust volume using this, goes from 0 to 1
                    });
                    // Have new enemies appear after end of animation
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        this.scene.start("endScreen");
                    }, this);
                }
            }
        }

        //check for laser collision with player
        for (let laser of my.sprite.enemyLaser) {
            if (this.collides(laser, my.sprite.ship)) {
                // start animation
                this.puff = this.add.sprite(my.sprite.ship.x, my.sprite.ship.y, "whitePuff03").setScale(0.25).play("puff");
                // clear out laser -- put y offscreen, will get reaped next update
                my.sprite.ship.x = -10000;
                this.updateScore();
                // Play sound
                this.sound.play("bigBoom", {
                    volume: 0.5   // Can adjust volume using this, goes from 0 to 1
                });
                // Have new enemies appear after end of animation
                this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.scene.start("endScreen");
                }, this);
            }
        }

        for (let enemy of my.sprite.enemies) {
            enemy.setScale(0.5);
            enemy.y += this.enemyMoveSpeed;
            enemy.scorePoints = 15;
            if (enemy.y > game.config.height) {
                enemy.y = getRandomNum(0, game.config.height/4);
                enemy.x = getRandomNum(0, game.config.width);
                this.waveCheck += 1;
            }
        }

        for (let enemy2 of my.sprite.enemies2) {
            let switchDirection = true;
            enemy2.setScale(0.75);
            enemy2.scorePoints = 30;
            if (enemy2.x <= game.config.width * 0.25) {
                enemy2.x += this.enemyMoveSpeed;
            }
            else if (enemy2.x > game.config.width * 0.25 && enemy2.x <= game.config.width * 0.5) {
                enemy2.x += this.enemyMoveSpeed * 2;
            }
            else if (enemy2.x > game.config.width * 0.5 && enemy2.x <= game.config.width * 0.75) {
                enemy2.x += this.enemyMoveSpeed;
            }
            else if (enemy2.x > game.config.width * 0.75 && enemy2.x <= game.config.width) {
                enemy2.x += this.enemyMoveSpeed * 1.5;
            }

            if (enemy2.x > game.config.width) {
                enemy2.x = getRandomNum(0, game.config.width/4)
            }
        }

        // Make all of the lasers move
        for (let laser of my.sprite.laser) {
            laser.setScale(0.5);
            laser.y -= this.laserSpeed;
        }

        // Make all of the lasers move
        for (let laser of my.sprite.enemyLaser) {
            laser.setScale(0.5);
            laser.y += this.laserSpeed;
        }


        //waves will increased when # of enemies have been killed or made it to the end
        if (this.waveCheck == 10) {
            this.waveCheck = 0;
            this.enemyMoveSpeed += 0.5;
            this.difficultyNum += 1;
            this.enemyLaserSpeed += 0.2;
            this.updateWave();
        }

        game.config.scoreDestroyer = this.myScore;

    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }

    updateWave() {
        let my = this.my;
        my.text.wave.setText("Wave: " + this.waveNum);
    }

    updateWave() {
        let my = this.my;
        my.text.wave.setText("Difficulty: " + this.difficultyNum);
    }

    restart() {
        this.enemyMoveSpeed = 2;
        this.enemyMoveDirection = 1;
        this.my.sprite.laser = []; 
        this.my.sprite.enemies = [];
        this.enemiesNum = 5;
        this.my.sprite.enemyLaser = [];
        this.my.sprite.enemies2 = [];
        this.enemiesNum2 = 3;
        this.myScore = 0;
        this.waveCheck = 0;
        this.difficultyNum = 1;

        this.enemyMoveSpeed = 2;

        this.enemyLaserSpeed = 7;
    }

}
         