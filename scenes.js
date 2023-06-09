class Guide extends Phaser.Scene {
    constructor() {
        super({key: "Guide"});
    }

    create() {
        this.cameras.main.fadeIn(1000, 255, 255, 255);
        this.cameras.main.setBackgroundColor('#ffffff');

        let textConfig = {
            fontSize: Math.round(game.config.width * 0.025) + 'px', // Adjust the scaling factor as needed
            color: '#000000'
        };

        let intro = this.add.text(desiredWidth / 2, desiredHeight / 2, "If you are playing on mobile\nPlease turn your device horizontally\nand refresh the page\nIf you are on PC, please continue", textConfig).setOrigin(0.5);
        this.input.on('pointerdown', (pointer) => {
            // Check if left button was pressed
            if (pointer.leftButtonDown() ) {
                // Transition to the Play scene
                this.scene.start('VideoScene');
            }
        }); 
    }
}

class VideoScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VideoScene' });
    }
    preload() {
        this.load.path = "./assets/";
        this.load.video('anime', 'video/anim.mp4')
 
    }
    create() {
        const video = this.add.video(desiredWidth / 2, desiredHeight / 2, 'anime'); // Use the key of the loaded video

        // Play the video
        video.play();

        // Transition to the next scene when the video ends
        video.on('complete', () => {
            this.scene.start('Intro');
        });
    }

}

class Intro extends Phaser.Scene {
    constructor() {
        super({key: "Intro"});
    }

    preload() {
        this.load.path = "./assets/";
        this.load.image("Logo", "image/logo.png");
    }    

    create() {
        let centerX = this.cameras.main.width / 2;
        this.isAnimationFinished = false;
        
        let Logo = this.add.sprite(0, 0, "Logo").setOrigin(0);
        Logo.setScale(game.config.width / Logo.width, game.config.height / Logo.height);
        Logo.alpha = 0;
        this.tweens.add({
          targets: Logo,
          alpha: 1,
          duration: 1000,
        });

        this.tweens.add({
            targets: Logo,
            alpha: 0,
            delay: 2000,  // Delay in milliseconds before starting the fade out animation
            duration: 1000,
          });

        this.time.addEvent({
            delay: 3250,
            callback: () => {
                this.onAnimationComplete();
            },
            callbackScope: this
        });
    
    }

    onAnimationComplete() {
        this.isAnimationFinished = true;
    }

    update() {
        if (this.isAnimationFinished) {
          this.scene.start("Menu", { bgmCheck: true, firstTime: true });
        }
    }
}

class Menu extends Phaser.Scene {
    constructor() {
        super({key: "Menu"});
    }

    init (data)
    {
        console.log('init', data);
        this.isPlaying = data.bgmCheck;
        this.first = data.firstTime;
    }

    preload() {
        this.load.path = "./assets/";
        //this.load.image("title", "image/title.png");
        this.load.image("hand", "image/PokerHandMenu.png");
        this.load.image("bg", "image/bg.png");
        this.load.image("audio", "image/audio.png");
        this.load.audio("bgm", "audio/bgm.mp3");
    }    

    create() {
        this.cameras.main.fadeIn(1000, 255, 255, 255);
        this.cameras.main.setBackgroundColor('#ffffff');
        let textConfig = {
            fontSize: Math.round(game.config.width * 0.025) + 'px', // Adjust the scaling factor as needed
            color: '#000000'
        };

        let bgm = this.sound.add("bgm", {loop : true, autoPlay: false});

        
        
        // Enable global drag input
        this.input.on('dragstart', function (pointer) {
            // Store the initial drag position
            let initialDragX = pointer.x;
        }, this);

        this.input.on('drag', function (pointer) {
            // Calculate the distance dragged
            const dragDistance = pointer.x - initialDragX;

            // Update the camera scroll based on the drag distance
            this.cameras.main.scrollX -= dragDistance * 0.5; // Adjust the scroll speed as needed

            // Store the new initial drag position for the next drag event
            initialDragX = pointer.x;
        }, this);

        let bg = this.add.image(0, 0, 'bg').setOrigin(0);

        // Set the scale to fit the entire screen
        bg.setScale(game.config.width / bg.width, game.config.height / bg.height);
        let bgmText = this.add.text(150, 550, "bgm is playing", {
            fontSize: Math.round(game.config.width * 0.025) + 'px', // Adjust the scaling factor as needed
            color: '#ffffff'
        }).setOrigin(0.5);
        bgmText.setAlpha(0);

        let audio = this.add.image(desiredWidth * (50/1080), desiredHeight * (50/600), "audio");
        audio.setScale(0.1*(game.config.width / audio.width), 0.1*(game.config.height / audio.height));
        audio.setInteractive();

        if (this.first) {
            bgm.play();
            bgm.setVolume(1);
            this.isPlaying = true;
            bgmText.setAlpha(1);
        }

        if (this.isPlaying) {
            bgmText.setAlpha(1);
        }

        audio.on('pointerup', function() {
            if (this.isPlaying) {
                this.sound.stopAll();
                this.isPlaying = false;
                bgmText.setAlpha(0);
            }

            else {
                bgm.play();
                bgm.setVolume(1);
                this.isPlaying = true;
                bgmText.setAlpha(1);
            }
        }, this);
        
        let poker = this.add.image(desiredWidth * (750/1080), this.cameras.main.centerY, "hand");
        poker.setScale(0.5*(game.config.width / poker.width), game.config.height / poker.height);

        let menu = this.add.text(desiredWidth * (735/1080), desiredHeight * (100/600), "EXIT   CREDIT    PLAY", textConfig).setOrigin(0.5);

        //let title = this.add.sprite(desiredWidth * (870/1080), desiredHeight * (95/600), "title");
        //title.setScale(game.config.width / bg.width, game.config.height / bg.height);
        let playRect = this.add.rectangle(desiredWidth * (890/1080), desiredHeight * (110/600), desiredWidth* (185/1080), desiredHeight * (240/600), 0x000000);
        playRect.setAngle(15);
        playRect.setAlpha(0.001);
        playRect.setInteractive(); // Make the rectangle interactive for input events

        playRect.on('pointerup', function() {
          this.scene.start("Instruct", { bgmCheck: this.isPlaying });
        }, this);

        let setRect = this.add.rectangle(desiredWidth * (740/1080), desiredHeight * (100/600), desiredWidth* (160/1080), desiredHeight * (180/600), 0x000000);
        setRect.setAlpha(0.001);
        setRect.setInteractive(); // Make the rectangle interactive for input events

        setRect.on('pointerup', function() {
          this.scene.start('Credit', { bgmCheck: this.isPlaying });
        }, this);

        let exitRect = this.add.rectangle(desiredWidth * (615/1080), desiredHeight * (130/600), desiredWidth* (130/1080), desiredHeight * (160/600), 0x000000);
        exitRect.setAngle(-20);
        exitRect.setAlpha(0.001);
        exitRect.setInteractive(); // Make the rectangle interactive for input events

        exitRect.on('pointerup', function() {
            window.close();
        });

        this.add.text(1050, 580, "📺", textConfig).setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => {
                if (this.scale.isFullscreen) {
                    this.scale.stopFullscreen();
                } else {
                    this.scale.startFullscreen();
                }
            });
    }
}   

class Instruct extends Phaser.Scene {
    constructor() {
        super({key: "Instruct"});
    }

    init (data)
    {
        console.log('init', data);
        this.isPlaying = data.bgmCheck;
    }

    create() {
        this.cameras.main.fadeIn(1000, 255, 255, 255);
        this.cameras.main.setBackgroundColor('#ffffff');

        let textConfig = {
            fontSize: Math.round(game.config.width * 0.025) + 'px', // Adjust the scaling factor as needed
            color: '#000000'
        };

        let intruct = this.add.text(desiredWidth / 2, desiredHeight / 2, "Use the D-pad or WASD to move\nClick on the screen to shoot\nYou can't shoot while moving\nKill the cops before they get you\nClear current room to move to the next one\nGood luck escaping", textConfig).setOrigin(0.5);
        this.input.on('pointerdown', (pointer) => {
            // Check if left button was pressed
            if (pointer.leftButtonDown()) {
                // Transition to the Play scene
                this.scene.start('Play', { bgmCheck: this.isPlaying });
            }
        });

        if (this.isPlaying) {
            let bgmText = this.add.text(900, 550, "bgm is playing", {
                fontSize: Math.round(game.config.width * 0.025) + 'px', // Adjust the scaling factor as needed
                color: '#000000'
            }).setOrigin(0.5);    
        }
    }
}
class Play extends Phaser.Scene {
    constructor() {
        super({key: "Play"});
    }

    init (data)
    {
        console.log('init', data);
        this.isPlaying = data.bgmCheck;
    }

    preload() {
        this.load.path = "./assets/";
        this.load.image('ground', 'image/background.png')
        this.load.image('character', 'image/mc.png')
        this.load.image('cards', 'image/tfcard.png')
        this.load.image('enemy1', 'image/police.png')
        this.load.audio("atkhit", "audio/atkhit.mp3");
    }

    create() {
        this.cameras.main.setBackgroundColor('#ffffff');
        this.enemies = this.physics.add.group();
        this.cards = this.physics.add.group();
        this.ended = false;
        let textConfig = {
            fontSize: Math.round(game.config.width * 0.025) + 'px', // Adjust the scaling factor as needed
            color: '#ffffff'
        };

        this.isMoving = false;
        
        let background = this.add.image(0, 0, 'ground');
        this.scalex = desiredWidth / background.width;
        this.scaley = desiredHeight / background.height;
        background.setScale(this.scalex, this.scaley);
        background.setScale(15); // Set the scale to make it 10 times bigger
        background.setPosition(desiredWidth / 2, desiredHeight / 2);
        // Get the scaled dimensions of the background image
        const scaledWidth = background.width * background.scaleX;
        const scaledHeight = background.height * background.scaleY;
        if (this.isPlaying) {
            let bgmText = this.add.text(900, 550, "bgm is playing", {
                fontSize: Math.round(game.config.width * 0.025) + 'px', // Adjust the scaling factor as needed
                color: '#ffffff'
            }).setOrigin(0.5);
            bgmText.setScrollFactor(0);
        }
        // Set the size of the physics world to match the scaled background size
        this.physics.world.setBounds(0.43*(-scaledWidth/2), 0.35*(-scaledHeight/2), 0.5*(scaledWidth), 0.4*(scaledHeight));

        this.player = this.physics.add.sprite(desiredWidth / 2, desiredHeight / 2, 'character');
        this.player.setScale(this.scalex, this.scaley);
        this.cameras.main.startFollow(this.player);
        this.physics.world.enable(this.player);
        this.player.setCollideWorldBounds(true);

        this.time.addEvent({
            delay: 5000, // 5 seconds
            loop: true,
            callback: this.spawnEnemy,
            callbackScope: this
        });

        this.time.addEvent({
            delay: 15000, // 15 second
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        this.time.addEvent({
            delay: 20000, // 20 second
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        });

        this.physics.add.collider(this.player, this.enemies, this.Playerhit, null, this);

        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.cardDelay = 1500; // Delay between card throws in milliseconds
        this.lastCardTime = 0; // Timestamp of the last card throw

        let countdownTextCreated = false;
        let countdownText = this.add.text(desiredWidth / 2, desiredHeight * 0.1, '', textConfig);

        if (!countdownTextCreated) {
            countdownText.setText('60');
            countdownText.setOrigin(0.5);
            countdownText.setScrollFactor(0);
            //countdownText.background("#FFFFFF");
            countdownTextCreated = true;
        }

        this.countdown = 60;

        this.time.addEvent({
            delay: 1000, // 1 second
            callback: updateCountdown,
            callbackScope: this,
            loop: true
        });

        function updateCountdown() {
            if (this.countdown <= 0) {
                this.scene.start('GoodEnd', { bgmCheck: this.isPlaying });
            }

            else {
                this.countdown--;
                countdownText.setText(this.countdown.toString());
            }
        }

        let controlRect = new Phaser.Geom.Rectangle(40 * this.scalex, 440 * this.scaley, 210 * this.scalex, 220 * this.scaley);
        
        this.input.on('pointerdown', (pointer) => {
          const currentTime = this.time.now;
          const isPointerInControlArea = controlRect.contains(pointer.x, pointer.y);
        
          if (isPointerInControlArea) {
            return;
          }
        
          if (!this.isMoving && currentTime - this.lastCardTime >= this.cardDelay) {
            this.lastCardTime = currentTime;
        
            const playerX = this.player.x;
            const playerY = this.player.y;
            const pointerX = pointer.worldX;
            const pointerY = pointer.worldY;
        
            // Calculate the angle between the player and the pointer
            const angle = Phaser.Math.Angle.Between(playerX, playerY, pointerX, pointerY);
        
            // Create the three cards with different angles
            for (let i = -1; i <= 1; i++) {
              const card = this.physics.add.sprite(playerX, playerY, 'cards');
              card.setScale(desiredWidth / background.width, desiredHeight / background.height);
              const cardAngle = angle + Phaser.Math.DegToRad(i * 15);
              const cardSpeed = 500;
              this.cards.add(card);
              // Set the velocity of the card towards the pointer
              card.setVelocity(
                Math.cos(cardAngle) * cardSpeed,
                Math.sin(cardAngle) * cardSpeed
              );
        
              card.setRotation(cardAngle);
        
              this.time.delayedCall(3000, () => {
                card.destroy();
              }, [], this);
            }
          }
        
          this.physics.add.collider(this.cards, this.enemies, this.Cardhit, null, this);
        });
    }

    spawnEnemy() {
        if (!this.ended) {
            //const spawnDistance = desiredWidth; // Adjust the distance from the player as needed
            const enemyCount = 5; // Number of enemies to spawn
            const spacing = 50; // Spacing between each enemy
        
            // Calculate the total width of all enemies and spacing
            const totalWidth = (enemyCount - 1) * spacing;
            // Get a random number between 0 and 1
            let randomValue = Phaser.Math.Between(0, 1);

            // Map the randomValue to a range of 1 and -1
            let randomSign = randomValue === 0 ? -1 : 1;

            // Calculate the starting X position
            const startX = this.player.x + (desiredWidth * 0.5 * randomSign);
        
            for (let i = 0; i < enemyCount; i++) {
                // Calculate the spawn position based on the current index
                const spawnX = startX + i * spacing;
                const spawnY = this.player.y * 0.5* randomSign;
        
                // Create the enemy sprite at the spawn position
                const enemy = this.physics.add.sprite(spawnX, spawnY, 'enemy1');
                enemy.setScale(this.scalex, this.scaley);
                this.enemies.add(enemy);

                enemy.body.setCollideWorldBounds(true);

                // ...
            }
        }
    }
    
    Cardhit(card, enemy) {
        // Destroy the card and enemy
        let sfx = this.sound.add("atkhit", {loop : false, autoplay: true});
        sfx.play();
        sfx.setVolume(1);

        let cardText = this.add.text(950, 520, "card hit", {
            fontSize: Math.round(game.config.width * 0.025) + 'px', // Adjust the scaling factor as needed
            color: '#ffffff'
        }).setOrigin(0.5);
        
        cardText.setScrollFactor(0);

        this.time.delayedCall(1000, () => {
            cardText.setVisible(false);
        });

        card.destroy();
        enemy.destroy();
    }
    
    Playerhit(player, enemy) {
        this.ended = true;
        this.tweens.add({
            targets: player,
            angle: '+=' + 90, // Rotate by 90 degrees to the right
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
                this.scene.start('BadEnd', { bgmCheck: this.isPlaying });
            },
            callbackScope: this
        });
    }

    update() {
        if (!this.ended) { // Handle player movement
            // Create movement control rectangles
            let upRect = new Phaser.Geom.Rectangle(120 * this.scalex, 445 * this.scaley, 50 * this.scalex, 75 * this.scaley); // Rectangle for moving up
            let downRect = new Phaser.Geom.Rectangle(120 * this.scalex, 580 * this.scaley, 50 * this.scalex, 75 * this.scaley); // Rectangle for moving down
            let leftRect = new Phaser.Geom.Rectangle(45 * this.scalex, 525 * this.scaley, 70 * this.scalex, 50 * this.scaley); // Rectangle for moving left
            let rightRect = new Phaser.Geom.Rectangle(175 * this.scalex, 525 * this.scaley, 70 * this.scalex, 50 * this.scaley); // Rectangle for moving right
            
            // Draw movement control rectangles
            const graphics = this.add.graphics().setDepth(1); // Set depth to render on top
            graphics.fillStyle(0x00ff00, 1); // Set fill color to green with alpha 1 (fully opaque)
            graphics.fillRectShape(upRect).setScrollFactor(0);
            graphics.fillRectShape(downRect).setScrollFactor(0);
            graphics.fillRectShape(leftRect).setScrollFactor(0);
            graphics.fillRectShape(rightRect).setScrollFactor(0);

            if (this.cursors.up.isDown || Phaser.Geom.Rectangle.Contains(upRect, this.input.activePointer.x, this.input.activePointer.y)) {
                this.isMoving = true;
                this.player.setVelocityY(-250);
            } else if (this.cursors.down.isDown || Phaser.Geom.Rectangle.Contains(downRect, this.input.activePointer.x, this.input.activePointer.y)) {
                this.isMoving = true;
                this.player.setVelocityY(250);
            } else {
                this.isMoving = false;
                this.player.setVelocityY(0); // Stop vertical movement
            }
            
            if (this.cursors.left.isDown || Phaser.Geom.Rectangle.Contains(leftRect, this.input.activePointer.x, this.input.activePointer.y)) {
                this.isMoving = true;
                this.player.setVelocityX(-250);
            } else if (this.cursors.right.isDown || Phaser.Geom.Rectangle.Contains(rightRect, this.input.activePointer.x, this.input.activePointer.y)) {
                this.isMoving = true;
                this.player.setVelocityX(250);
            } else {
                this.isMoving = false;
                this.player.setVelocityX(0); // Stop horizontal movement
            }
    
            this.enemies.getChildren().forEach((enemy) => {
                // Move the enemy towards the player
                this.physics.moveToObject(enemy, this.player, 270);
            });
        }
    }
    
}

class BadEnd extends Phaser.Scene {
    constructor() {
        super({key: 'BadEnd'});
    }

    init (data)
    {
        console.log('init', data);
        this.isPlaying = data.bgmCheck;
    }

    create() {
        this.cameras.main.fadeIn(1000, 255, 255, 255);
        this.cameras.main.setBackgroundColor('#ffffff');

        let textConfig = {
            fontSize: Math.round(game.config.width * 0.025) + 'px', // Adjust the scaling factor as needed
            color: '#000000'
        };

        if (this.isPlaying) {
            let bgmText = this.add.text(900, 550, "bgm is playing", {
                fontSize: Math.round(game.config.width * 0.025) + 'px', // Adjust the scaling factor as needed
                color: '#000000'
            }).setOrigin(0.5);
        }

        this.add.text(desiredWidth / 2, desiredHeight / 2, "Bad Ending: You got caught", textConfig).setOrigin(0.5);

        let menu = this.add.rectangle(desiredWidth / 2, desiredHeight * 0.9, desiredWidth * (200 / 1080), desiredHeight * (100 / 600), 0x000000); // Set the color of the rectangle to black

        let textMenu = this.add.text(desiredWidth / 2, desiredHeight * 0.9, "Menu", { ...textConfig, color: '#ffffff' }).setOrigin(0.5); // Set the color of the text to white

        menu.setInteractive(); // Make the rectangle interactive for input events

        menu.on('pointerup', function() {
            this.scene.start('Menu', { bgmCheck: this.isPlaying, firstTime: false });
        }, this);
    }

}

class GoodEnd extends Phaser.Scene {
    constructor() {
        super({key: 'GoodEnd'});
    }

    init (data)
    {
        console.log('init', data);
        this.isPlaying = data.bgmCheck;
    }

    create() {
        this.cameras.main.fadeIn(1000, 255, 255, 255);
        this.cameras.main.setBackgroundColor('#ffffff');

        let textConfig = {
            fontSize: Math.round(game.config.width * 0.025) + 'px', // Adjust the scaling factor as needed
            color: '#000000'
        };

        if (this.isPlaying) {
            let bgmText = this.add.text(900, 550, "bgm is playing", {
                fontSize: Math.round(game.config.width * 0.025) + 'px', // Adjust the scaling factor as needed
                color: '#000000'
            }).setOrigin(0.5);
        }

        this.add.text(desiredWidth / 2, desiredHeight / 2, "Good Ending: You survived", textConfig).setOrigin(0.5);

        let menu = this.add.rectangle(desiredWidth / 2, desiredHeight * 0.9, desiredWidth * (200 / 1080), desiredHeight * (100 / 600), 0x000000); // Set the color of the rectangle to black

        let textMenu = this.add.text(desiredWidth / 2, desiredHeight * 0.9, "Menu", { ...textConfig, color: '#ffffff' }).setOrigin(0.5); // Set the color of the text to white

        menu.setInteractive(); // Make the rectangle interactive for input events

        menu.on('pointerup', function() {
            this.scene.start('Menu', { bgmCheck: this.isPlaying, firstTime: false });
        }, this);
    }
} 

class Credit extends Phaser.Scene {
    constructor() {
        super({key: "Credit"});
    }

    init (data)
    {
        console.log('init', data);
        this.isPlaying = data.bgmCheck;
    }

    create() {
        this.cameras.main.setBackgroundColor('#ffffff');
        let textConfig = {
            fontSize: Math.round(game.config.width * 0.025) + 'px', // Adjust the scaling factor as needed
            color: '#000000'
        };

        if (this.isPlaying) {
            let bgmText = this.add.text(900, 550, "bgm is playing", {
                fontSize: Math.round(game.config.width * 0.025) + 'px', // Adjust the scaling factor as needed
                color: '#000000'
            }).setOrigin(0.5);    
        }

        let back = this.add.rectangle(desiredWidth * 0.1, desiredHeight * 0.9, desiredWidth* (200/1080), desiredHeight * (100/600), 0x000000);
        back.setInteractive(); // Make the rectangle interactive for input events

        let tempSet = this.add.text(desiredWidth / 2, desiredHeight / 2, "Core gameplay: Nguyen Vu\nArt: Jeevithan Mahenthran\nConcepts and Cinematic: Gabriel Yunjia", textConfig).setOrigin(0.5);
        let textBack = this.add.text(desiredWidth * 0.1, desiredHeight * 0.9, "Back", {
            fontSize: Math.round(game.config.width * 0.025) + 'px', // Adjust the scaling factor as needed
            color: '#ffffff'
        }).setOrigin(0.5);

        back.on('pointerup', function() {
            this.scene.start('Menu', { bgmCheck: this.isPlaying, firstTime: false });
        }, this);
    }
}
