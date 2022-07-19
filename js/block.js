"use strict";

// Haha, no classes for you
function Block(id) {
	return {
		id,
		// Rotation (0 -> 360)
		r: 0,
		// Block data
		data: 0,
		is(bid) {
			return this.id === bid;
		},
		isnt(bid) {
			return this.id !== bid;
		},
	};
}

function copyBlock(block, copyData = true) {
	const out = Block(block.id);
	out.r = block.r;
	if (copyData) out.data = block.data;
	return out;
}

function interactWithBoard(x, y, multiplace = false) {
	let ground = copyBlock(world[x][y]);

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

	if (multiplace === true) {
		control.multiplace = true;
	}

	let should = true;
	let shouldPlace = true;
	let shouldData = true;
	let consumeOnNextPlace = false;

	if (ground.is("nothing") && multiplace) {
		let cost = findCost(placing.id);

		if (player.money.gte(cost)) {
			// . player.money = player.money.sub(cost);
			consumeOnNextPlace = true;
			// . moneyParticles(mx / 60 - 11, my / 60, 5);

			should = false;
			shouldData = false;
		}
	} else if (placing.is("nothing") && multiplace) {
		let cost = findCost(ground.id);

		if (player.money.gte(cost)) {
			// . player.money = player.money.sub(cost);
			// . moneyParticles(mx / 60 - 11.5, my / 60, 5);
			world[x][y] = ground;
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
	if (shouldPlace) world[x][y] = copyBlock(placing, shouldData);
	if (should) placing = copyBlock(ground, shouldData);
	if (consumeOnNextPlace) consumeOnPlace = true;
}
function drawBlock(id, x, y, rot = 0, scale = 1, state) {
	if (id === "nothing") return;
	if (images[id]) drawImage(id, x, y, rot, scale);
	else if (customDraw[id]) {
		ctx.save();
		ctx.translate(x + 30, y + 30);
		ctx.scale(scale, scale);
		ctx.rotate(toRadians(rot));

		customDraw[id](state);
		ctx.restore();
	} else {
		drawImage("unknown", x, y, rot, scale);
	}
}

const customDraw = {
	upgradet1(state = 0) {
		drawBasicTriUpg(state, 20, "rgb(127, 127, 127)");
	},
	upgradet2(state = 0) {
		drawBasicTriUpg(state, 20, "rgb(255, 127, 127)");
	},
	upgradet3(state = 0) {
		drawBasicTriUpg(state, 40, "rgb(255, 191, 127)");
	},
	upgradet4(state = 0) {
		drawBasicTriUpg(state, 80, "rgb(255, 255, 127)");
	},
	upgradet5(state = 0) {
		drawBasicTriUpg(state, 200, "rgb(191, 255, 127)");
	},
	upgradet6(state = 0) {
		drawBasicTriUpg(state, 10000, "rgb(127, 255, 127)");
	},
	upgradet7(state = 0) {
		drawBasicTriUpg(state, 10000, "rgb(127, 255, 191)");
	},
	upgradet8(state = 0) {
		drawBasicTriUpg(state, 10_000_000, "rgb(127, 255, 255)");
	},
	upgradet9(state = 0) {
		drawBasicTriUpg(state, 2.0e8, "rgb(127, 127, 127)");
		ctx.beginPath();
		ctx.moveTo(-20, -15);
		ctx.lineTo(0, 0);
		ctx.lineTo(-20, 15);
		ctx.moveTo(0, -15);
		ctx.lineTo(20, 0);
		ctx.lineTo(0, 15);
		ctx.fill();
	},

	furnacet1(state = 0) {
		drawBasicTriFurnace(state, 100, "furnacet1d");
	},
	furnacet2(state = 0) {
		drawBasicTriFurnace(state, 10_000, "furnacet2d");
	},
	furnacet3(state = 0) {
		drawBasicTriFurnace(state, 20_000, "furnacet3d");
	},
	furnacet4(state = 0) {
		drawBasicTriFurnace(state, 2.0e7, "furnacet4d");
	},

	upgradec3(state = 0) {
		if (state === 1) {
			ctx.rotate(toRadians(90));
			ctx.drawImage(images.upgradec3d1, -30, -30);
		} else {
			ctx.rotate(toRadians(-90));
			ctx.drawImage(images.upgradec3d2, -30, -30);
		}
	},
};

function getColor(curr, max) {
	if (curr > max) return "rgb(127, 255, 127)";
	if (curr > (max / 5) * 4) return "rgb(191, 255, 127)";
	if (curr > (max / 5) * 3) return "rgb(255, 255, 127)";
	if (curr > (max / 5) * 2) return "rgb(255, 191, 127)";
	if (curr > max / 5) return "rgb(255, 127, 127)";
	return "red";
}

// TODO triangle.js

function drawBasicTriUpg(state, max, arrow) {
	ctx.fillStyle = getColor(state, max);
	ctx.fillRect(-30, -24, 60, 6);
	ctx.fillRect(-30, 18, 60, 6);

	ctx.fillStyle = "rgb(191, 191, 191)";
	ctx.fillRect(-30, -18, 60, 36);

	ctx.strokeStyle = arrow;
	ctx.fillStyle = arrow;
	ctx.beginPath();
	ctx.moveTo(-10, -15);
	ctx.lineTo(10, 0);
	ctx.lineTo(-10, 15);
	ctx.fill();
}

function drawBasicTriFurnace(state, max, id) {
	ctx.drawImage(images[id], -30, -30);
	let prog = Math.min(state / max, 1);
	ctx.fillStyle = getColor(state, max);
	ctx.globalAlpha = 0.5;
	ctx.fillRect(-30, -30, prog * 60, 5);
	ctx.globalAlpha = 1;
}

let currentGens = 1;
