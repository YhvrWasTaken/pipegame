"use strict";

// Rebirth data
// TODO data/rebirth.js

const rebirthCosts = [5.0e30, 1.0e100];
let rebirthAnim = false;

// Sidebar clicks

let rebirthSubMenu = "info";
// ...Sorry.
/* eslint-disable-next-line complexity */
function handleRebirthClick(x, y) {
	if (rebirthAnim === true) return;

	if (y === 9) {
		if (x === 0) rebirthSubMenu = "info";
		if (x === 1 && player.rebirth >= 1) rebirthSubMenu = "shop";
		if (x === 2 && player.rebirth >= 1) rebirthSubMenu = "decor";
	}

	if (
		rebirthSubMenu === "info" &&
		y === 3 &&
		player.money.gte(rebirthCosts[player.rebirth])
	) {
		rebirthSubMenu = "confirm";
	} else if (rebirthSubMenu === "confirm" && y === 6) {
		if (x === 0) rebirthAnimation();
		if (x === 2) rebirthSubMenu = "info";
	} else if (rebirthSubMenu === "shop") {
		if (y === 8) {
			if (x === 0) rebirthShopPage--;
			if (x === 2) rebirthShopPage++;
			rebirthShopPage = Math.max(
				Math.min(rebirthShopPage, player.rebirth),
				1
			);
		} else if (y >= 5 && y <= 7) {
			let item = rebirthShopItems[rebirthShopPage - 1][y - 5];
			if (player.money.gte(item[1]) && placing.is("nothing")) {
				player.money = player.money.sub(item[1]);
				placing = Block(item[0]);
				moneyParticles(x, y, 25, "shards");
			}
		}
	} else if (rebirthSubMenu === "decor") {
		if (y === 8) {
			if (x === 0) rebirthShopPage--;
			if (x === 2) rebirthShopPage++;
			rebirthShopPage = Math.max(
				Math.min(rebirthShopPage, player.rebirth),
				1
			);
		} else if (y >= 5 && y <= 7) {
			let item = decor[rebirthDecorPage - 1][y - 5][x];
			if (placing.is("nothing")) {
				placing = Block(item);
				moneyParticles(x, y, 10, item);
			}
		}
	}
}

// Drawing rebirth

let rebirthShopPage = 1;
let rebirthDecorPage = 1;

function drawRebirthSidebar() {
	if (rebirthSubMenu === "info") drawRebirthInfo();
	if (rebirthSubMenu === "confirm") drawRebirthConfirmation();
	if (rebirthSubMenu === "shop") drawRebirthShop();
	if (rebirthSubMenu === "decor") drawRebirthDecor();

	drawImage(`infotab${rebirthSubMenu === "info" ? "-open" : ""}`, 660, 540);
	if (player.rebirth >= 1)
		drawImage(
			`rebshop${rebirthSubMenu === "shop" ? "-open" : ""}`,
			720,
			540
		);
	if (player.rebirth >= 1)
		drawImage(
			`decor${rebirthSubMenu === "decor" ? "-open" : ""}`,
			780,
			540
		);
}

// TODO data/decor.js
const decor = [
	[
		["wigbert", "gaybert", "transbert"],
		["yellowbert", "greenbert", "glassbert"],
		["trebun", "unbert", "orangebert"],
	],
];

function drawRebirthDecor() {
	drawPagination(rebirthDecorPage, 530);
	drawSidebarArrows(480);

	decor[rebirthDecorPage - 1].forEach((row, y) => {
		row.forEach((item, x) => {
			drawImage(item, 660 + x * 60, 300 + y * 60);
		});
	});
}

function drawRebirthShop() {
	drawPagination(rebirthShopPage, 530);
	drawSidebarArrows(480);

	let items = rebirthShopItems[rebirthShopPage - 1];
	items.forEach((item, i) => {
		drawBlock(item[0], 660, i * 60 + 300, 0, 0.75);
		if (item[1] !== Infinity)
			drawText(format(item[1]), 740, i * 60 + 337.5, {
				color: "#88ff88",
				font: "25px monospace",
			});
		if (item[0] !== "nothing")
			drawImage("money", 700, i * 60 + 300, 0, 0.5);
	});

	if (cellX >= 11 && cellY >= 5 && cellY <= 7) {
		if (rebirthShopItems[rebirthShopPage - 1] === undefined) return;
		let text =
			shopTooltips[rebirthShopItems[rebirthShopPage - 1][cellY - 5][0]];
		if (text === undefined) return;
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
}

function drawRebirthConfirmation() {
	drawText("Are you sure?", 750, 340, {
		color: "#ffdddd",
		align: "center",
		font: "20px monospace",
	});
	drawImage("yes-button", 660, 360);
	drawImage("no-button", 780, 360);
}

function drawRebirthInfo() {
	drawImage("rebirth-banner", 660, 180);
	drawText("Req:", 665, 260, {
		color: "white",
		align: "left",
		font: "25px monospace",
	});

	drawText(format(rebirthCosts[player.rebirth]), 835, 260, {
		color: "#88ff88",
		align: "right",
		font: "25px monospace",
	});
	drawText(player.rebirth === 0 ? "+10 Shards" : "x2 Shards", 750, 290, {
		color: "#88ffff",
		align: "center",
		font: "inherit",
	});
	const warningFont = {
		color: "#fcc",
		align: "center",
		font: "20px monospace",
	};
	drawText("Resets Factory", 750, 320, warningFont);
	drawText("Resets Money", 750, 345, warningFont);
	drawText("Removes Nubert", 750, 370, warningFont);
	drawText("3 New Blocks", 750, 395, {
		color: "#ccf",
		align: "center",
		font: "inherit",
	});
	drawText("9 Decor Items", 750, 420, {
		color: "#ccf",
		align: "center",
		font: "inherit",
	});
}

// Rebirth animation stuff

const allText = id("text");
const rebirthTexts = [
	"oh... who's there..?",
	"who are you..?",
	"that's a nice name...",
	"but... why are you here..?",
	"oh...",
	"i'm not sure if i could...",
	"that's a lot to ask of me...",
	"why should I do it for you..?",
	"i mean... if you say so...",
	"here i gooooooooo..........",
];

function rebirthAnimation() {
	rebirthSubMenu = "shop";
	sidebarMenu = "shop";
	sidebarShopPage = 1;

	rebirthAnim = true;

	canvas.style.filter = "blur(10px) brightness(150%)";
	setTimeout(() => {
		allText.style.opacity = 0;
		canvas.style.filter = "blur(20px) brightness(200%)";
	}, 2000);

	setTimeout(() => {
		canvas.style.filter = "blur(50px) brightness(500%)";
	}, 4000);

	setTimeout(() => {
		canvas.style.filter = "blur(100px) brightness(1000%)";
	}, 6000);

	setTimeout(() => {
		showRebirthText(player.rebirth);
	}, 6000);

	setTimeout(() => {
		canvas.style.filter = "";
		rebirthEffect();
	}, 16000);

	setTimeout(() => {
		allText.style.opacity = 1;
	}, 21000);
}

function showRebirthText(id) {
	const el = document.createElement("span");
	el.textContent = rebirthTexts[id];
	el.classList.add("lore");
	document.body.appendChild(el);
	setTimeout(() => {
		el.style.opacity = 1;
	}, 100);
	setTimeout(() => {
		el.style.opacity = 0;
	}, 5000);
	setTimeout(() => {
		el.remove();
	}, 10000);
}

function rebirthEffect() {
	player.money = D(0);
	player.rebirth++;
	rebirthAnim = false;
	placing = Block("nothing");
	if (player.shards.lte(5)) {
		player.shards = D(10);
	} else {
		player.shards = player.shards.mul(2);
	}
	world = new Array(11)
		.fill(0)
		.map(() => new Array(11).fill(Block("nothing")));

	world[5][4] = Block("gen1");
	world[5][5] = Block("conveyor");
	world[5][5].r = 90;
	world[5][6] = Block("furnace");
}
