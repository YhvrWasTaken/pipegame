"use strict";

const THIRD = 1 / 3;
const SIXTH = 1 / 6;
const FOURNINE = 4 / 9;

let placing = Block("nothing");
const control = {
	multibreak: false,
	multiplace: false,
};

let multibreakTimeout = 0;
// HOLY SHIT I HATE THE CONTROLS
canvas.addEventListener("mousedown", e => {
	mx = Math.max(e.clientX - canvas.offsetLeft + window.scrollX, 0);
	my = Math.max(e.clientY - canvas.offsetTop + window.scrollY, 0);
	cellX = floor(mx / 60);
	cellY = floor(my / 60);
	e.preventDefault();

	if (cellX > 10) {
		handleSidebarClick(cellX - 11, cellY, e.button);
		return;
	}

	if (analyzing) {
		checkAnalysis();
		return;
	}

	if (e.button === 2) {
		if (placing.is("Nothing")) control.multibreak = true;
		else if (!multibreakTimeout) multibreakTimeout = setTimeout(() => control.multibreak = true, 300);
		deleteBlock();
		return;
	}

	let ground = copyBlock(world[cellX][cellY]);

	if (ground.id.startsWith("gen")) {
		currentGens--;
	}

	if (placing.id.startsWith("gen")) {
		if (currentGens >= player.maxGens) {
			alert(
				`Your current gen cap is ${player.maxGens}\nI'll make a nicer message for this later`
			);
			return;
		}
		currentGens++;
	}

	if (e.shiftKey === true) {
		control.multiplace = true;
	}

	let should = true;
	let shouldPlace = true;
	let shouldData = true;
	let consumeOnNextPlace = false;

	if (ground.is("nothing") && e.shiftKey) {
		let cost = findCost(placing.id);

		if (player.money.gte(cost)) {
			// . player.money = player.money.sub(cost);
			consumeOnNextPlace = true;
			// . moneyParticles(mx / 60 - 11, my / 60, 5);

			should = false;
			shouldData = false;
		}
	} else if (placing.is("nothing") && e.shiftKey) {
		let cost = findCost(ground.id);

		if (player.money.gte(cost)) {
			// . player.money = player.money.sub(cost);
			// . moneyParticles(mx / 60 - 11.5, my / 60, 5);
			world[cellX][cellY] = ground;
			consumeOnPlace = true;
			shouldPlace = false;
			shouldData = false;
			if (ground.id.startsWith("gen")) currentGens++;
		}
	}

	if (shouldPlace && consumeOnPlace) {
		player.money = player.money.sub(findCost(placing.id));
		consumeOnPlace = false;
	}
	if (shouldPlace) world[cellX][cellY] = copyBlock(placing, shouldData);
	if (should) placing = copyBlock(ground, shouldData);
	if (consumeOnNextPlace) consumeOnPlace = true;
});

window.addEventListener("mouseup", e => {
	if (e.button === 0) control.multiplace = false;
	if (e.button === 2) {
		control.multibreak = false;
		clearInterval(multibreakTimeout);
		multibreakTimeout = 0;
	}
});

window.addEventListener("keypress", e => {
	if (e.key === "a") analyzing = !analyzing;
	if (e.key === "p") paused = !paused;

	if (analyzing) return;

	if (e.key === "r") {
		rotate();
	}
	if (e.key === "R") {
		rotate(true);
	}
	// If (e.key === "c") {
	// placing = Block("conveyor");
	// }
	// if (e.key === "1") {
	// placing = Block("gen1");
	// }
	// if (e.key === "f") {
	// placing = Block("furnace");
	// }
	if (e.key === "d") {
		deleteBlock();
	}
});

window.addEventListener("keydown", e => {
	tooltip = e.shiftKey;
});

window.addEventListener("keyup", e => {
	tooltip = e.shiftKey;
	if (e.shiftKey === false) control.multiplace = false;
});

window.addEventListener("contextmenu", e => e.preventDefault());

let wheel = 0;
const WHEEL_THRESHOLD = 90;
canvas.addEventListener("wheel", ({ deltaY }) => {
	wheel += deltaY;
	while (wheel > WHEEL_THRESHOLD) {
		rotate();
		wheel -= WHEEL_THRESHOLD;
	}
	while (wheel < -WHEEL_THRESHOLD) {
		rotate(true);
		wheel += WHEEL_THRESHOLD;
	}
});

setInterval(() => {
	// Try to get wheel back to 0 over time
	if (wheel > 0) wheel = Math.max(0, wheel - 10);
	if (wheel < 0) wheel = Math.min(0, wheel + 10);

}, 100);

function rotate(ccw = false) {
	if (analyzing) return;

	if (placing.isnt("nothing")) {
		placing.r += ccw ? -90 : 90;
		placing.r %= 360;
		if (placing.r < 0) {
			placing.r = 270;
		}
	} else if (cellX < 11) {
		world[cellX][cellY].r += ccw ? -90 : 90;
		world[cellX][cellY].r %= 360;
		if (world[cellX][cellY].r < 0) {
			world[cellX][cellY].r = 270;
		}
	}
	cursorRot += ccw ? -90 : 90;
}

function deleteBlock() {
	let id = "nothing";
	let rot = 0;
	let held = false;
	if (placing.is("nothing") && cellX < 11) {
		id = world[cellX][cellY].id;
		rot = world[cellX][cellY].r;
		world[cellX][cellY] = Block("nothing");
	} else {
		id = placing.id;
		held = true;
		rot = placing.r;
		placing = Block("nothing");
	}

	if (!held && id.startsWith("gen")) {
		currentGens--;
	}

	addParticle(
		id,
		1000,
		{
			x: cellX * 60,
			y: cellY * 60,
			r: rot,
			s: held ? 1.15 : 1,
			a: held ? 0.5 : 1,
		},
		{
			x: 2,
			y: 2,
			s: -1,
			a: held ? -0.5 : -1,
		}
	);
}
