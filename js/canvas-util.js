"use strict";

function zoomLevel() {
	return player.options.zoomLevel < 0 ? Math.pow(1.04, player.options.zoomLevel) : 1 + 0.04 * player.options.zoomLevel;
}

// https://stackoverflow.com/a/43155027
function drawImage(img, x, y, rot = 0, scale = 1) {
	if (img === "nothing") return;
	let image = images[img];
	if (image === undefined) image = images.unknown;
	// Should i be having to do the +30s???
	// Sets scale and origin
	ctx.save();
	ctx.translate(x + image.width / 2, y + image.height / 2);
	ctx.scale(scale, scale);
	ctx.rotate(toRadians(rot));
	ctx.drawImage(image, -image.width / 2, -image.height / 2);

	// . ctx.drawImage(image, x, y);
	ctx.restore();
}

// https://stackoverflow.com/a/9705160
function toRadians(deg) {
	return deg * (Math.PI / 180);
}

function drawRect(x, y, w, h, col) {
	ctx.fillStyle = col;
	// For semi-transparent just use 4-byte hex
	ctx.globalAlpha = 1;
	ctx.fillRect(x, y, w, h);
}

/**
 * Draw text to the canvas. If any of the props are "inherit", they will stay the same from the last run.
 * @param {string} text The text being drawn
 * @param {number} x x-coord to draw at
 * @param {number} y y-coord to draw at
 * @param {object} props Properties of the text
 * @param {string} [props.color] Color of the text being drawn
 * @param {string} [props.align] The way the text is aligned
 * @param {string} [props.font] The font of the drawn text
 * @param {string} [props.alpha] Alpha of the text
 * @param {string} [props.max] Max width of text
 */
function drawText(text, x, y, props = {}) {
	if (props.color !== "inherit") ctx.fillStyle = props.color ?? "#000";
	if (props.align !== "inherit") ctx.textAlign = props.align ?? "left";
	if (props.font !== "inherit") ctx.font = props.font ?? "12px sans-serif";
	if (props.alpha !== "inherit") ctx.globalAlpha = props.alpha ?? 1;
	props.max ??= 1000000;

	ctx.fillText(text, x, y, props.max);
}

function drawTriangleChunk(cx, cy, col) {
	ctx.strokeStyle = col;
	ctx.fillStyle = col;
	ctx.beginPath();
	ctx.moveTo(cx + 10, cy);
	ctx.lineTo(cx + 20, cy + 20);
	ctx.lineTo(cx, cy + 20);
	ctx.fill();
}

const CanvasAnimator = {
	queue: [],
	add(func, ticks) {
		this.queue.push({
			func,
			maxTicks: ticks,
			ticks: 0
		});
	},
	update() {
		let removeDeezNutsLmao = [];
		for (const animation of this.queue) {
			animation.func(animation.ticks);
			animation.ticks++;
			if (animation.ticks >= animation.maxTicks) {
				removeDeezNutsLmao.push(animation);
			}
		}
		for (const animation of removeDeezNutsLmao) {
			remove(this.queue, animation);
		}
	}
}