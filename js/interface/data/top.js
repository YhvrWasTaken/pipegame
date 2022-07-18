// TODO Merge these all into one Interface element?
const TopBar = Interface.add({
	top: 0,
	left: 0,
	width: 0,
	height: 1,
	zIndex: 1,
	draw() {
		this.background(player.options.dark ? "#222" : "#888");
		this.discord.draw();
		this.guilded.draw();
		this.source.draw();
		this.pause.draw();
		this.settings.draw();
	},
	onMousedown(x, y) {
		this.discord.tryCursorEvent("mousedown", x, y);
		this.guilded.tryCursorEvent("mousedown", x, y);
		this.source.tryCursorEvent("mousedown", x, y);
		this.pause.tryCursorEvent("mousedown", x, y);
		this.settings.tryCursorEvent("mousedown", x, y);
	}
});

TopBar.discord = TopBar.subcomponent({
	top: 0,
	right: 5,
	width: 1,
	height: 1,
	draw() {
		drawImage("discord-icon", 0, 0, 0, this.hasCursor() && !SettingsTab.isVisible ? 1.1 : 0.9);
	},
	onMousedown() {
		window.open("https://yhvr.me/ego", "_blank");
	},
});

TopBar.guilded = TopBar.subcomponent({
	top: 0,
	right: 4,
	width: 1,
	height: 1,
	draw() {
		drawImage("guilded-icon", 0, 0, 0, this.hasCursor() && !SettingsTab.isVisible ? 1.1 : 0.9);
	},
	onMousedown() {
		window.open("https://guilded.gg/yhvr", "_blank");
	},
});

TopBar.source = TopBar.subcomponent({
	top: 0,
	right: 3,
	width: 1,
	height: 1,
	draw() {
		drawImage("gitlab-icon", 0, 0, 0, this.hasCursor() && !SettingsTab.isVisible ? 1.1 : 0.9);
	},
	onMousedown() {
		window.open("https://gitlab.com/yhvr/pipegame", "_blank");
	},
});


TopBar.pause = TopBar.subcomponent({
	top: 0,
	right: 1,
	width: 1,
	height: 1,
	draw() {
		drawImage(paused ? "continue" : "pause", 0, 0, 0, this.hasCursor() && !SettingsTab.isVisible ? 1.1 : 0.9);
	},
	onMousedown() {
		paused = !paused;
	},
});

TopBar.settings = TopBar.subcomponent({
	top: 0,
	right: 0,
	width: 1,
	height: 1,
	draw() {
		drawImage("settings", 0, 0, 0, this.hasCursor() && !SettingsTab.isVisible ? 1.1 : 0.9);
	},
	onMousedown() {
		SettingsTab.isVisible = true;
	},
});

