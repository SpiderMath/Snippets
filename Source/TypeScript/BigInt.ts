// I'm just trying to code BigInt stuff

export class BigIntV2 {
	// Represents the Sign of the number
	private sign: -1 | 1 = 1;
	private chunks: number[] = [];

	constructor(input?: string | number | boolean) {

		// Converting Boolean values
		if(typeof input === "boolean") {
			// True statements will be 1, false statements will be 0
			if(input) this.chunks = [1];
			else this.chunks = [0];
		}

		else if(typeof input === "undefined") {
			this.chunks = [0];
		}

		else if(typeof input === "number") {
			if(input >= Number.MAX_SAFE_INTEGER || input <= Number.MIN_SAFE_INTEGER) throw new TypeError("If you want to enter a number outside the bounds of the normal number, please provide it as a string");
			this.chunks = String(input).split("").reverse().map(Number);
		}

		else if(typeof input === "string") {
			const parse = parseInt(input);
			if(isNaN(parse)) throw new TypeError("Invalid string value provided to convert");

			input = input.split(".")[0];

			this.chunks = String(input).split("").reverse().map(Number);
		}

		else {
			throw new TypeError("Invalid type input provided");
		}
	}

	public toString() {
		return `${this.sign === -1 ? "-" : ""}${this.chunks.reverse().join("")}`;
	}
}