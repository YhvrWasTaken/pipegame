const SidebarShopTab = Interface.add({
	right: 0,
	bottom: 2,
	width: 3,
	height: 6,
	zIndex: 2,
	draw() {
		let items = [];
	
		drawImage("max-gensup", this.maxGensUpg.left, this.maxGensUpg.top);
		drawImage("money", this.maxGensUpg.left + 40, this.maxGensUpg.top, 0, 0.5);
		drawText(format(player.maxGensCost), this.maxGensUpg.left + 82, this.maxGensUpg.top + 36.5, {
			color: "#88ff88",
			font: "20px monospace"
		});
	
		if (shopItems[sidebarShopPage] === undefined)
			drawText("no", 90, 285, {
				align: "center",
				color: "white",
				font: "50px monospace",
			});
		else {
			items = shopItems[sidebarShopPage];
		}
	
		if (this.hasCursor() && this.relativeY(cellY) >= 2) {
			if (shopItems[sidebarShopPage] === undefined) return;
			let text = shopTooltips[shopItems[sidebarShopPage][this.relativeY(cellY) - 2][0]];
			if (text === undefined) text = "[No tooltip provided]";
			ctx.font = "12px sans-serif";
			let lines = calcWrapText(text);
			drawTooltip(
				text,
				-10,
				this.relativeY(visCellY) * 60 + 35 - lines * 6,
				"right",
				160,
				lines
			);
		}
	
		items.forEach((item, i) => {
			drawBlock(item[0], 0, i * 60 + 120, 0, 0.75);
			if (item[0] !== "nothing") {
				drawImage("money", 40, i * 60 + 120, 0, 0.5);
				if (item[1] !== Infinity)
					drawText(format(item[1]), 85, i * 60 + 157.5, {
						color: "#88ff88",
						font: "25px monospace",
					});
			}
		});
	},
	onMousedown(x, y) {
		if (y >= 2 && y < 6) {
			analyzing = false;
			const page = shopItems[sidebarShopPage];
			if (page === undefined) return;
			const item = page[floor(y) - 2];
			if (item === undefined) return;
			if (player.money.gte(item[1]) && placing.is("nothing")) {
				// . player.money = player.money.sub(item[1]);
				consumeOnPlace = true;
				placing = Block(item[0]);
				// . moneyParticles(x, y, item[0].includes("bert") ? 50 : 10);
			}
		} else if (this.maxGensUpg.hasCursor(x, y)) {
			if (player.money.gte(player.maxGensCost)) {
				player.money = player.money.sub(player.maxGensCost);
				player.maxGens++;
				player.maxGensCost = D(genCapCosts[player.maxGens + 1]);
				moneyParticles(this.canvasPositionAtX(x), this.canvasPositionAtY(y), 25);
			}
		}
	},
	get isVisible() {
		return sidebarMenu === "shop";
	}
});

SidebarShopTab.maxGensUpg = SidebarShopTab.subcomponent({
	top: 0, left: 0, width: 0
});

const SidebarShopPaginator = Interface.add(extend(Paginator, {
	right: 0,
	bottom: 1,
	zIndex: 2,
	page() {
		return sidebarShopPage;
	},
	changePage(x) {
		sidebarShopPage += x;
	},
	maxPage() {
		return shopItems.length - 1;
	},
	get isVisible() {
		return sidebarMenu === "shop";
	}
}));