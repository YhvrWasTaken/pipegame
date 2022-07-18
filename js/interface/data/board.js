let boardX = 0, boardY = 0, boardXUnrounded = 0, boardYUnrounded = 0;
// Part of board which is unused background
Interface.add({
	bottom: 0,
	left: 0,
	width: -3,
	height: -1,
	draw() {
		this.background(player.options.dark ? "#151515" : "#666");
	}
});
const Board = Interface.add({
	top: 1,
	left: 0,
	width: 11,
	height: 11,
	draw() {
		if (paused) this.background("#222");
		else this.background(player.options.dark ? "#333" : "#444");
	
		// All the blocks on the board
		world.forEach((what, x) => {
			what.forEach((item, y) => {
				if (item.is("nothing")) return;
				drawBlock(item.id, x * 60, y * 60, item.r, 1, item.data);
			});
		});

		// All the chunks on the board
		chunks.forEach(chunk => drawChunk(chunk));
		if (analyzing && openAnalysis && chunks.includes(openAnalysis)) {
			drawChunk(openAnalysis, true);
		}
	},
	onMousedown(x, y, e) {
		x = floor(x);
		y = floor(y);
		if (analyzing) {
			checkAnalysis();
			return;
		}

		if (e.button === 2) {
			if (placing.is("nothing")) control.multibreak = true;
			else if (!multibreakTimeout) multibreakTimeout = setTimeout(() => control.multibreak = true, 300);
			deleteBlock();
			return;
		}

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

		if (e.shiftKey === true) {
			control.multiplace = true;
		}

		let should = true;
		let shouldPlace = true;
		let shouldData = true;
		let consumeOnNextPlace = false;

		if (ground.is("nothing") && e.shiftKey) {
			let cost = findCost(placing.id);

			if (player.money.gte(cost)) {
				// . player.money = player.money.sub(cost);
				consumeOnNextPlace = true;
				// . moneyParticles(mx / 60 - 11, my / 60, 5);

				should = false;
				shouldData = false;
			}
		} else if (placing.is("nothing") && e.shiftKey) {
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
	},
	onMousemove(x, y) {
		boardXUnrounded = x;
		boardYUnrounded = y;
		boardX = Math.max(0, Math.min(floor(x), 10));
		boardY = Math.max(0, Math.min(floor(y), 10));
		if (control.multibreak) deleteBlock();
		let ground = copyBlock(world[boardX][boardY]);
		if (control.multiplace && ground.is("nothing")) {
			let cost = findCost(placing.id);
	
			if (placing.id.startsWith("gen") && currentGens >= player.maxGens)
				return;
	
			if (player.money.gte(cost)) {
				player.money = player.money.sub(cost);
				// . moneyParticles(mx / 60 - 11, my / 60, 5);
				world[boardX][boardY] = copyBlock(placing, false);
				if (placing.id.startsWith("gen")) currentGens++;
			}
		}
	}
});

const BoardParticleDisplay = Interface.add({
	zIndex: 1,
	hasCursorEvents: false,
	draw() {
		this.top = Board.top;
		this.left = Board.left;
		this.width = Board.width;
		this.height = Board.height;

		particles.forEach(p => {
			ctx.globalAlpha = Math.max(p.a, 0);
			drawBlock(p.img, p.x, p.y, p.r, p.s);
		});
	}
})