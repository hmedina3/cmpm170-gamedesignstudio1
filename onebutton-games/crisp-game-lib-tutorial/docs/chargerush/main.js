// The title of the game to be displayed on the title screen
title = "CHARGE RUSH";
// The description, which is also displayed on the title screen
description = `
Destroy enemies.
`;
// The array of custom sprites
/* l and c are actually short forms 
 of the color black and cyan - there's a list of
 colors on the github page */
 // In CrispGameLib, the drawing origin is in the middle.
characters = [
`
  ll
  ll
ccllcc
ccllcc
ccllcc
cc  cc
`,`

rr  rr
rrrrrr
rrpprr
rrrrrr
  rr
  rr
`,`
y  y
yyyyyy
 y  y
yyyyyy
 y  y
`
];

// javascript object that sets the dimensions of
// note* good practice to captalise const names 
const GAME_WINDOW = {
	WIDTH: 100,
	HEIGHT: 150,
	STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.0,
	PLAYER_FIRE_RATE: 4,
    PLAYER_GUN_OFFSET: 3,
   

    FBULLET_SPEED: 5,

    ENEMY_MIN_BASE_SPEED: 1.0,
    ENEMY_MAX_BASE_SPEED: 2.0,
    ENEMY_FIRE_RATE: 45,

    EBULLET_SPEED: 2.0,
    EBULLET_ROTATION_SPD: 0.1
};
// Game runtime options
// Refer to the official documentation for all available options
options = {
	viewSize: {x: GAME_WINDOW.WIDTH, y: GAME_WINDOW.HEIGHT},
    seed:2,
    isPlayingBgm: true,
    isReplayEnabled: true, // plays replay of last session
    theme: "dark", //   theme?: "simple" | "pixel" | "shape" | "shapeDark" | "crt" | "dark";
    isCapturing: true, // Gif capturing
    isCapturingGameCanvasOnly: true, //^
    captureCanvasScale: 2 //^
}

/**
* @typedef { object } Star - A decorative floating object in the background
* @property { Vector } pos - The current position of the object
* @property { number } speed - The downwards floating speed of this object
*/
/**
* @type  { Star [] }
*/
let stars;

/**
* @typedef { object } Player - main player object
* @property { Vector } pos - The current position of the object
* @property { number } firingCooldown - Timer of firing
* @property { boolean } isFiringLeft - Checks if player is firing
*/
/**
 * @type { Player }
 */
let player;

/**
 * @typedef {object} FBullet - Friendly Bullets
 * @property {Vector} pos - positions of bullets
 */
/**
 * @type { FBullet[] }
 */

// Friendly bullets
 let fBullets;
/******************************Enemy Code***************************************/
 /**
* @typedef { object } Enemy - main player object
* @property { Vector } pos - The current position of the object
* @property { number } firingCooldown - Timer of firing
*/
/**
 * @type { Enemy [] }
 */
let enemies;

/**
 * @type { number }
 */
 let currentEnemySpeed;

 /**
  * @type { number }
  */
 let waveCount;

/**
* @typedef { object } EBullet - Enemy Bullets
* @property { Vector } pos - The current position of the object
* @property { number } angle - The current position of the object
* @property { number } rotation - The current position of the object
*/
/**
 * @type { EBullet [] }
 */
 let eBullets;
 
 /*********************************************************************************/



// The game loop function
function update() {
   // The init function
	if (!ticks) {

        // Wave Counter
        waveCount = 0;
		// A CrispGameLib function
        // First argument (number): number of times to run the second argument
        // Second argument (function): a function that returns an object. This
        // object is then added to an array. This array will eventually be
        // returned as output of the times() function.
		stars = times(20, () => {
            // Random number generator function
            // rnd( min, max )
            const posX = rnd(0, GAME_WINDOW.WIDTH);
            const posY = rnd(0, GAME_WINDOW.HEIGHT);
            // An object of type Star with appropriate properties
            return {
	            // Creates a Vector
                pos: vec(posX, posY),
                // More RNG
                speed: rnd(GAME_WINDOW.STAR_SPEED_MIN, GAME_WINDOW.STAR_SPEED_MAX)
            };
        });
		player = {
			pos: vec(GAME_WINDOW.WIDTH * 0.5, GAME_WINDOW.HEIGHT * 0.5),
			firingCooldown: GAME_WINDOW.PLAYER_FIRE_RATE,
			isFiringLeft: true
		};
		// initalised
		fBullets = [];
        eBullets = [];
        // Initalise the values for the enemies:
        enemies = [];

        waveCount = 0;
        currentEnemySpeed = 0;
		
	}

     // spawns enemies
     if (enemies.length === 0) {
        // difficulty increases over time
        currentEnemySpeed =
            rnd(GAME_WINDOW.ENEMY_MIN_BASE_SPEED, GAME_WINDOW.ENEMY_MAX_BASE_SPEED) * difficulty; 
        for (let i = 0; i < 9; i++) {
            const posX = rnd(0, GAME_WINDOW.WIDTH);
            const posY = -rnd(i * GAME_WINDOW.HEIGHT * 0.1);
            enemies.push({ 
                pos: vec(posX, posY),
                firingCooldown: GAME_WINDOW.ENEMY_FIRE_RATE

            });
        }
        // increase the tracking variable by one
        waveCount++;
    }

    // spawns stars
	stars.forEach((s) => {
        // Move the star downwards
        s.pos.y += s.speed;
        // Bring the star back to top once it's past the bottom of the screen
        s.pos.wrap(0, GAME_WINDOW.WIDTH, 0, GAME_WINDOW.HEIGHT);

        // Choose a color to draw
        color("light_black");
        // Draw the star as a square of size 1
        box(s.pos, 1);
    });

    // mouse-input
	player.pos = vec(input.pos.x, input.pos.y);
	player.pos.clamp(0, GAME_WINDOW.WIDTH, 0, GAME_WINDOW.HEIGHT);

	// Cooling down for the next shot
    player.firingCooldown--;
	// Time to fire the next shot
    if (player.firingCooldown <= 0) {
		// Get the side from which the bullet is fired
		// note: short form of if/else is used here
        const offset = (player.isFiringLeft)
            ? -GAME_WINDOW.PLAYER_GUN_OFFSET
            : GAME_WINDOW.PLAYER_GUN_OFFSET;
        // Create the bullet
        fBullets.push({
            pos: vec(player.pos.x + offset, player.pos.y)
        });
        // Reset the firing cooldown
        player.firingCooldown = GAME_WINDOW.PLAYER_FIRE_RATE;
		// switches side of the firing gun
		player.isFiringLeft = !player.isFiringLeft;
		color("yellow");

        // Generate particles
        particle(
            player.pos.x + offset, // x coordinate
            player.pos.y, // y coordinate
            4, // The number of particles
            1, // The speed of the particles
            -PI/2, // The emitting angle
            PI/4  // The emitting width
        );
    }

    /***  character-design  ***/
	// color("cyan");
    color("black");
    // box(player.pos, 4);
	/*
		NOTE:
		Characters are assigned from 'a'.
    	'char("a", 0, 0);' draws the character
   		defined by the first element of the array.
	*/
	char("a", player.pos);



    /*** Bullet Design ***/
	   // Updating and drawing bullets
	   fBullets.forEach((fb) => {
        // Move the bullets upwards
        fb.pos.y -= GAME_WINDOW.FBULLET_SPEED;
        // Drawing
        color("yellow");
        box(fb.pos, 2);
    });
    /**********************************Enemy Design*****************************************/
     // Another update loop - This time, with remove() - draws enemies
     remove(enemies, (e) => {
        e.pos.y += currentEnemySpeed;
        e.firingCooldown--;
        if (e.firingCooldown <= 0) {
            eBullets.push({
                pos: vec(e.pos.x, e.pos.y),
                angle: e.pos.angleTo(player.pos),
                rotation: rnd()
            });
            e.firingCooldown = GAME_WINDOW.ENEMY_FIRE_RATE;
            play("select"); // Be creative, you don't always have to follow the label
        }

        color("black");
    // Shorthand to check for collision against another specific type
    const isCollidingWithFBullets = char("b", e.pos).isColliding.rect.yellow;
     // Check whether to make a small particle explosion at the position
     if (isCollidingWithFBullets) {
        color("yellow");
        particle(e.pos);
        play("explosion"); // Here!
        addScore(10 * waveCount, e.pos);
    }
    // Also another condition to remove the object
    return (isCollidingWithFBullets || e.pos.y > GAME_WINDOW.HEIGHT);
    });

    remove(fBullets, (fb) => {
        // Interaction from fBullets to enemies, after enemies have been drawn
        color("yellow");
        const isCollidingWithEnemies = box(fb.pos, 2).isColliding.char.b;
        return (isCollidingWithEnemies || fb.pos.y < 0);
    });

    remove(eBullets, (eb) => {
        // Old-fashioned trigonometry to find out the velocity on each axis
        eb.pos.x += GAME_WINDOW.EBULLET_SPEED * Math.cos(eb.angle);
        eb.pos.y += GAME_WINDOW.EBULLET_SPEED * Math.sin(eb.angle);
        // The bullet also rotates around itself
        eb.rotation += GAME_WINDOW.EBULLET_ROTATION_SPD;

        color("red");
        const isCollidingWithPlayer
            = char("c", eb.pos, {rotation: eb.rotation}).isColliding.char.a;

        if (isCollidingWithPlayer) {
            // End the game
            end();
            // Sarcasm; also, unintedned audio that sounds good in actual gameplay
            play("powerUp"); 
        }
        
        // If eBullet is not onscreen, remove it
        return (!eb.pos.isInRect(0, 0, GAME_WINDOW.WIDTH, GAME_WINDOW.HEIGHT));
    });
	
}
