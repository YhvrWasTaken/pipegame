"use strict";

let chunks = [];

function Chunk(
	x,
	y,
	value = D(1),
	color = [0, 0, 0],
	to = [x, y],
	data = {
		speed: 1,
		path: [],
		upg: structuredClone(defaultData),
		sv: value,
		t: "square",
	}
) {
	return {
		x,
		y,
		value,
		color,
		to,
		// Checks how much each upgrader has been used
		// Speed, what upgrades have been used, what the
		// value was at the start
		data,
	};
}

let currSquares = 0;

function addChunk(...args) {
	// Some strategy, a teeny bit of lag-fixing :)
	let isSquare = false;
	if (args[5]) {
		if (args[5].t === "square") isSquare = true;
	} else {
		isSquare = true;
	}
	if (isSquare && currSquares < player.maxGens * 5) {
		chunks.push(Chunk(...args));
		currSquares++;
	} else if (!isSquare) {
		chunks.push(Chunk(...args));
	}
}

function drop() {
	let newGenCount = 0;
	let queue = [];
	world.forEach((what, x) => {
		what.forEach((gen, y) => {
			if (!gen.id.startsWith("gen")) return;
			const genId = gen.id.substring(3);
			const value = D(chunkValues[genId] ?? 1);
			let type = "square";
			if (genId.startsWith("t")) type = "tri";
			newGenCount++;
			switch (gen.r) {
				// Includes 0deg
				default:
					queue.push([x + 0.5, y + 1.5, value, type, genId]);
					break;
				case 90:
					queue.push([x - 0.5, y + 0.5, value, type, genId]);
					break;
				case 180:
					queue.push([x + 0.5, y - 0.5, value, type, genId]);
					break;
				case 270:
					queue.push([x + 1.5, y + 0.5, value, type, genId]);
					break;
			}
		});
	});

	let interval = 1000 / newGenCount;
	queue.forEach(([x, y, value, type, genId], id) => {
		setTimeout(() => {
			if (paused) return;
			let rng = (Math.random() * 30 - 15) / 60;
			let rng2 = (Math.random() * 30 - 15) / 60;

			let upg = structuredClone(defaultData);

			if (genId === "11") upg[18] = 1;

			if (type === "tri") {
				addChunk(
					x + rng,
					y + rng2,
					value,
					[255, 255, 255],
					[x + rng, y + rng2],
					{
						speed: 1,
						path: [],
						upg,
						sv: value,
						t: "tri",
					}
				);
			} else
				addChunk(
					x + rng,
					y + rng2,
					value,
					[0, 0, 0],
					[x + rng, y + rng2],
					{
						speed: 1,
						path: [],
						upg,
						sv: value,
						t: type,
					}
				);
		}, interval * id);
	});

	currentGens = newGenCount;
}

function tickChunks(mult) {
	let newChunks = [];
	chunks.forEach(c => {
		let chunk = c;
		// **Advancement Unlocked**
		// How did we get here?
		if (chunk.data.t === "square") currSquares--;
		if (floor(chunk.x) < 0) return;
		if (floor(chunk.y) < 0) return;
		if (floor(chunk.x) >= 11) return;
		if (floor(chunk.y) >= 11) return;
		if (chunk.data.t === "square") currSquares++;

		let [shouldExist, tile] = chunkShouldExist(
			chunk,
			world[floor(chunk.x)][floor(chunk.y)]
		);
		if (chunk.value.lt(0.01) && chunk.data.t === "tri") shouldExist = false;
		world[floor(chunk.x)][floor(chunk.y)] = tile;
		if (!shouldExist) return;

		let {
			x,
			y,
			to,
			data: { speed },
		} = chunk;
		let keep = true;
		let extra = false;

		if (conveyorSpeeds[tile.id]) speed = conveyorSpeeds[tile.id];

		if (to[0] === x && to[1] === y) {
			[chunk, keep, to, extra] = chunkDesitnation(chunk, tile);
		} else {
			if (to[0] > x) {
				x = Math.min(x + mult * speed, to[0]);
			} else if (to[0] < x) {
				x = Math.max(x - mult * speed, to[0]);
			}

			if (to[1] > y) {
				y = Math.min(y + mult * speed, to[1]);
			} else if (to[1] < y) {
				y = Math.max(y - mult * speed, to[1]);
			}
		}

		chunk.data.speed = speed;

		if (keep) {
			newChunks.push(
				Chunk(x, y, chunk.value, chunk.color, to, chunk.data)
			);
			if (extra) newChunks.push(Chunk(...extra));
		} else if (chunk.data.t === "square") currSquares--;
	});
	chunks = newChunks;
}

// TODO furnace.js?
function sellChunk(chunk, block) {
	let mult = furnaceMults[block.id];
	if (typeof mult === "function") {
		const out = mult(chunk, block);
		if (out instanceof Decimal || typeof out === "number") mult = D(out);
		else {
			if (out.mult !== undefined) mult = out.mult;
			if (out.block !== undefined) block = out.block;
		}
	}

	if (chunk.data.t !== "square") return block;

	player.money = player.money.add(chunk.value.mul(mult));
	addParticle(
		"money",
		1000,
		{
			x:
				(Math.round(chunk.x + 0.5) - 0.5) * 60 -
				30 +
				(Math.random() * 30 - 15),
			y:
				(Math.round(chunk.y + 0.5) - 0.5) * 60 -
				30 +
				(Math.random() * 30 - 15),
			s: 0.33,
			a: 1,
		},
		{
			y: -50,
			a: -1,
		},
		{
			y: 50,
		}
	);
	return block;
}

function chunkShouldExist(chunk, tile) {
	if (!tile.id.startsWith("conveyor") && !tile.id.startsWith("upgrade")) {
		if (tile.id.startsWith("furnace")) {
			tile = sellChunk(chunk, tile);
		}
		if (chunk.data.t === "square") currSquares--;
		return [false, tile];
	}
	return [true, tile];
}

function chunkDesitnation(chunk, tile) {
	let keep = true;
	let extra = false;
	if (tile.id.startsWith("upgrade")) {
		[chunk, keep, tile, extra] = upgradeChunk(chunk, tile);
	}

	let to = [chunk.x + 1, chunk.y];

	switch (tile.r) {
		case 90:
			to = [chunk.x, chunk.y + 1];
			break;
		case 180:
			to = [chunk.x - 1, chunk.y];
			break;
		case 270:
			to = [chunk.x, chunk.y - 1];
			break;
	}

	return [chunk, keep, to, extra];
}
