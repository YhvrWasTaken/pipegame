"use strict";

const Sidebar = Interface.add({
	bottom: 0,
	right: 0,
	width: 3,
	height: -1,
	zIndex: 1,
	draw() {
		const linearGradient = ctx.createLinearGradient(0, 0, 0, this.height * 60);
		linearGradient.addColorStop(0, player.options.dark ? "#222" : "#888");
		linearGradient.addColorStop(1, player.options.dark ? "#223032" : "#889092");
		this.background(linearGradient);
	}
});

const SidebarResources = {
	money: Interface.add({
		right: 0,
		top: 1,
		width: 3,
		height: 1,
		zIndex: 2,
		draw() {
			drawText(format(player.money), 60, 32.5, {
				max: 120,
				color: "#88ff88",
				font: "30px monospace",
			});
			drawText(`${format(lastMPS)}/s`, 60, 52.5, {
				max: 120,
				color: "inherit",
				font: "20px monospace",
			});
			drawImage("money", 0, 0);
			/*
			if (!this.hasCursor() || SettingsTab.isVisible) return;
			ctx.textAlign = "start";
			ctx.font = "12px sans-serif";
			const tt = "How much money you have.";
			let lines = calcWrapText(tt);
			drawTooltip(
				tt,
				-10,
				this.relativeY(visCellY) * 60 + 35 - lines * 6,
				"right",
				160,
				lines
			);*/
		},
		switchToTop() {
			SidebarResources.money.top = 0;
			SidebarResources.money.left = 0;
		},
		switchToSidebar() {
			SidebarResources.money.top = 1;
			SidebarResources.money.right = 0;
		}
	}),
	maxGensAndSquares: Interface.add({
		right: 0,
		top: 2,
		width: 3,
		height: 1,
		zIndex: 2,
		draw() {
			drawText(`${currentGens}/${player.maxGens}`, 40, 25, {
				max: 120,
				color: "#fff",
				font: "25px monospace",
			});
			drawText(`${currSquares}/${player.maxGens * 5}`, 40, 55, {
				color: "inherit",
				font: "inherit",
			});

			drawImage("max-gens", -10, -12, 0, 0.65);
			drawRect(10, 37, 20, 20, player.options.dark ? "#aaa" : "#000");
			/*
			if (!this.hasCursor() || SettingsTab.isVisible) return;
			ctx.textAlign = "start";
			ctx.font = "12px sans-serif";
			let tt;
			switch(this.relativeX(cellX)) {
				case 0:
					tt = "The current amount of genetors you have.";
					break;
				case 1:
					tt = "The maximum amount of generators you can have AND the current amount of chunks on screen.";
					break;
				case 2:
					tt = "The maximum amount of chunks you can have.";
			}
			let lines = calcWrapText(tt);
			drawTooltip(
				tt,
				-10,
				this.relativeY(visCellY) * 60 + 35 - lines * 6,
				"right",
				160,
				lines
			);*/
		},
		switchToTop() {
			SidebarResources.maxGensAndSquares.top = 0;
			SidebarResources.maxGensAndSquares.left = 3;
		},
		switchToSidebar() {
			SidebarResources.maxGensAndSquares.top = 2;
			SidebarResources.maxGensAndSquares.right = 0;
		}
	}),
	shards: Interface.add({
		right: 0,
		top: 3,
		width: 3,
		height: 1,
		zIndex: 2,
		draw() {
			if (player.shards.eq(0)) return;
			drawText(format(player.shards), 60, 40, {
				max: 120,
				color: "#bbbbff",
				font: "30px monospace",
			});
			drawImage("shards", 0, 0);
			/*
			if (!this.hasCursor() || SettingsTab.isVisible) return;
			const tt = "The number of Shards you have.";

			ctx.textAlign = "start";
			ctx.font = "12px sans-serif";
			let lines = calcWrapText(tt);
			drawTooltip(
				tt,
				-10,
				this.relativeY(visCellY) * 60 + 35 - lines * 6,
				"right",
				160,
				lines
			);*/
		},
		switchToTop() {
			SidebarResources.shards.top = 0;
			SidebarResources.shards.left = 5;
		},
		switchToSidebar() {
			SidebarResources.shards.top = 3;
			SidebarResources.shards.right = 0;
		}
	})
};

const SidebarTabButtons = Interface.add({
	right: 0,
	bottom: 0,
	width: 3,
	height: 1,
	zIndex: 2,
	draw() {
		drawImage(`shop${sidebarMenu === "shop" ? "-open" : ""}`, 0, 0);
		drawImage(`rebirth${sidebarMenu === "rebirth" ? "-open" : ""}`, 60, 0);
	},
	onMousedown(x) {
		if (floor(x) === 1) sidebarMenu = "rebirth";
		else sidebarMenu = "shop";
	}
});