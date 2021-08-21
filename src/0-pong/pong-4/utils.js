/**
 * Generate a random number from `min` to `max`.
 * Half the time, the number may be negative.
 *
 * @param {Number} min Lower bound the random number should fall within.
 * @param {Number} max Upper bound the random number should fall within
 * @returns A randomly generated number from `min` to `max`.
 */
export function generateRandomNumber(min, max) {
	let randomNumber = Math.random() * (max - min) + max;

	// 50% chance the number may be negative.
	if (Math.floor(Math.random() * 2) === 1) {
		randomNumber *= -1;
	}

	return randomNumber;
}
