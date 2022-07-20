function hasMenuVisible() {
	return ControlsTab.isVisible || SettingsTab.isVisible;
}

const TopBar = Interface.add({
	top: 0,
	left: 0,
	width: 0,
	height: 1,
	zIndex: 2,
	draw() {
		this.background(player.options.dark ? "#222" : "#888");
		this.fullScreen.draw();
		this.discord.draw();
		this.guilded.draw();
		this.source.draw();
		this.controls.draw();
		this.settings.draw();
	},
	onMousedown(x, y) {
		this.fullScreen.tryCursorEvent("mousedown", x, y);
		this.discord.tryCursorEvent("mousedown", x, y);
		this.guilded.tryCursorEvent("mousedown", x, y);
		this.source.tryCursorEvent("mousedown", x, y);
		this.controls.tryCursorEvent("mousedown", x, y);
		this.settings.tryCursorEvent("mousedown", x, y);
	}
});

function isFullScreen() {
	return window.fullScreen || document.fullscreen || document.fullscreenElement;
}

TopBar.fullScreen = TopBar.subcomponent({
	top: 0,
	left: 0,
	draw() {
		drawImage(isFullScreen() ? "collapse" : "expand", 0, 0);
	},
	onMousedown() {
		isFullScreen() ? document.exitFullscreen() : document.documentElement.requestFullscreen();
	}
});

TopBar.discord = TopBar.subcomponent({
	top: 0,
	right: 5,
	draw() {
		drawImage("discord-icon", 0, 0, 0, this.hasCursor() && !hasMenuVisible() ? 1.1 : 0.9);
	},
	onMousedown() {
		window.open("https://yhvr.me/ego", "_blank");
	},
});

TopBar.guilded = TopBar.subcomponent({
	top: 0,
	right: 4,
	draw() {
		drawImage("guilded-icon", 0, 0, 0, this.hasCursor() && !hasMenuVisible() ? 1.1 : 0.9);
	},
	onMousedown() {
		window.open("https://guilded.gg/yhvr", "_blank");
	},
});

TopBar.source = TopBar.subcomponent({
	top: 0,
	right: 3,
	draw() {
		drawImage("sourcecode-icon", 0, 0, 0, this.hasCursor() && !hasMenuVisible() ? 1.1 : 0.9);
	},
	onMousedown() {
		window.open("https://gitlab.com/yhvr/pipegame", "_blank");
	},
});

TopBar.controls = TopBar.subcomponent({
	top: 0,
	right: 1,
	draw() {
		drawImage("ctrl", 0, 0, 0, this.hasCursor() && !hasMenuVisible() ? 1.1 : 0.9);
	},
	onMousedown() {
		ControlsTab.isVisible = true;
		if (placing.isnt("nothing")) {
			placing = Block("nothing");
			consumeOnPlace = false;
			consumeOnNextPlace = false;
		}
	},
});

TopBar.settings = TopBar.subcomponent({
	top: 0,
	right: 0,
	draw() {
		drawImage("settings", 0, 0, 0, this.hasCursor() && !hasMenuVisible() ? 1.1 : 0.9);
	},
	onMousedown() {
		SettingsTab.isVisible = true;
		if (placing.isnt("nothing")) {
			placing = Block("nothing");
			consumeOnPlace = false;
			consumeOnNextPlace = false;
		}
	},
});
