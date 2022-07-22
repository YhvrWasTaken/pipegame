"use strict";

let paused = false;

// [[0,0,0],
//  [0,0,0],
//  [0,0,0]]
//  ^^^ but 11x11
let world = new Array(11)
	.fill(0)
	.map(() => new Array(11).fill(Block("nothing")));

world[5][4] = Block("gen1");
world[5][5] = Block("conveyor");
world[5][5].r = 90;
world[5][6] = Block("furnace");

const initialWorldStart = structuredClone(world);

function updateDOM() {
	document.body.className = player.options.dark ? "s-base--dark" : "";
	const hoveringBlock = world[boardX][boardY].isnt("nothing");
	const holdingBlock = placing.isnt("nothing");
	if (player.options.mobileControls && Board.hasCursor() && (hoveringBlock || holdingBlock)) {
		id("mobile-controls").style.visibility = "visible";
		switch(hoveringBlock * 2 + holdingBlock) {
			case 3:
				id("mobile-interact").src = "img/swap.png";
				id("mobile-interact").alt = "Swap";
				break;
			case 2:
				id("mobile-interact").src = "img/move.png";
				id("mobile-interact").alt = "Move";
				break;
			case 1:
				id("mobile-interact").src = "img/place.png";
				id("mobile-interact").alt = "Place";
				break;
		}
	} else {
		id("mobile-controls").style.visibility = "hidden";
	}
}