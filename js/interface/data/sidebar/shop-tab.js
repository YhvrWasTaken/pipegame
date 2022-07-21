const SidebarShopTab = Interface.add({
	right: 0,
	bottom: 3,
	width: 3,
	get height() {
		return Math.min(Math.max(Interface.height - 8, 4), 7);
	},
	zIndex: 2,
	draw() {
		this.inv.draw();
		this.upg.draw();
	},
	onMousedown(x, y) {
		this.inv.tryCursorEvent("mousedown", x, y);
		this.upg.tryCursorEvent("mousedown", x, y);
	},
	get isVisible() {
		return sidebarMenu === "shop";
	}
});

const ShopTabButtons = Interface.add({
	right: 0,
	bottom: 1,
	width: 3,
	height: 1,
	zIndex: 2,
	draw() {
		for (const tab in this.tabs) {
			drawImage(`${tab}${shopSubMenu === tab ? "-open" : ""}`, this.tabs[tab].left * 60, this.tabs[tab].top * 60);
		}
	},
	onMousedown(x, y) {
		for (const tab in this.tabs) {
			if (this.tabs[tab].hasCursor(x, y)) shopSubMenu = tab;
		}
	},
	get isVisible() {
		return sidebarMenu === "shop";
	}
});
ShopTabButtons.tabs = {
	inv: ShopTabButtons.subcomponent({
		top: 0, left: 0
	}),
	upg: ShopTabButtons.subcomponent({
		top: 0, left: 1
	})
};

SidebarShopTab.upg = SidebarShopTab.subcomponent({
	left: 0,
	bottom: 0,
	width: 0,
	height: 4,
	draw() {
		drawImage("max-gensup", 0, 0);
		drawImage("money", 40, 0, 0, 0.5);
		drawText(format(player.maxGensCost), 82, 35, {
			color: "#88ff88",
			font: "20px monospace"
		});
	},
	onMousedown(_, y) {
		switch(floor(y)) {
			case 0:
				if (player.money.gte(player.maxGensCost)) {
					player.money = player.money.sub(player.maxGensCost);
					player.maxGens++;
					player.maxGensCost = D(genCapCosts[player.maxGens + 1]);
					// moneyParticles(this.canvasPositionAtX(x), this.canvasPositionAtY(y), 25);
				}
				break;
		}
	},
	get isVisible() {
		return shopSubMenu === "upg";
	}
});

SidebarShopTab.inv = SidebarShopTab.subcomponent({
	top: 0,
	left: 0,
	width: 0,
	height: 0,
	draw() {
		if (shopItems[sidebarShopPage * this.height] === undefined)
			sidebarShopPage = Math.ceil(shopItems.length / this.height);
		const items = shopItems.slice(sidebarShopPage * this.height, (sidebarShopPage + 1) * this.height);

		items.forEach((item, i) => {
			drawBlock(item[0], 0, i * 60, 0, 0.75);
			if (item[0] !== "nothing") {
				drawImage("money", 40, i * 60, 0, 0.5);
				if (item[1] !== Infinity)
					drawText(format(item[1]), 85, i * 60 + 37.5, {
						color: "#88ff88",
						font: "25px monospace",
					});
			}
		});

		if (!hasMenuVisible() && this.hasCursor()) {
			if (!items[this.relativeY(cellY)]) return;
			let text = shopTooltips[items[this.relativeY(cellY)][0]];
			if (text === undefined) text = "[No tooltip provided]";
			ctx.font = "15px sans-serif";
			let lines = calcWrapText(text, 220);
			drawTooltip(
				text,
				-10,
				this.relativeY(visCellY) * 60 + 35 - lines * 6,
				"right",
				220,
				lines
			);
		}
	},
	onMousedown(_, y) {
		analyzing = false;
		if (shopItems[sidebarShopPage * this.height] === undefined)
			sidebarShopPage = Math.ceil(shopItems.length / this.height);
		const item = shopItems[sidebarShopPage * this.height + floor(y)];
		if (item === undefined) return;
		if (player.money.gte(item[1]) && placing.is("nothing")) {
			// . player.money = player.money.sub(item[1]);
			consumeOnPlace = true;
			placing = Block(item[0]);
			// . moneyParticles(x, y, item[0].includes("bert") ? 50 : 10);
		}
	},
	get isVisible() {
		return shopSubMenu === "inv";
	}
});

const SidebarShopInvPaginator = Interface.add(extend(Paginator, {
	right: 0,
	bottom: 2,
	zIndex: 2,
	get page() {
		return Math.min(sidebarShopPage, this.maxPage());
	},
	set page(x) {
		sidebarShopPage = x;
	},
	maxPage() {
		return Math.ceil(shopItems.length / SidebarShopTab.height) - 1;
	},
	get isVisible() {
		return sidebarMenu === "shop" && shopSubMenu === "inv";
	}
}));