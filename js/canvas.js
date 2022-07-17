"use strict";

// This is a really interesting issue I had during dev,
// so I thought I'd share it here:
// ---
// During dev, I had the animations just the way I wanted them.
// However, I have a 144Hz monitor, and a browser update must
// have messed with something. RAF must've been running x144/s
// instead of x60/s! I realized it was probably in my best
// interest to make a solution work on all refresh rates instead
// of just tweaking the variables to suit mine better.
//
// so i just made the animations run at 60fps lmao i hope noone notices

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Using_images
ctx.imageSmoothingEnabled = false;

// TODO how cool would it be if i used ctx.textBaseline
let mx = 0,
	my = 0,
	cellX = 0,
	cellY = 0,
	visCellX = 0,
	visCellY = 0,
	cursorRot = 0,
	visCursorRot = 0,
	cursorVisible = false,
	cursorAlpha = 0,
	cursorScale = 1,
	visCursorScale = 1,
	analyzing = false,
	tooltip = false;

// TODO why is this here?
canvas.addEventListener("mousemove", e => {
	mx = Math.max(e.clientX - canvas.x + window.scrollX, 0);
	my = Math.max(e.clientY - canvas.y + window.scrollY, 0);
	cellX = floor(mx / 60);
	cellY = floor(my / 60);
	cursorVisible = true;

	if (isLoading) return;
	Interface.dispatchCursorEvent("mousemove", e);
});

canvas.addEventListener("mouseenter", e => {
	cursorVisible = true;
	mx = Math.max(e.clientX - canvas.x, 0);
	my = Math.max(e.clientY - canvas.y, 0);
	cellX = floor(mx / 60);
	cellY = floor(my / 60);
	visCellX = cellX;
	visCellY = cellY;

	if (isLoading) return;
});

canvas.addEventListener("mouseleave", () => {
	cursorVisible = false;
});

let smoothTick = 0;
function draw(diff) {
	ctx.resetTransform();
	ctx.globalAlpha = 1;
	ctx.textAlign = "start";
	ctx.fillStyle = "#888";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	// Tick smoothing...
	// but only x60/s because I couldn't figure
	// out multiplication with delta time ;(
	smoothTick += diff;
	if (smoothTick >= 1 / 60) {
		tickSmooth();
		smoothTick -= 1 / 60;
	}

	if (isLoading) {
		// Basic progress UI when images are loading
		drawLoading();
	} else {
		Interface.drawAll();
		CanvasAnimator.update();

		drawCursor(diff);

		tickParticles(diff);
		drawParticles(diff);

		if (tooltip) drawHoverQuery();
	}
}

function drawChunk(chunk, isAnal = false) {
	const x = chunk.x + chunk.offset[0];
	const y = chunk.y + chunk.offset[1];
	if (chunk.data.upg[4] === 1)
		drawRect(x * 60 - 12, y * 60 - 12, 12, 12, `red`);
	if (chunk.data.upg[4] === 2)
		drawRect(x * 60, y * 60 - 12, 12, 12, `aqua`);
	if (chunk.data.upg[7] === 1)
		drawRect(x * 60 - 12, y * 60, 12, 12, `white`);
	if (chunk.data.upg[18] === 1)
		drawRect(x * 60, y * 60, 12, 12, `magenta`);
	if (chunk.data.t === "tri") {
		drawTriangleChunk(
			x * 60 - 10,
			y * 60 - 10,
			`rgb(${chunk.color.join(", ")})`
		);
		if (chunk.data.stacks > 1) {
			ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
			ctx.beginPath();
			ctx.moveTo(x * 60, y * 60 - 6);
			ctx.lineTo(x * 60 + 6, y * 60 + 6);
			ctx.lineTo(x * 60 - 6, y * 60 + 6);
			ctx.fill();
		}
	} else if (chunk.data.sv.eq(1.0e12)) {
		drawImage("nubert", x * 60 - 30, y * 60 - 30, 0, 0.333);
	} else
		drawRect(
			x * 60 - 10,
			y * 60 - 10,
			20,
			20,
			`rgb(${chunk.color.join(", ")})`
		);
	
	if (isAnal) {
		ctx.fillStyle = `rgba(255, 210, 128, ${Math.sin(Date.now() / 250) * 0.2 + 0.45})`
		ctx.beginPath();
		ctx.arc(x * 60, y * 60, 20, 0, 2 * Math.PI);
		ctx.fill();
	}
}

function drawCursor() {
	cellX = floor(mx / 60);
	cellY = floor(my / 60);

	if (control.multibreak || control.multiplace) cursorScale = 1.25;
	else cursorScale = 1;

	if (analyzing) {
		drawImage("analyze", mx - 20, my - 20, 0, 1 / 3);
	} else {
		if (placing.isnt("nothing")) {
			ctx.globalAlpha = 0.5;
			drawBlock(
				placing.id,
				cellX * 60,
				cellY * 60,
				placing.r,
				1.15,
				placing.data
			);
		}
		ctx.globalAlpha = cursorAlpha;
		// . ctx.globalCompositeOperation = "difference";
		drawImage(
			"cursor",
			visCellX * 60,
			visCellY * 60,
			visCursorRot,
			visCursorScale
		);
		// . ctx.globalCompositeOperation = "source-over";
	}
}

function drawLoading() {
	drawText("Loading...", 50, 100, {
		font: "50px monospace",
	});

	drawText(`${loading.join("/")} images loaded.`, 50, 130, {
		font: "20px monospace",
	});

	drawText(
		"Loading images can take a while when you first open the game!",
		50,
		150,
		{
			font: "20px monospace",
		}
	);
}

function tickSmooth() {
	// Make the stuff ***S M O O T H***
	visCellX = (visCellX + cellX * 0.5) / 1.5;
	visCellY = (visCellY + cellY * 0.5) / 1.5;

	visCursorRot = (visCursorRot + cursorRot * 0.3) / 1.3;

	cursorAlpha = (cursorAlpha + cursorVisible * 0.25) / 1.25;

	visCursorScale = (visCursorScale + cursorScale * 0.3) / 1.3;
}

function drawHoverQuery() {
	if (!Board.hasCursor()) return;
	const block = world[boardX][boardY];
	if (block.data !== 0) {
		drawTooltip(
			format(block.data),
			visCellX * 60 - 5,
			visCellY * 60 + 16,
			"right",
			50
		);
	}
	if (shopTooltips[block.id]) {
		drawTooltip(
			shopTooltips[block.id],
			visCellX * 60 + 65,
			visCellY * 60 + 16,
			"left",
			180
		);
	}
}

function resizeCanvas() {
	canvas.width = Math.roundTo(window.innerWidth, 60);
	canvas.height = Math.roundTo(window.innerHeight, 60);
	canvas.x = canvas.getBoundingClientRect().x;
	canvas.y = canvas.getBoundingClientRect().y;
}

resizeCanvas();

window.addEventListener("resize", () => {
	resizeCanvas();
	Board.left = Interface.width < 14 ? 0 : Math.floor((Interface.width - 14) / 2);
	Board.bottom = Interface.height < 12 ? 0 : Math.floor((Interface.height - 12) / 2);
});