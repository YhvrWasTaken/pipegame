"use strict";

let player = {
	money: D(0),
	maxGens: 1,
	maxGensCost: D(1_000),
	fastTime: 0,
	rebirth: 0,
	shards: D(0),
	version: 0,
	options: {
		dark: false,
		liveAnal: false,
		mobileControls: false,
		zoomLevel: 0
	}
};

const initialPlayerStart = structuredClone(player);