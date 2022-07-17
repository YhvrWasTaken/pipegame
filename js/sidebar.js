"use strict";

let sidebarMenu = "shop";
let sidebarShopPage = 0;

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
