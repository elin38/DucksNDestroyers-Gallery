class EndScreen extends Phaser.Scene {
    constructor() {
        super("endScreen");
        this.my = {sprite: {}, text: {}};
    }

    preload() {
        this.total = game.config.scoreDuck + game.config.scoreDestroyer;

        this.load.setPath("./assets/");
        this.load.audio("gameOver", "game_over.ogg");
    }

    create() {

        let my = this.my;

        this.sound.play("gameOver", {
            volume: 0.5   // Can adjust volume using this, goes from 0 to 1
        });

        if (game.config.highScore < this.total) {
            game.config.highScore = this.total;
        }
        // update HTML description
        document.getElementById('description').innerHTML = '<h2>Ducks and Destroyers</h2>'

        // Put score on screen
        my.text.score = this.add.bitmapText(285, 280, "rocketSquare", "Game Over");
        my.text.restart = this.add.bitmapText(180, 330, "rocketSquare", "Press R to Restart");

        this.add.text(170, game.config.height*0.75, "Total Score: " + (Number(game.config.scoreDuck) + Number(game.config.scoreDestroyer)), {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 250
            }
        });

        this.add.text(450, game.config.height*0.75, "High Score: " + game.config.highScore, {
            fontFamily: 'Times, serif',
            fontSize: 24,
            wordWrap: {
                width: 250
            }
        });

        this.restartScene = this.input.keyboard.addKey("R");
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.restartScene)) {
            this.scene.start("duckLevel");
        }
    }
}
         