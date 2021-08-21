/**
 * pong-3
 * "The Ball Update"
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

// Paddle positions on the Y axis (they can only move up or down).
let player1Y = 30;
let player2Y = CANVAS_HEIGHT - 230;

// Speed at which we will move our paddle; multiplied by `dt` in `update()`.
const PADDLE_SPEED = 1000;

// Velocity and position variables for our ball when play starts.
let ballX = CANVAS_WIDTH / 2 - 10;
let ballY = CANVAS_HEIGHT / 2 - 10;
let ballDX = generateRandomNumber(400, 600);
let ballDY = generateRandomNumber(400, 600);

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

			// Start the ball's position in the middle of the screen.
			ballX = CANVAS_WIDTH / 2 - 10;
			ballY = CANVAS_HEIGHT / 2 - 10;

			// Give the ball's velocity a random starting value.
			ballDX = generateRandomNumber(400, 600);
			ballDY = generateRandomNumber(400, 600);
		}
	}

	/**
	 * Update our ball based on its DX and DY only if we're in play state;
	 * scale the velocity by dt so movement is framerate-independent.
	 */
	if (gameState === 'play') {
		ballX += ballDX * dt;
		ballY += ballDY * dt;
	}

	// Player 1 movement.
	if (keys.w) {
		/**
		 * Add negative paddle speed to current Y scaled by deltaTime.
		 * Now, we clamp our position between the bounds of the screen
		 * Math.max() returns the greater of two values; 0 and player Y
		 * will ensure we don't go above it.
		 */
		player1Y = Math.max(0, player1Y - PADDLE_SPEED * dt);
	}
	else if (keys.s) {
		/**
		 * Add positive paddle speed to current Y scaled by deltaTime.
		 * Math.min() returns the lesser of two values; bottom of the edge
		 * minus paddle height and player Y will ensure we don't go below it
		 */
		player1Y = Math.min(CANVAS_HEIGHT - 200, player1Y + PADDLE_SPEED * dt);
	}

	// Player 2 movement.
	if (keys.ArrowUp) {
		// Add negative paddle speed to current Y scaled by deltaTime.
		player2Y = Math.max(0, player2Y - PADDLE_SPEED * dt);
	}
	else if (keys.ArrowDown) {
		// Add positive paddle speed to current Y scaled by deltaTime.
		player2Y = Math.min(CANVAS_HEIGHT - 200, player2Y + PADDLE_SPEED * dt);
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
	context.clearRect(0, 0, canvas.width, canvas.height);

	// Set font configuration.
	context.font = '60px Joystix';
	context.fillStyle = 'white';
	context.textAlign = 'center';

	// Render scores at the top of the screen.
	context.fillText(`${player1Score}`, canvas.width * 0.25, 75);
	context.fillText(`${player2Score}`, canvas.width * 0.75, 75);

	/**
	 * The paddles are simply rectangles we draw on the screen at certain
	 * points, as is the ball.
	 */

	// Render first paddle (left side).
	context.fillRect(30, player1Y, 20, 200);

	// Render ball (center).
	context.fillRect(ballX, ballY, 20, 20);

	// Render second paddle (right side).
	context.fillRect(canvas.width - 50, player2Y, 20, 200);
}

/**
 * Generate a random number from `min` to `max`.
 * Half the time, the number may be negative.
 *
 * @param {Number} min Lower bound the random number should fall within.
 * @param {Number} max Upper bound the random number should fall within
 * @returns A randomly generated number from `min` to `max`.
 */
function generateRandomNumber(min, max) {
	let randomNumber = Math.random() * (max - min) + max;

	// 50% chance the number may be negative.
	if (Math.floor(Math.random() * 2) === 1) {
		randomNumber *= -1;
	}

	return randomNumber;
}

// Start the game loop.
gameLoop();

// Focus the canvas so that user doesn't have to click on it.
canvas.focus();
