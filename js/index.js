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

function updateDOM() {
	id("fastTime").textContent = format(player.fastTime);
}