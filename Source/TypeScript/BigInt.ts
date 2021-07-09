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
			// if(input > Number.MAX_SAFE_INTEGER || input <= Number.MIN_SAFE_INTEGER) throw new TypeError("If you want to enter a number outside the bounds of the normal number, please provide it as a string");
			input = this.noExponents(input);
			this.chunks = input.toString().split("").reverse().map(Number);
		}

		else if(typeof input === "string") {
			if(isNaN(Number(input))) throw new TypeError("Input is not a valid number expression");
			if(!Number.isFinite(Number(input))) throw new RangeError("Infinity can't be an argument");

			if(input.split(/e/i)[1]) input = this.noExponents(input);
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

	private noExponents(number: number | string) {
		const data = String(number).split(/e/i);
		let z = "";
		const sign = number < 0 ? "-" : "";
		const str = data[0].replace(".", "");
		let mag = Number(data[1]) + 1;

		if(mag < 0) {
			z = sign + "0.";
			while(mag++) z += "0";
			return z + str.replace(/^\-/, "");
		}

		mag -= str.length;

		while(mag--) z += "0";

		return str + z;
	}
}

console.log(new BigIntV2(10E100).toString());