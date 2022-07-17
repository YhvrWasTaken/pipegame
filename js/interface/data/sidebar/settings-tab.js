const SidebarSettingsTab = Interface.add({
	right: 0,
	top: 5,
	width: 3,
	height: 6,
	zIndex: 1,
	draw() {
		drawImage("logo", 0, 0);
		drawText("Dark Mode", 5, 95, {
			font: "20px monospace",
			color: "white",
		});
		drawImage(`toggle-${player.dark}`, 120, 60);
	},
	onMousedown(x, y) {
		x = floor(x);
		y = floor(y);
        if (y === 1) player.dark = !player.dark;
	},
	get isVisible() {
		return sidebarMenu === "settings";
	},
});
