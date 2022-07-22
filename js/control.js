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
let isTouchDown = 0;
let touchX = 0, touchY = 0;
// HOLY SHIT I HATE THE CONTROLS
canvas.addEventListener("mousedown", e => {
	mx = Math.max(e.clientX - canvas.x + window.scrollX, 0);
	my = Math.max(e.clientY - canvas.y + window.scrollY, 0);
	cellX = floor(mx / blockWidth);
	cellY = floor(my / blockWidth);
	cellXSmall = mx / blockWidth;
	cellYSmall = my / blockWidth;
	e.preventDefault();


	if (isLoading) return;
	if (!hasStartedGame) {
		hasStartedGame = true;
		if (player.options.mobileControls) document.documentElement.requestFullscreen();
		return;
	}
	if (isTouchDown) return;
	if (placing.isnt("nothing") && e.button === 2) deleteBlock();
	else Interface.dispatchCursorEvent("mousedown", e);
});

canvas.addEventListener("touchstart", e => {
	mx = Math.max(e.touches[0].clientX - canvas.x + window.scrollX, 0);
	my = Math.max(e.touches[0].clientY - canvas.y + window.scrollY, 0);
	cellX = floor(mx / blockWidth);
	cellY = floor(my / blockWidth);
	cellXSmall = mx / blockWidth;
	cellYSmall = my / blockWidth;
	const notTouchDown = !isTouchDown;
	isTouchDown++;
	if (isLoading) return;
	if (notTouchDown) {
		console.log("test", cellX, cellY);
		Interface.dispatchCursorEvent("mousedown", e);
	}
});

canvas.addEventListener("touchend", e => {
	setTimeout(() => isTouchDown--, 5);
	if (isLoading) return;
	// Again I am very sorry for this but it has to work this way for the canvas interface
	e.offsetX = touchX;
	e.offsetY = touchY;
	Interface.dispatchCursorEvent("mouseup", e);
});

canvas.addEventListener("touchcancel", e => {
	setTimeout(() => isTouchDown = 0, 5);
	if (isLoading) return;
	// Again I am very sorry for this but it has to work this way for the canvas interface
	e.offsetX = touchX;
	e.offsetY = touchY;
	Interface.dispatchCursorEvent("mouseup", e);
});

canvas.addEventListener("click", e => {
	mx = Math.max(e.clientX - canvas.x + window.scrollX, 0);
	my = Math.max(e.clientY - canvas.y + window.scrollY, 0);
	cellX = floor(mx / blockWidth);
	cellY = floor(my / blockWidth);
	e.preventDefault();

	if (isLoading) return;
	Interface.dispatchCursorEvent("click", e);
});

window.addEventListener("mouseup", e => {
	if (isLoading || !hasStartedGame) return;
	if (e.button === 0) control.multiplace = false;
	if (e.button === 2) {
		control.multibreak = false;
		clearInterval(multibreakTimeout);
		multibreakTimeout = 0;
	}
	Interface.dispatchCursorEvent("mouseup", e);
});

window.addEventListener("keypress", e => {
	if (isLoading || !hasStartedGame) return;
	switch (e.key) {
		case "a":
			analyzing = !analyzing;
			break;
		case "p":
			paused = !paused;
			break;
	}

	if (analyzing) return;

	if (e.key === "r") {
		rotate();
	}
	if (e.key === "R") {
		rotate(true);
	}
	if (e.key === "d") {
		deleteBlock();
	}
});

window.addEventListener("keydown", e => {
	shiftDown = e.shiftKey;
	if (isLoading || !hasStartedGame) return;
	switch(e.key) {
		case "Escape":
		case "Esc":
		case "Enter":
			ControlsTab.isVisible = false;
			SettingsTab.isVisible = false;
			break;
		case "ArrowLeft":
			offsetLeft();
			break;
		case "ArrowRight":
			offsetRight();
			break;
		case "ArrowUp":
			offsetUp();
			break;
		case "ArrowDown":
			offsetDown();
			break;
	}
});

window.addEventListener("keyup", e => {
	shiftDown = e.shiftKey;
	if (!shiftDown) control.multiplace = false;
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
			x: (cellX - Board.left) * 60,
			y: (cellY - Board.top) * 60,
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
