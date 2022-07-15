"use strict";

// Oh my god! Anal!

let openAnalysis = null;
let analPage = 0;
let analReactive = false;

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
			cx > (chunk.x + chunk.offset[0]) &&
			cx < (chunk.x + chunk.offset[0]) + THIRD &&
			cy > (chunk.y + chunk.offset[1]) &&
			cy < (chunk.y + chunk.offset[1]) + THIRD
		) {
			if (analReactive) openAnalysis = chunk;
			else openAnalysis = structuredClone(chunk);
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

	
	if (type === "tri" && openAnalysis.data.stacks > 1) {
		drawText(format(openAnalysis.value), 715, 210, {
			color: "#ffffff",
			font: "20px monospace",
		});
		drawText(`Approx. of ${openAnalysis.data.stacks} ▲`, 715, 225, {
			color: "#ffffff",
			font: "12px monospace",
		});
	} else {
		drawText(format(openAnalysis.value), type === "tri" ? 720 : 735, 218, {
			color: type === "tri" ? "#ffffff" : "#88ff88",
			font: "25px monospace",
		});
	}
	let place = [0, 0];
	for (let i = analPage * 15; i < 15 + analPage * 15; i++) {
		if (place[0] === 3) {
			place[0] = 0;
			place[1]++;
		}
		let upg = openAnalysis.data.path[i];
		if (upg) {
			if (upg === "gone") {
				drawText("DEL", place[0] * 60 + 690, place[1] * 60 + 280, {
					color: "#800",
					align: "center",
					font: "30px monospace"
				});
			} else {
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
		}

		place[0]++;
	}
}
