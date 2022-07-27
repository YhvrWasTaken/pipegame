"use strict";

let consumeOnPlace = false;
let shopSubMenu = "inv";

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
	shopItems.forEach(item => {
		if (item[0] === id) cost = item[1];
	});
	if (cost === 0)
		rebirthShopItems.flat().forEach(item => {
			if (item[0] === id) cost = item[1];
		});
	if (cost === 0 && decor.flat().flat().includes(id)) cost = 0;

	return D(cost);
}
