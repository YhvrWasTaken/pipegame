"use strict";

// Oh my god! Anal!

let openAnalysis = null;
let analPage = 0;

function checkAnalysis() {
	let cx = mx / 60;
	let cy = my / 60;
	cx += SIXTH;
	cy += SIXTH;
	chunks.forEach(chunk => {
		// (c.x,c.y)
		//     (x,y)      (x+20,y)
		//         x------x
		//         |      |
		//         |      |
		//         |      |
		//         x------x
		//  (x,y+20)      (x+20,y+20)
		// I spent like an hour on this if statement
		if (
			cx > chunk.x &&
			cx < chunk.x + THIRD &&
			cy > chunk.y &&
			cy < chunk.y + THIRD
		) {
			// TODO live updating?
			// Here's the problem:
			// When I tried doing real-time updating, the
			// path updated, but value/color didn't :(
			openAnalysis = structuredClone(chunk);
			// Shenaningans with sC polyfill
			if (typeof openAnalysis.value === "string")
				openAnalysis.value = D(openAnalysis.value);
			openAnalysis.value = Decimal.fromDecimal(openAnalysis.value);
			sidebarMenu = "anal";
			analPage = 0;
		}
	});
}

function drawAnalysis() {
	drawSidebarArrows();
	drawPagination(analPage + 1);

	const type = openAnalysis.data.t;
	if (type === "tri") {
		ctx.resetTransform();
		drawTriangleChunk(680, 200, `rgb(${openAnalysis.color.join(", ")})`);
	} else {
		if (openAnalysis.data.sv === "1000000000000")
			drawImage("nubert", 660, 180, 0, 0.75);
		else
			drawRect(680, 200, 20, 20, `rgb(${openAnalysis.color.join(", ")})`);
		drawImage("money", 690, 179, 0, 0.5);
	}

	drawText(format(openAnalysis.value), type === "tri" ? 720 : 735, 218, {
		color: type === "tri" ? "#ffffff" : "#88ff88",
		font: "25px monospace",
	});
	let place = [0, 0];
	for (let i = analPage * 15; i < 15 + analPage * 15; i++) {
		if (place[0] === 3) {
			place[0] = 0;
			place[1]++;
		}
		let upg = openAnalysis.data.path[i];
		if (upg) {
			drawBlock(upg[0], place[0] * 60 + 660, place[1] * 60 + 240);
			if (!upg[1]) {
				drawRect(
					place[0] * 60 + 660,
					place[1] * 60 + 240,
					60,
					60,
					"#ff000088"
				);
			}
		}

		place[0]++;
	}
}
