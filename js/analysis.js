"use strict";

// Oh my god! Anal!

let openAnalysis = null;
let analPage = 0;

function checkAnalysis() {
	let cx = boardXUnrounded;
	let cy = boardYUnrounded;
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
			if (player.options.liveAnal) openAnalysis = chunk;
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