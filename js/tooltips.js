"use strict";

function drawTooltip(text, x, drawY, side = "left", width = 200, lines) {
	let drawX = x;
	if (side === "right") {
		drawX -= width;
	}
	ctx.globalAlpha = 1;
	ctx.textAlign = "start";
	const fontHeight = parseFloat(ctx.font.split(" ")[0]);

	let drawLines = lines ?? calcWrapText(text, width);

	// I LOVE HARDCODED VALUES!!!
	drawRect(drawX - 5, drawY - 16, width + 10, drawLines * fontHeight + 22, "white");

	ctx.fillStyle = "black";
	fillWrapText(text, drawX, drawY, fontHeight, width);
}

// https://stackoverflow.com/a/4478894
// TODO mod this to support newlines?
function fillWrapText(text, x, y, lineHeight, fitWidth = 200) {
	if (fitWidth <= 0) {
		drawText(text, x, y);
		return 0;
	}
	let words = text.split(" ");
	let currentLine = 0;
	let idx = 1;
	while (words.length > 0 && idx <= words.length) {
		const str = words.slice(0, idx).join(" ");
		const w = ctx.measureText(str).width;
		if (w > fitWidth) {
			if (idx === 1) {
				idx = 2;
			}
			drawText(
				words.slice(0, idx - 1).join(" "),
				x,
				y + lineHeight * currentLine,
				{ font: "inherit" }
			);
			currentLine++;
			words = words.splice(idx - 1);
			idx = 1;
		} else {
			idx++;
		}
	}

	if (idx > 0) drawText(words.join(" "), x, y + lineHeight * currentLine, { font: "inherit" });

	return currentLine;
}

function calcWrapText(text, fitWidth = 200) {
	let words = text.split(" ");
	let currentLine = 0;
	let idx = 1;
	while (words.length > 0 && idx <= words.length) {
		const str = words.slice(0, idx).join(" ");
		const w = ctx.measureText(str).width;
		if (w > fitWidth) {
			if (idx === 1) {
				idx = 2;
			}
			currentLine++;
			words = words.splice(idx - 1);
			idx = 1;
		} else {
			idx++;
		}
	}

	return currentLine;
}
