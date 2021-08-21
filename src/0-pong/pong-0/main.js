/**
 * pong-0
 * "The Day-0 Update"
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

// Set the dimensions of the play area.
canvas.width = 1280;
canvas.height = 720;

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

	context.font = '60px Joystix';
	context.fillStyle = 'white';
	context.textBaseline = 'middle';
	context.textAlign = 'center';
	context.fillText(
		`Hello Pong!`,     // text to render
		canvas.width / 2,  // X coordinate
		canvas.height / 2, // Y coordinate
	);
}

// Start the game loop.
gameLoop();

// Focus the canvas so that user doesn't have to click on it.
canvas.focus();
