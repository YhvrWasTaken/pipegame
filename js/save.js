"use strict";

function save() {
	if (!shouldSave) return;
	saveWorld();
	savePlayer();

	localStorage.setItem(
		"!!! READ ME",
		`This is save data for all your stuff on my website.
If you don't know what you're doing, you could CORRUPT YOUR SAVE and LOSE ALL YOUR PROGRESS.
If you think you know what you're doing, proceed with caution.`
	);
}

function saveWorld() {
	// Encode to, uh, 3D array?
	localStorage.setItem("pipegame-world-yhvr", JSON.stringify(world));
}

function savePlayer() {
	localStorage.setItem("pipegame-player-yhvr-v2", JSON.stringify(player));
}

function load() {
	if (localStorage.getItem("pipegame-world-yhvr")) {
		loadWorld();
		loadPlayer();

		chunks = [];
	} else {
		const tryMatchMedia =
			window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
		const isTouchScreen =
			"ontouchstart" in window ||
			navigator.msMaxTouchPoint ||
			tryMatchMedia;
		if (isTouchScreen) {
			setTimeout(() => {
				if (
					confirm(
						"We have detected you are using a touchscreen device. Do you wish to turn on mobile controls?"
					)
				)
					player.options.mobileControls = true;
			}, 1000);
		}
	}
}

function loadWorld() {
	const tempWorld = JSON.parse(localStorage.getItem("pipegame-world-yhvr"));

	if (tempWorld === null) {
		console.warn("Couldn't load world?");
		return;
	}

	world = tempWorld.map(x => x.map(y => Block(y.id)));
	tempWorld.forEach((row, x) => {
		row.forEach((block, y) => {
			world[x][y].r = block.r;
			world[x][y].data = block.data;
		});
	});
}

const migrations = {};

function decimalise(target) {
	for (const i in target) {
		if (typeof target[i] === "string") target[i] = D(target[i]);
		else if (typeof target[i] === "object") decimalise(target[i]);
	}
	return target;
}

function coercePlayer(target, source) {
	if (target === null || target === undefined || checkNaN(target))
		return source;
	if (typeof target !== "object") return target;
	let fillObject;
	if (source.constructor === Array) fillObject = [];
	else fillObject = {};
	for (const prop of Object.keys(source)) {
		fillObject[prop] = coercePlayer(target[prop], source[prop]);
	}
	return fillObject;
}

function loadPlayer() {
	let tempPlayer = decimalise(
		JSON.parse(localStorage.getItem("pipegame-player-yhvr-v2"))
	);
	deepAssign(player, coercePlayer(tempPlayer, initialPlayerStart));

	player.maxGensCost = D(genCapCosts[player.maxGens + 1]);
	lastMoney = player.money;
}

let shouldSave = true;

function deleteSave() {
	shouldSave = false;

	if (confirm("Are you sure you want to delete your save?")) {
		localStorage.removeItem("pipegame-world-yhvr");
		localStorage.removeItem("pipegame-world-yhvr");
		window.location.reload();
	} else {
		shouldSave = true;
	}
}

load();

setInterval(() => {
	if (shouldSave) save();
	else console.warn("shouldSave was false!");
}, 2500);

function exportSave() {
	const save =
		btoa(localStorage.getItem("pipegame-world-yhvr")) +
		"," +
		btoa(localStorage.getItem("pipegame-player-yhvr-v2"));
	navigator.clipboard.writeText(save);
	if (!confirm("Attempted to copy to clipboard. Did you get it? (OK = Yes)")) {
		prompt("Copy this:", save);
	}
}

function importSave() {
	shouldSave = false;

	let save = prompt("Paste your save in here:");
	if (!save) return;
	save = save.split(",");
	
	// TODO FINISH THIS
	localStorage.setItem("pipegame-world-yhvr", atob(save[0]));
	localStorage.setItem("pipegame-player-yhvr-v2", atob(save[1]));
	window.location.reload();
	
	setTimeout(() => {
		shouldSave = true;
	}, 5000);
}