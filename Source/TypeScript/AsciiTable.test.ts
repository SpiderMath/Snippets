import { AsciiTable } from "./AsciiTable";

const table = new AsciiTable("This is Sometitle Lol");

table
// @ts-ignore
	.setHeading("", "Name", "Age")
// @ts-ignore
	.addRow(1, "Bob", 52)
// @ts-ignore
	.addRow(2, "John", 34)
// @ts-ignore
	.addRow(3, "Jim", 83);

console.log(table.render());