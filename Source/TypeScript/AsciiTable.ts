// Adapting from https://github.com/sorensen/ascii-table/blob/master/ascii-table.js

const toString = Object.prototype.toString;

interface ConstructorOptions {
	prefix?: string;
};

export class AsciiTable {
	private static LEFT = 0;
	private static CENTRE = 1;
	private static RIGHT = 2;
	private options: ConstructorOptions;

	constructor(name: string | object, options: ConstructorOptions = {}) {
		this.options = options;
	}

	// ! Static Methods
	public static factory(name: string | object, options: ConstructorOptions) {
		return new AsciiTable(name, options);
	}

	public static align(direction: number, str: string, len: number, pad: string) {
		if (direction === AsciiTable.LEFT) return AsciiTable.alignLeft(str, len, pad);
		if (direction === AsciiTable.RIGHT) return AsciiTable.alignRight(str, len, pad);
		if (direction === AsciiTable.CENTRE) return AsciiTable.alignCenter(str, len, pad);

		return AsciiTable.alignAuto(str, len, pad);
	}

	public static alignCenter(str: string | any, len: number, pad: string) {
		if (!len || len < 0) return "";
		if (str === undefined || str === null) str = "";
		if (typeof pad === "undefined") pad = " ";
		if (typeof str !== "string") str = str.toString();

		const nLen = str.length;
		const half = Math.floor(len / 2 - nLen / 2);
		const odds = Math.abs((nLen % 2) - (len % 2));

		len = str.length;

		return AsciiTable.alignRight("", half, pad) + str + AsciiTable.alignLeft("", half + odds, pad);
	}

	public static alignRight(str: string | any, len: number, pad: string) {
		if (!len || len < 0) return "";
		if (str === undefined || str === null) str = "";
		if (typeof pad === "undefined") pad = " ";
		if (typeof str !== "string") str = str.toString();

		const alen = len + 1 - str.length;

		if (alen <= 0) return str;

		return Array(len + 1 - str.length).join(pad) + str;
	}

	public static alignLeft(str: string | any, len: number, pad: string) {
		if (!len || len < 0) return "";
		if (str === undefined || str === null) str = "";
		if (typeof pad === "undefined") pad = " ";
		if (typeof str !== "string") str = str.toString();

		const alen = len + 1 - str.length;

		if (alen <= 0) return str;

		return str + Array(len + 1 - str.length).join(pad);
	}

	public static alignAuto(str: string, len: number, pad: string) {
		if (str === undefined || str === null) str = "";

		const type = toString.call(str);
		pad || (pad = " ");
		len = +len;

		if (type !== "[object String]") {
		  str = str.toString();
		}

		if (str.length < len) {
		  	switch(type) {

			case "[object Number]": return AsciiTable.alignRight(str, len, pad);

			default: return AsciiTable.alignLeft(str, len, pad);

			}
		}

		return str;
	}

	public static arrayFill(len: number, fill: any) {
		const arr = new Array(len);

		for (let i = 0; i !== len; i++) arr[i] = fill;

		return arr;
	}
};