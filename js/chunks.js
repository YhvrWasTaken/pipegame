"use strict";

let chunks = [];
let TriChunkMerger = (function() {
	// Change these if you want to change the merge behaviour
	const MAX_CHUNKS_IN_SINGLE_SPOT = 40;
	const GROUP_BULK = 8;
	const GROUP_ANIM_SPEED = 10;
	function triChunks() {
		return chunks.filter(x => x.data.t === "tri");
	};

	return {
		atPosition: (x, y) => triChunks().filter(chunk => chunk.to[0] === x && chunk.to[1] === y),
		attemptMerge(x, y) {
			const array = this.atPosition(x, y);
			if (array.length < MAX_CHUNKS_IN_SINGLE_SPOT) return;

			let localChunks = {};
			for (const chunk of array) {
				const key = chunk.data.upg.join("_");
				if (!(key in localChunks)) localChunks[key] = [];
				localChunks[key].push(chunk);
				if (localChunks[key].length >= GROUP_BULK) {
					const meanPos = [Math.mean(localChunks[key], x => x.x), Math.mean(localChunks[key], x => x.y)];
					const valueSum = Math.sum(localChunks[key], x => x.value);
					const colors = localChunks[key].map(x => x.color);
					const colorMean = Array.from([0, 1, 2], id => Math.mean(colors, x => x[id]));
					const data = {
						speed: Math.max(...localChunks[key].map(x => x.data.speed)),
						path: localChunks[key].map(x => x.data.path).reduce((a, v) => v.length > a.length ? v : a),
						upg: chunk.data.upg,
						sv: Math.mean(localChunks[key].map(x => x.data.sv)),
						t: "tri",
						stacks: Math.min(Math.sum(localChunks[key], x => x.data.stacks), 1e3)
						// 1e3 is just an arbitrarily large number
					}
					const pushedChunk = Chunk(
						meanPos[0],
						meanPos[1],
						valueSum,
						colorMean,
						chunk.to,
						localChunks[key][floor(Math.random() * 5)].offset,
						data
					);
					for (const discardedChunk of localChunks[key]) {
						removeFromWorld(discardedChunk);
						CanvasAnimator.add(tick => {
							const alpha = tick / GROUP_ANIM_SPEED;
							const [x, y] = [
								Math.lerp(discardedChunk.x, pushedChunk.x, alpha),
								Math.lerp(discardedChunk.y, pushedChunk.y, alpha)
							];
							const color = discardedChunk.color.map((x, id) => Math.lerp(x, pushedChunk.color[id], alpha));
							drawTriangleChunk(x * 60 - 10, y * 60 - 10, `rgb(${color.join(",")})`);
							ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
							ctx.beginPath();
							ctx.moveTo(x * 60, y * 60 - 6);
							ctx.lineTo(x * 60 + 6, y * 60 + 6);
							ctx.lineTo(x * 60 - 6, y * 60 + 6);
							ctx.fill();
						}, GROUP_ANIM_SPEED);
					}
					chunks.push(pushedChunk);
					return;
				}
			}
		}
	}
})();

function Chunk(
	x,
	y,
	value = D(1),
	color = [0, 0, 0],
	to = [x, y],
	offset = [0, 0],
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
		// Offset is how much each chunk deviates from its base position when drawn
		offset,
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
	const chunk = Chunk(...args);
	// args[6] == data
	const type = chunk.data.t;
	if (type === "square") isSquare = true;
	if (isSquare && currSquares < player.maxGens * 5) {
		chunks.push(chunk);
		currSquares++;
	} else if (!isSquare) {
		chunks.push(chunk);
	}
	if (type === "tri") {
		TriChunkMerger.attemptMerge(chunk.to[0], chunk.to[1]);
	}
}

function removeFromWorld(chunk) {
	if (chunk.data.t === "square") currSquares--;
	remove(chunks, chunk);
	chunk.data.path.unshift("gone");
	chunk.data.path.splice(150);
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

			if (type === "tri")
				addChunk(
					x,
					y,
					value,
					[255, 255, 255],
					[x, y],
					[rng, rng2],
					{
						speed: 1,
						path: [],
						upg,
						sv: value,
						t: "tri",
						stacks: 1
					},
				);
			else
				addChunk(
					x,
					y,
					value,
					[0, 0, 0],
					[x, y],
					[rng, rng2],
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
	const attemptMergeThese = [];
	chunks.forEach(c => {
		let chunk = c;
		// **Advancement Unlocked**
		// How did we get here?
		if (floor(chunk.x) < 0) return removeFromWorld(chunk);
		if (floor(chunk.y) < 0) return removeFromWorld(chunk);
		if (floor(chunk.x) >= 11) return removeFromWorld(chunk);
		if (floor(chunk.y) >= 11) return removeFromWorld(chunk);

		let [shouldExist, tile] = chunkShouldExist(
			chunk,
			world[floor(chunk.x)][floor(chunk.y)]
		);
		if (chunk.value.lt(0.01) && chunk.data.t === "tri") shouldExist = false;
		world[floor(chunk.x)][floor(chunk.y)] = tile;
		if (!shouldExist) return removeFromWorld(chunk);

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
			let replaceChunk;
			if (chunk.data.t === "tri") attemptMergeThese.push(chunk.to);
			[replaceChunk, keep, to, extra] = chunkDesitnation(chunk, tile);
			Object.assign(chunk, replaceChunk);
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

		if (!keep) return removeFromWorld(chunk);

		if (extra) addChunk(...extra);
		chunk.x = x;
		chunk.y = y;
		chunk.to = to;
	});
	attemptMergeThese.forEach(to => {
		TriChunkMerger.attemptMerge(to[0], to[1]);
	});
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
