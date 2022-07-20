const ControlsTab = Interface.add({
	left: 0,
	top: 0,
	width: 0,
	height: 0,
	zIndex: 3,
	draw() {
		const linearGradient = ctx.createLinearGradient(0, 0, 0, this.height * 60);
		linearGradient.addColorStop(0, player.options.dark ? "#222d" : "#888d");
		linearGradient.addColorStop(1, player.options.dark ? "#223032dd" : "#889092dd");
		this.background(linearGradient);
		drawImage("logo", Interface.width / 2 * 60 - 90, 0);
		drawImage("controls", Interface.width / 2 * 60 - images.controls.width / 2, 120, 0, 1);

		this.back.draw();
	},
	onMousedown(x, y) {
		x = floor(x);
		y = floor(y);
		this.back.tryCursorEvent("mousedown", x, y);
	},
	isVisible: false,
});

ControlsTab.back = ControlsTab.subcomponent({
	right: 0,
	top: 0,
	draw() {
		drawImage("arrow-right", 0, 0, 0, this.hasCursor() ? 1.1 : 0.9);
	},
	onMousedown() {
		ControlsTab.isVisible = false;
	}
});