import { AsciiTable } from "./AsciiTable";

const table = new AsciiTable("This is Sometitle Lol");

table
	.setTitle("Subjects")
	.setHeading("Name", "Short Form")
	.addRow("Mathematics", "Math")
	.addRow("Chemistry", "Chem")
	.addRow("Biology", "Bio")
	.addRow("Physics", "Phys")
	.addRow("English", "Eng");

console.log(table.toString());