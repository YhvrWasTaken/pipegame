// TODO Merge these all into one Interface element?

const DiscordIcon = Interface.add({
	top: 0,
	left: 0,
	width: 1,
	height: 1,
	zIndex: 2,
	draw() {
		drawImage("discord-icon", 0, 0);
	},
	onMousedown() {
		window.open("https://yhvr.me/ego", "_blank");
	},
});

const GuildedIcon = Interface.add({
	top: 0,
	left: 1,
	width: 1,
	height: 1,
	zIndex: 2,
	draw() {
		drawImage("guilded-icon", 0, 0);
	},
	onMousedown() {
		window.open("https://guilded.gg/yhvr", "_blank");
	},
});

const SourceIcon = Interface.add({
	top: 0,
	left: 2,
	width: 1,
	height: 1,
	zIndex: 2,
	draw() {
		drawImage("gitlab-icon", 0, 0);
	},
	onMousedown() {
		window.open("https://gitlab.com/yhvr/pipegame", "_blank");
	},
});


const PauseButton = Interface.add({
	top: 0,
	left: 4,
	width: 1,
	height: 1,
	zIndex: 2,
	draw() {
		drawImage("pause", 0, 0);
	},
	onMousedown() {
		paused = !paused;
	},
});

const SettingsButton = Interface.add({
	top: 0,
	left: 5,
	width: 1,
	height: 1,
	zIndex: 2,
	draw() {
		drawImage("settings", 0, 0);
	},
	onMousedown() {
		sidebarMenu = "settings";
	},
});

