"use strict";

let consumeOnPlace = false;
function drawShop() {
	let items = [];

	drawImage("max-gensup", 660, 180);
	drawImage("money", 700, 180, 0, 0.5);
	drawText(format(player.maxGensCost), 742, 216.5, {
		color: "#88ff88",
		font: "20px monospace"
	});

	if (shopItems[sidebarShopPage - 1] === undefined)
		drawText("no", 750, 465, {
			align: "center",
			color: "white",
			font: "50px monospace",
		});
	else {
		items = shopItems[sidebarShopPage - 1];
		items.forEach((item, i) => {
			if (item[1] !== Infinity)
				drawText(format(item[1]), 740, i * 60 + 337.5, {
					color: "#88ff88",
					font: "25px monospace",
				});
		});
	}

	if (cellX >= 11 && cellY >= 5 && cellY <= 8) {
		if (shopItems[sidebarShopPage - 1] === undefined) return;
		let text = shopTooltips[shopItems[sidebarShopPage - 1][cellY - 5][0]];
		if (text === undefined) text = "[No tooltip provided]";
		ctx.font = "12px sans-serif";
		let lines = calcWrapText(text);
		drawTooltip(
			text,
			650,
			visCellY * 60 + 35 - lines * 6,
			"right",
			160,
			lines
		);
	}

	items.forEach((item, i) => {
		drawBlock(item[0], 660, i * 60 + 300, 0, 0.75);
		if (item[0] !== "nothing")
			drawImage("money", 700, i * 60 + 300, 0, 0.5);
	});

	drawSidebarArrows();
	drawPagination(sidebarShopPage);
}

function handleShopClick(x, y, btn) {
	if (y >= 5 && y <= 8) {
		analyzing = false;
		const page = shopItems[sidebarShopPage - 1];
		if (page === undefined) return;
		const item = page[y - 5];
		if (item === undefined) return;
		if (player.money.gte(item[1]) && placing.is("nothing")) {
			// . player.money = player.money.sub(item[1]);
			consumeOnPlace = true;
			placing = Block(item[0]);
			// . moneyParticles(x, y, item[0].includes("bert") ? 50 : 10);
		}
	} else if (y === 3) {
		if (player.money.gte(player.maxGensCost)) {
			player.money = player.money.sub(player.maxGensCost);
			player.maxGens++;
			player.maxGensCost = D(genCapCosts[player.maxGens + 1]);
			moneyParticles(x, y, 25);
		}
	} else if (y === 9) {
		if (x === 0) {
			if (btn === 0) sidebarShopPage--;
			if (btn === 1) sidebarShopPage = 0;
			if (btn === 2) sidebarShopPage -= 10;
		} else if (x === 2) {
			if (btn === 0) sidebarShopPage++;
			if (btn === 1) sidebarShopPage = shopItems.length;
			if (btn === 2) sidebarShopPage += 10;
		}
	}

	if (sidebarShopPage <= 0) sidebarShopPage = 1;
}

function moneyParticles(x, y, amt = 10, img = "money") {
	addParticles(
		amt,
		img,
		2000,
		{
			x: (x + 11) * 60,
			y: y * 60,
			s: [0.25, 0.5],
			a: [1, 0.75],
		},
		{
			x: [-75, 75],
			y: [-100, -200],
			a: -0.25,
		},
		{
			y: [500, 1000],
		}
	);
}

function findCost(id) {
	if (id === "nothing") return D(0);

	let cost = 0;

	// TODO: cache flatted arrays?
	// actually just turn it into an object
	// of all costs
	shopItems.flat().forEach(item => {
		if (item[0] === id) cost = item[1];
	});
	if (cost === 0)
		rebirthShopItems.flat().forEach(item => {
			if (item[0] === id) cost = item[1];
		});
	if (cost === 0 && decor.flat().flat().includes(id)) cost = 0;

	return D(cost);
}
