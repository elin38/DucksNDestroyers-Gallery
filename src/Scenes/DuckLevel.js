class DuckLevel extends Phaser.Scene {
    constructor() {
        super("duckLevel");

        // Initialize a class variable "my" which is an object.
        // The object has two properties, both of which are objects
        //  - "sprite" holds bindings (pointers) to created sprites
        //  - "text"   holds bindings to created bitmap text objects
        this.my = {sprite: {}, text: {}};

        // Create a property inside "sprite" named "bullet".
        // The bullet property has a value which is an array.
        // This array will hold bindings (pointers) to bullet sprites
        this.my.sprite.bullet = [];   
        this.maxBullets = 10;           // Don't create more than this many bullets

        this.my.sprite.enemies = [];
        this.enemiesNum = 5;

        this.my.sprite.enemies2 = [];
        this.enemiesNum2 = 3;
        
        this.myScore = 0;       // record a score as a class variable
        // More typically want to use a global variable for score, since
        // it will be used across multiple scenes

        this.myHealth = 10;

        this.waveCheck = 0;
        this.waveNum = 1;
        this.maxWaves = 5;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("duck", "duck_target_white.png");
        this.load.image("rifle", "rifle_red.png");
        this.load.image("bullet", "icon_bullet_silver_short.png");
        this.load.image("duck2", "duck_target_yellow.png");


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

        this.load.audio("boop", "tone1.ogg");

        this.enemyMoveSpeed = 2;  // Speed at which ducks move horizontally
        this.enemyMoveDirection = 1;  // 1 represents moving right, -1 represents moving left
    }

    create() {

        let my = this.my;

        this.restart();

        my.sprite.rifle = this.add.sprite(game.config.width/2, game.config.height - 40, "rifle");
        my.sprite.rifle.setScale(0.25);

        // Create white puff animation
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
        this.nextScene = this.input.keyboard.addKey("S");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Set movement speeds (in pixels/tick)
        this.playerSpeed = 8;
        this.bulletSpeed = 7;

        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Ducks and Destroyers: Duck Time!</h2><br>A: Left | D: Right | Space: Shoot<br>Ducks speed up with every wave. Don\'t let them get to the other side!'

        // Put score on screen
        my.text.score = this.add.bitmapText(580, 0, "rocketSquare", "Score " + this.myScore);

        //put health in screen
        my.text.health = this.add.bitmapText(250, 0, "rocketSquare", "Health: " + this.myHealth);

        //put wave in screen
        my.text.wave = this.add.bitmapText(10, 550, "rocketSquare", "Wave: " + this.waveNum + "/" + this.maxWaves);

        // Put title on screen
        this.add.text(10, 5, "Duck Huntin!", {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 150
            }
        });

        function getRandomNum(min, max) {
            return Math.random() * (max - min) + min;
        }

        for (let x = 0; x < this.enemiesNum; x += 1) {
            my.sprite.enemies.push(this.add.sprite(getRandomNum(0, game.config.width/4), getRandomNum(0, game.config.height/2), "duck"));
        }

        for (let x = 0; x < this.enemiesNum2; x += 1) {
            my.sprite.enemies2.push(this.add.sprite(getRandomNum(0, game.config.width/4), getRandomNum(0, game.config.height/2), "duck2"));
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
            if (my.sprite.rifle.x > (my.sprite.rifle.displayWidth/2)) {
                my.sprite.rifle.x -= this.playerSpeed;
            }
        }

        // Moving right
        if (this.right.isDown) {
            // Check to make sure the sprite can actually move right
            if (my.sprite.rifle.x < (game.config.width - (my.sprite.rifle.displayWidth/2))) {
                my.sprite.rifle.x += this.playerSpeed;
            }
        }

        // Check for bullet being fired
        if (Phaser.Input.Keyboard.JustDown(this.space)) {
            if (my.sprite.bullet.length < this.maxBullets) {
                my.sprite.bullet.push(this.add.sprite(
                    my.sprite.rifle.x, my.sprite.rifle.y-(my.sprite.rifle.displayHeight/2), "bullet")
                );
            }
        }

        //flip the rifle depending on what side of the screen we are on
        if (my.sprite.rifle.x < config.width/2) {
            my.sprite.rifle.flipX = true;
        } else {
            my.sprite.rifle.flipX = false;
        }

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));

        // Check for collision with the duck
        for (let bullet of my.sprite.bullet) {
            for (let enemy of my.sprite.enemies) {
                if (this.collides(enemy, bullet)) {
                    // start animation
                    this.puff = this.add.sprite(enemy.x, enemy.y, "whitePuff03").setScale(0.25).play("puff");
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                    enemy.visible = false;
                    this.waveCheck += 1;
                    enemy.x = -100;
                    // Update score
                    this.myScore += enemy.scorePoints;
                    this.updateScore();
                    // Play sound
                    this.sound.play("boop", {
                        volume: 0.75   // Can adjust volume using this, goes from 0 to 1
                    });
                    // Have new duck appear after end of animation
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        enemy.visible = true;
                        enemy.x = getRandomNum(0, game.config.width/4);
                    }, this);
                }
            }
        }

        // Check for collision with the duck
        for (let bullet of my.sprite.bullet) {
            for (let enemy2 of my.sprite.enemies2) {
                if (this.collides(enemy2, bullet)) {
                    // start animation
                    this.puff = this.add.sprite(enemy2.x, enemy2.y, "whitePuff03").setScale(0.25).play("puff");
                    // clear out bullet -- put y offscreen, will get reaped next update
                    bullet.y = -100;
                    enemy2.visible = false;
                    this.waveCheck += 1;
                    enemy2.x = -100;
                    // Update score
                    this.myScore += enemy2.scorePoints;
                    this.updateScore();
                    // Play sound
                    this.sound.play("boop", {
                        volume: 0.75   // Can adjust volume using this, goes from 0 to 1
                    });
                    // Have new duck appear after end of animation
                    this.puff.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                        enemy2.visible = true;
                        enemy2.x = getRandomNum(0, game.config.width/4);
                    }, this);
                }
            }
        }

        for (let enemy of my.sprite.enemies) {
            enemy.setScale(0.5);
            enemy.x += this.enemyMoveSpeed;
            enemy.scorePoints = 10;
            if (enemy.x > game.config.width) {
                this.myHealth -= 1;
                this.waveCheck += 1;
                this.updateHealth();
                enemy.x = getRandomNum(0, game.config.width/4)
            }
        }

        for (let enemy2 of my.sprite.enemies2) {
            let switchDirection = true;
            enemy2.setScale(0.75);
            enemy2.scorePoints = 25;
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
                this.myHealth -= 1;
                this.waveCheck += 1;
                this.updateHealth();
                enemy2.x = getRandomNum(0, game.config.width/4)
            }
        }

        if (this.myHealth <= 0) {
            this.scene.start("endScreen");
        }

        // Make all of the bullets move
        for (let bullet of my.sprite.bullet) {
            bullet.setScale(0.5);
            bullet.y -= this.bulletSpeed;
        }


        //waves will increased when # of ducks have been killed or made it to the end
        if (this.waveCheck >= 10) {
            this.waveCheck = 0;
            this.enemyMoveSpeed += 0.4;
            this.waveNum += 1;
            this.updateWave();
        }

        //when we reach this # of waves, go to the next stage
        if (this.waveNum >= this.maxWaves && this.myHealth > 0) {
            this.scene.start("destroyerLevel");
        }

        game.config.scoreDuck = this.myScore;
    }

    // A center-radius AABB collision check
    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    //update texts
    updateScore() {
        let my = this.my;
        my.text.score.setText("Score " + this.myScore);
    }
    updateHealth() {
        let my = this.my;
        my.text.health.setText("Health: " + this.myHealth);
    }
    updateWave() {
        let my = this.my;
        my.text.wave.setText("Wave: " + this.waveNum + "/5");
    }

    //resets initial values to play the game again
    restart() {
        this.enemyMoveSpeed = 2;
        this.enemyMoveDirection = 1;
        this.my.sprite.bullet = []; 
        this.my.sprite.enemies = [];
        this.enemiesNum = 5;

        this.my.sprite.enemies2 = [];
        this.enemiesNum2 = 3;
        
        this.myScore = 0;
        this.myHealth = 10;
        this.waveCheck = 0;
        this.waveNum = 1;
    }
}
         