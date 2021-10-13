// The title of the game to be displayed on the title screen
title = "CHARGE RUSH";
// The description, which is also displayed on the title screen
description = `
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

    FBULLET_SPEED: 5
};
// Game runtime options
// Refer to the official documentation for all available options
options = {
	viewSize: {x: GAME_WINDOW.WIDTH, y: GAME_WINDOW.HEIGHT}

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

 


// The game loop function
function update() {
   // The init function
	if (!ticks) {
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
		
	}

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
	// counter for bullets shot
 text(fBullets.length.toString(), 3, 10);
 //  destroy bullets
 remove(fBullets, (fb) => {
	return fb.pos.y < 0;
});	
}
