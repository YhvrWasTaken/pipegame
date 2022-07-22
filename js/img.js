"use strict";

let imgs = [
	"logo",
	"controls",

	"cursor",
	"analyze",

	"money",
	"max-gens",
	"max-gensup",
	"shards",

	"rebirth-banner",

	"trianglefuel",

	"arrow-left",
	"arrow-right",
	"caret",

	"inv-open",
	"inv",
	"shop-open",
	"shop",
	"upg-open",
	"upg",
	"rebirth-open",
	"rebirth",
	"rebshop-open",
	"rebshop",
	"decor-open",
	"decor",
	"info-open",
	"info",

	"collapse",
	"expand",
	"settings",
	"discord-icon",
	"guilded-icon",
	"sourcecode-icon",
	"continue",
	"pause",
	"ctrl",

	"yes-button",
	"no-button",

	"toggle-true",
	"toggle-false",

	"r-cw",
	"r-ccw",
	"trashcan",

	"conveyor",
	"conveyor2",
	"conveyor3",
	"conveyor4",
	"conveyor5",
	"conveyor6",
	"conveyor7",
	"conveyor8",
	"conveyor9",
	"conveyor10",

	"upgradec1",
	"upgradec2",
	"upgradec3d1",
	"upgradec3d2",

	"furnace",
	"furnace2",
	"furnace3",
	"furnace4",
	"furnace5",
	"furnace6",
	"furnace7",
	"furnace8",
	"furnace9",
	"furnace10",

	"furnacet1d",
	"furnacet2d",
	"furnacet3d",
	"furnacet4d",

	"furnacer1",

	"gen1",
	"gen2",
	"gen3",
	"gen4",
	"gen5",
	"gen6",
	"gen7",
	"gen8",
	"gen9",
	"gen10",
	"gen11",
	"gen12",

	"gent1",
	"gent2",
	"gent3",
	"gent4",
	"gent5",

	"genn1",

	"upgrade1",
	"upgrade2",
	"upgrade3",
	"upgrade4",
	"upgrade5",
	"upgrade6",
	"upgrade7",
	"upgrade8",
	"upgrade9",
	"upgrade10",
	"upgrade11",
	"upgrade12",
	"upgrade13",
	"upgrade14",
	"upgrade15",
	"upgrade16",
	"upgrade17",
	"upgrade18",
	"upgrade19",
	"upgrade20",
	"upgrade21",
	"upgrade22",
	"upgrade23",
	"upgrade24",
	"upgrade25",

	"upgradett1",
	"upgradett2",
	"upgradett3",
	"upgradett4",
	"upgradett5",
	"upgradett6",
	"upgradett7",

	"upgrader1",

	"upgradert1",

	"nubert",
	"bluebert",
	"wigbert",
	"gaybert",
	"transbert",
	"transparentbert",
	"glassbert",
	"greenbert",
	"yellowbert",
	"trebun",
	"unbert",
	"orangebert",

	"unknown",
];

let isLoading = true;
let loading = [0, imgs.length];

function imageLoaded() {
	loading[0]++;
	if (loading[0] === loading[1]) {
		isLoading = false;
	}
}

const images = {};
imgs.forEach(image => {
	const img = new Image();
	img.src = `img/${image}.png`;

	img.onload = imageLoaded;
	images[image] = img;
});
