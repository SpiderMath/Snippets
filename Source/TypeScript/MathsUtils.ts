// These are some number utilities I wrote for myself, supporting bigints
// Since I do a lot of Maths stuff in Node.js 😳

/**
 * @description Gets the factorial of a number (could be passed in value of String, BigInt or Number)...
 */
export function factorial(value: number | string | bigint | boolean): bigint {
	value = BigInt(value);
	let resp = 1n;

	// I could do this via recursion, but I like the verbose way more!
	// return factorial(value - 1n) * value;

	for(let i = 2n; i <= value; i += 1n) {
		resp *= i;
	}

	return resp;
}

/**
 * @description Checks if the number is a prime or not
 */
export function isPrime(input: number | string | bigint | boolean): boolean {
	input = BigInt(input);
	let primeOrNot = false;

	if(input <= 1n) return false;

	for(let i = 2n; i <= squareRootOfBigInt(input); i += 2n) {
		console.log(`Currently doing ${i.toString()}`);
		if(input % i === 0n) {
			primeOrNot = false;
			break;
		}
		else {
			primeOrNot = true;
		}
	}

	return primeOrNot;
}

/**
 * @description Returns Square Root of a BigInt
 */
export function squareRootOfBigInt(input: number | string | bigint | boolean): bigint {
	input = BigInt(input);

	if(input < 0n) throw new Error("You can't get square roots of negative numbers..");

	if(input < 2n) return input;

	const newtonIteration = (n: bigint, x0: bigint): bigint => {
		const x1 = ((n / x0) + x0) >> 1n;
		if (x0 === x1 || x0 === (x1 - 1n)) {
			return x0;
		}
		return newtonIteration(n, x1);
	};

	return newtonIteration(input, 1n);
}