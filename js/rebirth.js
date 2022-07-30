"use strict";

// Rebirth data
// TODO data/rebirth.js

const rebirthCosts = [5.0e30, 1.0e100];
let rebirthAnim = false;

let rebirthSubMenu = "info";

// Drawing rebirth

let rebirthShopPage = 0;
let rebirthDecorPage = 0;

// TODO data/decor.js
const decor = [
	[
		["wigbert", "gaybert", "transbert"],
		["yellowbert", "greenbert", "glassbert"],
		["trebun", "unbert", "orangebert"],
	],
];

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
	rebirthSubMenu = "rebshop";
	shopSubMenu = "inv";
	sidebarMenu = "shop";
	sidebarShopPage = 0;

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
	// This might cause a crash with anal lol
	chunks = [];
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

	setTimeout(() => {
		player.money = D(0);
	}, 1000);
}
