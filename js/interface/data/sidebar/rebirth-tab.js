const RebirthTabButtons = Interface.add({
	right: 0,
	bottom: 1,
	width: 3,
	height: 1,
	zIndex: 2,
	draw() {
		for (const tab in this.tabs) {
			if (!this.tabs[tab].config.requirement()) continue;
			drawImage(`${tab}${rebirthSubMenu === tab ? "-open" : ""}`, this.tabs[tab].left * 60, this.tabs[tab].top * 60);
		}
	},
	onMousedown(x, y) {
		for (const tab in this.tabs) {
			if (!this.tabs[tab].config.requirement()) continue;
			if (this.tabs[tab].hasCursor(x, y)) rebirthSubMenu = tab;
		}
	},
	get isVisible() {
		return sidebarMenu === "rebirth";
	}
});
RebirthTabButtons.tabs = {
	info: RebirthTabButtons.subcomponent({
		top: 0, left: 0,
		requirement: () => true
	}),
	rebshop: RebirthTabButtons.subcomponent({
		top: 0, left: 1,
		requirement: () => player.rebirth >= 1
	}),
	decor: RebirthTabButtons.subcomponent({
		top: 0, left: 2,
		requirement: () => player.rebirth >= 1
	})
};

const RebirthTab = Interface.add({
	right: 0,
	bottom: 3,
	width: 3,
	height: 4,
	zIndex: 2,
	draw() {
		switch (rebirthSubMenu) {
			case "info":
				drawRebirthInfo();
				break;
			case "confirm":
				drawRebirthConfirmation();
				break;
			case "rebshop":
				drawRebirthShop();
				break;
			case "decor":
				drawRebirthDecor();
				break;
		}
	},
	onMousedown(x, y) {
		if (rebirthAnim) return;
		switch (rebirthSubMenu) {
			case "info":
				if (this.rebirth.request.hasCursor(x, y) && player.money.gte(rebirthCosts[player.rebirth]))
					rebirthSubMenu = "confirm";
				break;
			case "confirm":
				if (this.rebirth.confirm.hasCursor(x, y)) rebirthAnimation();
				else if (this.rebirth.deny.hasCursor(x, y)) rebirthSubMenu = "info";
				break;
			case "rebshop":
				if (this.shop.container.hasCursor(x, y)) {
					let item = rebirthShopItems[rebirthShopPage][Math.floor(y) - this.shop.container.top];
					if (player.money.gte(item[1]) && placing.is("nothing")) {
						player.money = player.money.sub(item[1]);
						placing = Block(item[0]);
						moneyParticles(this.canvasPositionAtX(x), this.canvasPositionAtY(y), 25, "shards");
					}
				}
				break;
			case "decor":
				if (this.decor.container.hasCursor(x, y)) {
					let item = decor[rebirthDecorPage][Math.floor(y) - this.decor.container.top][Math.floor(x)];
					if (placing.is("nothing")) {
						placing = Block(item);
						moneyParticles(this.canvasPositionAtX(x), this.canvasPositionAtY(y), 10, item);
					}
				}
				break;
		}
	},
	get isVisible() {
		return sidebarMenu === "rebirth";
	}
});

RebirthTab.rebirth = {
	request: RebirthTab.subcomponent({ top: 0, left: 0, width: 0 }),
	confirm: RebirthTab.subcomponent({ top: 3, left: 0 }),
	deny: RebirthTab.subcomponent({ top: 3, right: 0 })
};

RebirthTab.shop = {
	container: RebirthTab.subcomponent({ left: 0, bottom: 0, width: 3, height: 3 })
};

RebirthTab.decor = {
	container: RebirthTab.subcomponent({ left: 0, bottom: 0, width: 3, height: 3 })
};

const RebirthTabPaginator = Interface.add(extend(Paginator, {
	right: 0,
	bottom: 2,
	zIndex: 2,
	page() {
		return rebirthSubMenu === "rebshop" ? rebirthShopPage : rebirthDecorPage;
	},
	changePage(x) {
		if (rebirthSubMenu === "rebshop") rebirthShopPage += x;
		else rebirthDecorPage += x;
	},
	maxPage() {
		return player.rebirth - 1;
	},
	get isVisible() {
		return sidebarMenu === "rebirth" && (rebirthSubMenu === "rebshop" || rebirthSubMenu === "decor");
	}
}));

function drawRebirthDecor() {
	decor[rebirthDecorPage].forEach((row, y) => {
		row.forEach((item, x) => {
			drawImage(item, x * 60, 180 + y * 60);
		});
	});
}

function drawRebirthShop() {
	let items = rebirthShopItems[rebirthShopPage];
	items.forEach((item, i) => {
		drawBlock(item[0], 0, i * 60 + 180, 0, 0.75);
		if (item[1] !== Infinity)
			drawText(format(item[1]), 80, i * 60 + 217.5, {
				color: "#88ff88",
				font: "25px monospace",
			});
		if (item[0] !== "nothing")
			drawImage("money", 40, i * 60 + 180, 0, 0.5);
	});

	const shopTabY = RebirthTab.relativeY(cellY) - 2;
	if (RebirthTab.hasCursor() && shopTabY >= 0 && shopTabY <= 2) {
		if (rebirthShopItems[rebirthShopPage] === undefined || SettingsTab.isVisible) return;
		let text =
			shopTooltips[rebirthShopItems[rebirthShopPage][shopTabY][0]];
		if (text === undefined) return;
		ctx.font = "15px sans-serif";
		let lines = calcWrapText(text, 220);
		drawTooltip(
			text,
			-10,
			RebirthTab.relativeY(visCellY) * 60 + 35 - lines * 6,
			"right",
			220,
			lines
		);
	}
}

function drawRebirthConfirmation() {
	drawText("Are you sure?", 90, 100, {
		color: "#ffdddd",
		align: "center",
		font: "20px monospace",
	});
	drawImage("yes-button", 0, 120);
	drawImage("no-button", 120, 120);
}

function drawRebirthInfo() {
	drawImage(
		"rebirth-banner",
		0,
		0
	);
	drawText("Req:", 4, 80, {
		color: "white",
		align: "left",
		font: "25px monospace",
	});

	drawText(format(rebirthCosts[player.rebirth]), 175, 80, {
		color: "#88ff88",
		align: "right",
		font: "25px monospace",
	});
	drawText(player.rebirth === 0 ? "+10 Shards" : "x2 Shards", 90, 110, {
		color: "#88ffff",
		align: "center",
		font: "inherit",
	});
	const warningFont = {
		color: "#fcc",
		align: "center",
		font: "20px monospace",
	};
	drawText("Resets Factory", 90, 140, warningFont);
	drawText("Resets Money", 90, 165, warningFont);
	drawText("Removes Nubert", 90, 190, warningFont);
	drawText("3 New Blocks", 90, 215, {
		color: "#ccf",
		align: "center",
		font: "inherit",
	});
	drawText("9 Decor Items", 90, 240, {
		color: "#ccf",
		align: "center",
		font: "inherit",
	});
}