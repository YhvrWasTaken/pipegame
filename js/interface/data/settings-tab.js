const SettingsTab = Interface.add({
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

		this.back.draw();
		for (const setting of Object.values(this.settings)) {
			setting.label.draw();
			setting.checkBox.draw();
		}
		for (const action of Object.values(this.actions)) action.draw();
	},
	onMousedown(x, y) {
		x = floor(x);
		y = floor(y);
		this.back.tryCursorEvent("mousedown", x, y);
		for (const setting of Object.values(this.settings)) setting.checkBox.tryCursorEvent("mousedown", x, y);
		for (const action of Object.values(this.actions)) action.tryCursorEvent("mousedown", x, y);
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
	let top = 2;
	function newSetting(option, text) {
		settings[option] = { label: SettingsTab.subcomponent(extend(SettingsLabelTemplate, { top, text })),
			checkBox: SettingsTab.subcomponent(extend(SettingsCheckboxTemplate, { top, option } )) }
		top++;
	}
	newSetting("dark", "Dark Mode:");
	newSetting("liveAnal", "Live Analysis Update:");
	newSetting("mobileControls", "Mobile Controls:")
	return settings;
})();

SettingsTab.actions = (function() {
	const SettingsActionTemplate = {
		width: 3,
		horizontalAlign: ALIGN.CENTRE,
		draw() {
			ctx.strokeStyle = "white";
			ctx.strokeWidth = 4;
			ctx.fillStyle = "#666";
			ctx.fillRect(10, 5, this.width * 60 - 20, this.height * 60 - 10);
			ctx.strokeRect(10, 5, this.width * 60 - 20, this.height * 60 - 10);
			drawText(this.config.text, this.width / 2 * 60, 35, {
				font: "17px monospace",
				color: "white",
				align: "center"
			});
		}
	};

	let settings = [];
	let top = Object.keys(SettingsTab.settings).length + 2;
	function newSetting(option1, option2) {
		if (option1) settings.push(SettingsTab.subcomponent(extend(SettingsActionTemplate, Object.assign(option1, {
			left: 1,
			top
		}))));
		if (option2) settings.push(SettingsTab.subcomponent(extend(SettingsActionTemplate, Object.assign(option2, {
			right: 1,
			top
		}))));
		top++;
	}
	newSetting({
		text: "Delete Save",
		onMousedown() {
			deleteSave();
		}
	}, {
		get text() {
			return paused ? "Unpause" : "Pause"
		},
		onMousedown() {
			paused = !paused;
		}
	});
	return settings;
})();