const SettingsTab = Interface.add({
	left: 0,
	top: 0,
	width: 0,
	height: 0,
	zIndex: 3,
	draw() {
		ctx.globalAlpha = 0.5;
		const linearGradient = ctx.createLinearGradient(0, 0, 0, this.height * 60);
		linearGradient.addColorStop(0, player.options.dark ? "#222c" : "#888c");
		linearGradient.addColorStop(1, player.options.dark ? "#223032cc" : "#889092cc");
		this.background(linearGradient);
		ctx.globalAlpha = 1;
		drawImage("logo", Interface.width / 2 * 60 - 90, 60);

		this.back.draw();
		for (const setting of Object.values(this.settings)) {
			setting.label.draw();
			setting.checkBox.draw();
		}
	},
	onMousedown(x, y) {
		x = floor(x);
		y = floor(y);
		this.back.tryCursorEvent("mousedown", x, y);
		for (const setting of Object.values(this.settings)) setting.checkBox.tryCursorEvent("mousedown", x, y);
	},
	isVisible: false,
});

SettingsTab.back = SettingsTab.subcomponent({
	right: 0,
	top: 0,
	draw() {
		drawImage("arrow-right", 0, 0, 0, this.hasCursor() ? 1.1 : 0.9);
	},
	onMousedown() {
		SettingsTab.isVisible = false;
	}
});

SettingsTab.settings = (function() {
	const SettingsLabelTemplate = {
		left: 1,
		width: 3,
		horizontalAlign: ALIGN.CENTRE,
		draw() {
			drawText(this.config.text, 5, 35, {
				font: "20px monospace",
				color: "white",
			});
		}
	};
	const SettingsCheckboxTemplate = {
		right: 1,
		width: 3,
		horizontalAlign: ALIGN.CENTRE,
		draw() {
			drawImage(`toggle-${player.options[this.config.option]}`, 120, 0);
		},
		onMousedown() {
			player.options[this.config.option] = !player.options[this.config.option];
		}
	};
	
	let settings = {};
	let top = 4;
	function newSetting(option, text) {
		settings[option] = { label: SettingsTab.subcomponent(extend(SettingsLabelTemplate, { top, text })),
			checkBox: SettingsTab.subcomponent(extend(SettingsCheckboxTemplate, {top, option} )) }
		top++;
	}
	newSetting("dark", "Dark Mode:");
	newSetting("liveAnal", "Live Analysis Update:");
	newSetting("mobileControls", "Mobile Controls:")
	return settings;
})();