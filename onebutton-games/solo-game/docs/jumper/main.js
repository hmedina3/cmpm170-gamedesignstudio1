title = "Jumper";
// http://localhost:4000/?Jumper
description = `
[Hold] ready jump
[Release] to jump
`;

characters = [
`rrrr
rrrr
rrrr
rrrr
rrrr
rrrr`,

`bb
bb
bb
bb
bb
bb`
];

	const GAME_WINDOW = {
		WIDTH: 200,
		HEIGHT: 100,
	};

options = {
	viewSize: {x: GAME_WINDOW.WIDTH, y: GAME_WINDOW.HEIGHT},
	isPlayingBgm: true,
	seed: 51,
	theme: "pixel", //   theme?: "simple" | "pixel" | "shape" | "shapeDark" | "crt" | "dark";
  	//isReplayEnabled: true,
	isCapturing: true, // Gif capturing
    isCapturingGameCanvasOnly: true, //^
    captureCanvasScale: 2 //^
};

// obstacles
/** @type {{x: number, size: Vector}[]} */
let rects;
let nextRectDist;
const groundY = 90;

/**
 * @type {{
 * pos: Vector, ox: number, vel: Vector, world: -1 | 1,
 * state: "run" | "jump" | "land" | "hit"
 * }}
 */
let player;



function update() {
	if (!ticks) {
		// rectangle spawning
		rects = [];
		nextRectDist = 0; //^

		player = {
			pos: vec(GAME_WINDOW.WIDTH * 0.5, GAME_WINDOW.HEIGHT *0.48), 
			ox: 10, vel: vec(), world: 1, state: "run"
		};
	}
	 /***  character-design  ***/
    color("black");
	/*
		NOTE:
		Characters are assigned from 'a'.
    	'char("a", 0, 0);' draws the character
   		defined by the first element of the array.
	*/
	char("a", player.pos);
/*** Level Design ***/
// floor
color("blue");
// x, y, width, height
rect(0, 50, 300, 20);

/*** Controls ***/	
player.pos.add(player.vel);
player.pos.clamp(0, GAME_WINDOW.WIDTH, 0, GAME_WINDOW.HEIGHT);
//player.vel.mul(0.99);

	if(player.state == "run" && input.isJustPressed){

		play("laser");
		player.vel.y = -2;
		player.state = "jump";
		// GAME_WINDOW.HEIGHT *0.3;

		color("red");
        // Generate particles
        particle(
            player.pos.x, // x coordinate
            player.pos.y, // y coordinate
            20, // The number of particles
            1.5, // The speed of the particles
            PI/2, // The emitting angle
            PI/2 // The emitting width
        );
	}
   else if(player.state == "jump"){
	
		// bringing the player down
		player.vel.y += (input.isPressed ? 0.07 : 0.14) * difficulty;
		if(player.pos.y = 37){
			player.pos.y = 37;
			player.vel.y = 0;
			player.state = "run";
		}
		if(input.isPressed){
			play("laser");
			player.state = "land";
			player.vel.y = 4 * sqrt(difficulty);
		}
	}
	else if (player.state == "land"){
		if(player.pos.y > 37){
			player.pos.y = GAME_WINDOW.HEIGHT *0.48;
			player.vel.y = -0.5;
			player.state = "run";
		}
	}

	/***Enemies***/
	



}
