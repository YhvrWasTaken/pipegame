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
	mx = Math.max(e.clientX - canvas.x + window.scrollX, 0);
	my = Math.max(e.clientY - canvas.y + window.scrollY, 0);
	cellX = floor(mx / 60);
	cellY = floor(my / 60);
	e.preventDefault();

	if (isLoading) return;
	Interface.dispatchCursorEvent("mousedown", e);
});

canvas.addEventListener("click", e => {
	mx = Math.max(e.clientX - canvas.x + window.scrollX, 0);
	my = Math.max(e.clientY - canvas.y + window.scrollY, 0);
	cellX = floor(mx / 60);
	cellY = floor(my / 60);
	e.preventDefault();

	if (isLoading) return;
	Interface.dispatchCursorEvent("click", e);
});

window.addEventListener("mouseup", e => {
	if (isLoading) return;
	if (e.button === 0) control.multiplace = false;
	if (e.button === 2) {
		control.multibreak = false;
		clearInterval(multibreakTimeout);
		multibreakTimeout = 0;
	}
	Interface.dispatchCursorEvent("mouseup", e);
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
	} else if (Board.hasCursor()) {
		world[boardX][boardY].r += ccw ? -90 : 90;
		world[boardX][boardY].r %= 360;
		if (world[boardX][boardY].r < 0) {
			world[boardX][boardY].r = 270;
		}
	}
	cursorRot += ccw ? -90 : 90;
}

function deleteBlock() {
	let id = "nothing";
	let rot = 0;
	let held = false;
	if (placing.is("nothing") && Board.hasCursor()) {
		id = world[boardX][boardY].id;
		rot = world[boardX][boardY].r;
		world[boardX][boardY] = Block("nothing");
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
			x: boardX * 60,
			y: boardY * 60,
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
