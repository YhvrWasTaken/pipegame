"use strict";

let sidebarMenu = "shop";
let sidebarShopPage = 1;
let sidebarInvPage = 1;

function drawSidebar() {
	ctx.resetTransform();
	drawRect(660, 0, 180, 660, "#888");

	// Draw text/solid colors here
	drawText(format(player.money), 720, 32.5, {
		max: 120,
		color: "#88ff88",
		font: "30px monospace",
	});
	drawText(`${format(lastMPS)}/s`, 720, 52.5, {
		max: 120,
		color: "inherit",
		font: "20px monospace",
	});

	drawText(`${currentGens}/${player.maxGens}`, 700, 88, {
		max: 120,
		color: "#fff",
		font: "25px monospace",
	});

	drawText(`${currSquares}/${player.maxGens * 5}`, 730, 115, {
		color: "inherit",
		font: "inherit",
	});

	if (player.shards.neq(0))
		drawText(format(player.shards), 720, 160, {
			max: 120,
			color: "#bbbbff",
			font: "30px monospace",
		});

	let tt = sidebarTooltips[`${cellX - 11},${cellY}`];
	if (cellY === 2 && cellX >= 11 && player.shards.neq(0)) tt = "The number of Shards you have.";

	// Weird tooltip stuff, I guess?
	ctx.textAlign = "start";
	if (tt) {
		ctx.font = "12px sans-serif";
		let lines = calcWrapText(tt);
		drawTooltip(
			tt,
			650,
			visCellY * 60 + 35 - lines * 6,
			"right",
			160,
			lines
		);
	}

	drawImage("money", 660, 0);
	if (player.shards.neq(0)) drawImage("shards", 660, 120);

	drawImage("max-gens", 650, 55, 0, 0.75);
	drawImage(`shop${sidebarMenu === "shop" ? "-open" : ""}`, 660, 600);
	drawImage(`rebirth${sidebarMenu === "rebirth" ? "-open" : ""}`, 720, 600);

	switch (sidebarMenu) {
		case "shop":
			drawShop();
			break;
		case "rebirth":
			drawRebirthSidebar();
			break;
		case "welcome":
			drawImage("logo", 660, 180);
			drawImage("controls", 660, 240);
			break;
		case "anal":
			drawAnalysis();
			break;
	}

	drawRect(700, 97, 20, 20, "#000");
}

function handleSidebarClick(x, y, btn) {
	if (y === 10) {
		if (x === 0) sidebarMenu = "shop";
		else if (x === 1) sidebarMenu = "rebirth";
	} else if (sidebarMenu === "shop" && y >= 3 && y <= 9) {
		handleShopClick(x, y, btn);
	} else if (sidebarMenu === "rebirth") {
		handleRebirthClick(x, y);
	} else if (sidebarMenu === "anal" && y === 9) {
		if (x === 0) analPage--;
		if (x === 2) analPage++;
		analPage = Math.max(0, Math.min(analPage, Math.floor(openAnalysis.data.path.length / 15)));
	}
}

function drawSidebarArrows(y = 540) {
	drawImage("arrow-left", 660, y);
	drawImage("arrow-right", 780, y);
}

function drawPagination(page, y = 590) {
	drawText(page, 750, y, {
		max: 60,
		align: "center",
		color: "#fff",
		font: "50px monospace",
	});
}
