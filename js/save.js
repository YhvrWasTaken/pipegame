"use strict";

function save() {
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

function loadPlayer() {
	let tempPlayer = JSON.parse(localStorage.getItem("pipegame-player-yhvr-v2"));
	for (const key in tempPlayer) {
		// TODO nested?
		if (
			tempPlayer[key] === null ||
			tempPlayer[key] === undefined ||
			isNaN(tempPlayer[key])
		)
			continue;
		if (typeof tempPlayer[key] === "string") player[key] = D(tempPlayer[key]);
		else player[key] = tempPlayer[key];
	}

	player.maxGensCost = D(genCapCosts[player.maxGens + 1]);
	lastMoney = player.money;
}

let shouldSave = true;

function deleteSave() {
	shouldSave = false;

	if (confirm("are u sure")) {
		localStorage.removeItem("pipegame-player-yhvr");
		localStorage.removeItem("pipegame-world-yhvr");
		window.location.reload();
	}

	shouldSave = true;
}

load();

setInterval(() => {
	if (shouldSave) save();
	else console.warn("shouldSave was false!");
}, 2500);
