// Adapting from https://github.com/sorensen/ascii-table/blob/master/ascii-table.js

const toString = Object.prototype.toString;

interface ConstructorOptions {
	prefix?: string;
};

interface SortingMethod {
	// eslint-disable-next-line no-unused-vars
	(a: any, b: any): number,
}

export class AsciiTable {
	private static LEFT = 0;
	private static CENTRE = 1;
	private static RIGHT = 2;
	private options: ConstructorOptions;
	private __name: string | object = "";
	private __nameAlign = AsciiTable.CENTRE;
	private __rows = [];
	private __maxCells = 0;
	private __aligns = [];
	private __colMaxes = [];
	private __spacing = 1;
	private __heading = [];
	private __headingAlign = AsciiTable.CENTRE;
	private __edge = "|";
	private __fill = "-";
	private __top = ".";
	private __bottom = "'";
	private __border = true;
	private __justify = true;

	constructor(name: string | object, options: ConstructorOptions = {}) {
		this.options = options;
		this.reset(name);
	}

	// ! Static Methods
	public static factory(name: string | object, options: ConstructorOptions) {
		return new AsciiTable(name, options);
	}

	public static align(direction: number, str: string, len: number, pad: string) {
		if (direction === AsciiTable.LEFT) return AsciiTable.alignLeft(str, len, pad);
		if (direction === AsciiTable.RIGHT) return AsciiTable.alignRight(str, len, pad);
		if (direction === AsciiTable.CENTRE) return AsciiTable.alignCentre(str, len, pad);

		return AsciiTable.alignAuto(str, len, pad);
	}

	public static alignCentre(str: string | any, len: number, pad: string) {
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

	// ! Instance Methods
	public reset(name: string | object) {
		this.setBorder();

		if (toString.call(name) === "[object String]") this.__name = name;

		// @ts-ignore
		else if (toString.call(name) === "[object Object]") this.parse(name);

		return this;
	}

	public setBorder(edge: string = "|", fill: string = "-", top: string = ".", bottom: string = "'") {
		this.__border = true;

		if (arguments.length === 1) {
		  fill = top = bottom = edge;
		}

		this.__edge = edge;
		this.__fill = fill;
		this.__top = top;
		this.__bottom = bottom;

		return this;
	}

	public removeBorder() {
		this.__border = false;

		this.__edge = this.__fill = " ";

		return this;
	}

	public setAlign(index: number, direction: number) {
		this.__aligns[index] = direction;

		return this;
	}

	public setTitle(name: string | object) {
		this.__name = name;

		return this;
	}

	public getTitle() {
		return this.__name;
	}

	public setTableAlign(direction: number) {
		this.__nameAlign = direction;

		return this;
	}

	public sort(fn: SortingMethod) {
		this.__rows.sort(fn);

		return this;
	}

	public sortColumn(index: number, fn: SortingMethod) {
		this.__rows.sort((a, b) => fn(a[index], b[index]));

		return this;
	}

	public setHeading(...row) {
		this.__heading = row;

		return this;
	}

	public getHeading() {
		return this.__heading.slice();
	}

	public setHeadingAlign(direction: number) {
		this.__headingAlign = direction;

		return this;
	}

	public addRow(...row) {
		this.__maxCells = Math.max(this.__maxCells, row.length);

		this.__rows.push(row);

		return this;
	}

	public getRows() {
		return this.__rows.slice().map(row => row.slice());
	}

	public addRowMatrix(rows: Array<any>) {
		for(let i = 0; i < rows.length; i++) {
			this.addRow(rows[i]);
		}

		return this;
	}

	public addData(data: Array<any>, rowCallback: CallableFunction, asMatrix: boolean = false) {
		if(toString.call(data) !== "[object Array]") return this;

		for(let index = 0; index < data.length; index++) {
			const row = rowCallback(data[index]);

			if(asMatrix) this.addRowMatrix(row);
			else this.addRow(row);
		}

		return this;
	}

	public clearRows() {
		this.__rows = [];
		this.__maxCells = 0;
		this.__colMaxes = [];

		return this;
	}

	public setJustify(val: boolean = true) {
		this.__justify = !!val;

		return this;
	}

	public toJSON() {
		return {
			title: this.getTitle(),
			heading: this.getHeading(),
			rows: this.getRows(),
		};
	}

	public parse(obj: { title: string, heading: string, rows: any[] }) {
		return this
			// @ts-ignore
			.reset()
			.setTitle(obj.title)
			.setHeading(obj.heading)
			.addRowMatrix(obj.rows);
	}

	public render() {
		const self = this;
		const body = [];
		const maxLen = this.__maxCells;
		const max = AsciiTable.arrayFill(maxLen, 0);
		let total = maxLen * 3;
		const rows = this.__rows;
		const justify = this.__justify ? Math.max.apply(null, max) : 0;
		const border = this.__border;
		const all = this.__heading ? [this.__heading].concat(rows) : rows;

		for (let i = 0; i < all.length; i++) {
			const row = all[i];
			for (let k = 0; k < maxLen; k++) {
			  const cell = row[k];
			  max[k] = Math.max(max[k], cell ? cell.toString().length : 0);
			}
		}

		max.forEach((x) => total += justify ? justify : x + self.__spacing);
		if(justify) total += max.length;
		total -= this.__spacing;

		if(border) body.push(this._seperator(total - maxLen + 1, this.__top));

		if(this.__name) {
			body.push(this._renderTitle(total - maxLen + 1));
			if(border) body.push(this._seperator(total - maxLen + 1));
		}

		if(this.__heading) {
			body.push(this._renderRow(this.__heading, " ", this.__headingAlign));
    		body.push(this._rowSeperator());
		}

		for(let i = 0; i < this.__rows.length; i++) body.push(this._renderRow(this.__rows[i], ""));

		if(border) body.push(this._seperator(total - maxLen + 1, this.__bottom));

		const prefix = this.options.prefix || "";

		return prefix + body.join("\n" + prefix);
	}

	private _seperator(len: number, sep: string = "|") {
		return sep + AsciiTable.alignRight(sep, len, this.__fill);
	}

	private _rowSeperator() {
		const blanks = AsciiTable.arrayFill(this.__maxCells, this.__fill);

		return this._renderRow(blanks, this.__fill);
	}


	private _renderTitle(len: number) {
		const name = ` ${this.__name} `;
		const str = AsciiTable.align(this.__nameAlign, name, len - 1, " ");

		return `${this.__edge}${str}${this.__edge}`;
	}

	private _renderRow(row: Array<any>, str: string, align?: number) {
		const tmp = [""];
		const max = this.__colMaxes;

		for(let k = 0; k < this.__maxCells; k++) {
			const cell = row[k];
			const just = this.__justify ? Math.max.apply(null, max) : max[k];
			const pad = just;
			const colAlign = this.__aligns[k];
			let use = align;
			let method = "alignAuto";

			if(typeof align === undefined) use = colAlign;

			if(use === AsciiTable.LEFT) method = "alignLeft";
			if(use === AsciiTable.RIGHT) method = "alignRight";
			if(use === AsciiTable.LEFT) method = "alignLeft";

			tmp.push(AsciiTable[method](cell, pad, str));
		}

		let front = tmp.join(`${str}${this.__edge}${str}`);
		front = front.substr(1, front.length);

		return `${front}${str}${this.__edge}`;
	}
};