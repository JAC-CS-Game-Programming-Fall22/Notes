/**
 * pong-6
 * "The Score Update"
 *
 * Original Lua by: Colton Ogden (cogden@cs50.harvard.edu)
 * Adapted to JS by: Vikram Singh (vikram.singh@johnabbott.qc.ca)
 *
 * Originally programmed by Atari in 1972. Features two
 * paddles, controlled by players, with the goal of getting
 * the ball past your opponent's edge. First to 10 points wins.
 *
 * This version is built to more closely resemble the NES than
 * the original Pong machines or the Atari 2600 in terms of
 * resolution, though in widescreen (16:9) so it looks nicer on
 * modern systems.
 */

import Ball from "./Ball.js";
import Paddle from "./Paddle.js";

/**
 * We initialize our game by grabbing the `canvas` element from
 * the DOM located in `index.html` and getting the `context` object
 * from it.
 */
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

// Set the dimensions of the play area.
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Initialize score variables for rendering on the screen and keeping track of the winner.
let player1Score = 0;
let player2Score = 0;

// Initialize the player paddles and the ball as class instances.
const player1 = new Paddle(30, 30, 20, 200, CANVAS_HEIGHT);
const player2 = new Paddle(CANVAS_WIDTH - 50, CANVAS_HEIGHT - 230, 20, 200, CANVAS_HEIGHT);
const ball = new Ball(CANVAS_WIDTH / 2 - 10, CANVAS_HEIGHT / 2 - 10, 20, 20, CANVAS_HEIGHT);

/**
 * Game state variable used to transition between different parts of the game.
 * Used for beginning, menus, main game, high score list, etc.
 * We will use this to determine behavior during `render()` and `update()`.
 */
let gameState = 'start';

// Keep track of what keys were pressed/unpressed.
const keys = {};

// Load a custom font to use.
const myFont = new FontFace('Joystix', 'url(./Joystix.ttf)');

myFont.load().then(font => {
	document.fonts.add(font);
});

// Set the appropriate key in our `keys` object to `true` if a key was pressed.
canvas.addEventListener('keydown', event => {
	keys[event.key] = true;
});

// Set the appropriate key in our `keys` object to `false` if a key was unpressed.
canvas.addEventListener('keyup', event => {
	keys[event.key] = false;
});

// This will be used to calculate delta time in `gameLoop()`.
let lastTime = 0;

/**
 * This function is the heartbeat of the application. It is called
 * 60 times per second (depending on your monitor's refresh rate) and
 * it is what we will use to drive our game's animations. The way
 * that this function is called 60 times per second is by using JavaScript's
 * `requestAnimationFrame()` API.
 *
 * @param {Number} currentTime How much time has elapsed since the page loaded.
 */
function gameLoop(currentTime = 0) {
	// Calculates delta time and converts it to seconds instead of milliseconds.
	const deltaTime = (currentTime - lastTime) / 1000;

	update(deltaTime);
	lastTime = currentTime;
	requestAnimationFrame(gameLoop);
}

/**
 * This function is called by `gameLoop()` at each frame of program execution;
 * `dt` (i.e., DeltaTime) will be the elapsed time in seconds since the last
 * frame, and we can use this to scale any changes in our game for even behavior
 * across frame rates. This is where the logic of our game will be executed.
 *
 * @param {Number} dt How much time has elapsed since the last time this was called.
 */
function update(dt) {
	// If the enter key was pressed...
	if (keys.Enter) {
		/**
		 * We have to immediately set the enter field of the keys object to false
		 * because technically, this field will be true for the entire time the key
		 * is pressed. If you hold down the enter key, you don't want the ball to
		 * repeatedly launch over ang over again.
		 */
		keys.Enter = false;

		/**
		 * If we press enter during the start state of the game, we'll go into the
		 * play state. During play state, the ball will move in a random direction.
		 */
		if (gameState === 'start') {
			gameState = 'play';
		}
		else {
			gameState = 'start';

			// The ball's new reset method.
			ball.reset(CANVAS_WIDTH / 2 - 10, CANVAS_HEIGHT / 2 - 10);
		}
	}

	if (gameState === 'play') {
		ball.update(dt, player1, player2);
	}

	// If we reach the left or right edge of the screen go back to start and update the score.
	if (ball.x < 0) {
		player2Score++;
		ball.reset(CANVAS_WIDTH / 2 - 10, CANVAS_HEIGHT / 2 - 10);
		gameState = 'start';
	}
	else if (ball.x > CANVAS_WIDTH) {
		player1Score++;
		ball.reset(CANVAS_WIDTH / 2 - 10, CANVAS_HEIGHT / 2 - 10);
		gameState = 'start';
	}

	player1.update(dt);
	player2.update(dt);

	// Player 1 movement.
	if (keys.w) {
		player1.moveUp();
	}
	else if (keys.s) {
		player1.moveDown();
	}
	else {
		player1.stop();
	}

	// Player 2 movement.
	if (keys.ArrowUp) {
		player2.moveUp();
	}
	else if (keys.ArrowDown) {
		player2.moveDown();
	}
	else {
		player2.stop();
	}

	render();
}

/**
 * This function is also executed at each frame since it is called by
 * `update()`. It is called after the update step completes so that we
 * can draw things to the screen once they've changed.
 */
function render() {
	/**
	 * Erase whatever was previously on the canvas so that we can start
	 * fresh each frame. It does this by drawing a "clear" rectangle starting
	 * from the origin to the extremities of the canvas.
	 */
	context.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	// Set font configuration.
	context.font = '60px Joystix';
	context.fillStyle = 'white';
	context.textAlign = 'center';

	// Render scores at the top of the screen.
	context.fillText(`${player1Score}`, CANVAS_WIDTH * 0.25, 75);
	context.fillText(`${player2Score}`, CANVAS_WIDTH * 0.75, 75);

	// Render the ball using its class' render method.
	ball.render(context);

	// Render paddles using their class' render method.
	player1.render(context);
	player2.render(context);
}

// Start the game loop.
gameLoop();

// Focus the canvas so that user doesn't have to click on it.
canvas.focus();
