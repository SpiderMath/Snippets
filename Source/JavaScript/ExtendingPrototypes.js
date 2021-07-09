// This kinda messes up for TypeScript since no intellisense

String.prototype.reverse = function() {
	return this.split("").reverse().join("");
};

console.log("Hello World".reverse());

String.prototype.capitalise = function() {
	return this.split(" ").map(word => word[0].toUpperCase() + word.slice(1).toLowerCase());
};

console.log("Hello World".capitalise());

Array.prototype.random = function() {
	return this[Math.floor(this.length * Math.random())];
};

console.log(["Hello World", "Hi World", "Jello World", "Yummy World"].random());

Number.prototype.toBigInt = function() {
	return BigInt(this);
};

console.log(Number(10).toBigInt());