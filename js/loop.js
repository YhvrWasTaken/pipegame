"use strict";

let lastTick = Date.now();
let lastAnimTick = Date.now();
let lastDrop = 0;

// FPS Tracking
// https://stackoverflow.com/a/6131242
let t = [];
let fps = 60;

function loop(now) {
	t.unshift(now);

	if (t.length > 10) {
		let t0 = t.pop();
		fps = Math.floor((1000 * 10) / (now - t0));
	}

	let animDiff = Date.now() - lastAnimTick;
	lastAnimTick = Date.now();
	if (!hasStartedGame) {
		draw(animDiff / 1000);
		updateDOM();
		window.requestAnimationFrame(loop);
		return;
	}
	if (paused) {
		if (!player.dev) player.fastTime += animDiff / 1000;
		lastTick = Date.now();
	} else {
		let diff = Date.now() - lastTick;
		lastTick = Date.now();

		if (diff >= 1000) {
			player.fastTime += diff / 1000 - 1;
			diff = 1000;
		}

		if (analyzing) {
			diff /= 2;
			player.fastTime += diff / 1000;
		}

		if (player.fastTime > 0 && !analyzing) {
			const mult = Math.max(player.fastTime / 100 + 1, 2);
			diff *= mult;
			player.fastTime -= mult / fps;
			if (player.fastTime < 0) player.fastTime = 0;
		}

		lastDrop += diff;
		if (lastDrop >= 1000) {
			lastDrop = 0;
			drop();
		}

		tickChunks(diff / 1000);
	}

	draw(animDiff / 1000);

	updateDOM();
	
	window.requestAnimationFrame(loop);
}

window.requestAnimationFrame(loop);

let errors = 0;

window.addEventListener("error", () => {
	errors++;
	if (errors < 2) {
		console.log(
			`An error occured.\nThe game will try to recover gracefully. Probably won't succeed.`
		);
		window.requestAnimationFrame(loop);
	} else if (errors === 2) {
		console.log("Check the console. I give up.");
	}
});

let lastMoney = player.money;
let lastMPS = D(0);
setInterval(() => {
	if (!paused) {
		lastMPS = player.money.sub(lastMoney);
		lastMoney = player.money;
	}
}, 1000);