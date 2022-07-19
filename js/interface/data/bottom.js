const BottomBar = Interface.add({
    left: 0,
    bottom: 0,
    width: -3,
    height: 1,
    zIndex: 1,
    draw() {
        this.background(player.options.dark ? "#223032" : "#889092");
        this.trash.draw();
        this.pause.draw();
        this.analyze.draw();
    },
    onMousedown(x, y) {
        this.trash.tryCursorEvent("mousedown", x, y);
        this.pause.tryCursorEvent("mousedown", x, y);
        this.analyze.tryCursorEvent("mousedown", x, y);
    }
});

BottomBar.trash = BottomBar.subcomponent({
    left: 0,
    top: 0,
    width: 3,
    draw() {
        this.background("#f006");
        drawImage("trashcan", 0, 0, 0, this.hasCursor() && !hasMenuVisible() && placing.isnt("nothing") ? 1.1 : 0.8);
    },
    onMousedown() {
        deleteBlock();
    }
});

BottomBar.pause = BottomBar.subcomponent({
	right: 2,
	top: 0,
	draw() {
		drawImage(paused ? "continue" : "pause", 0, 0, 0, this.hasCursor() && !hasMenuVisible() ? 1.1 : 0.9);
	},
	onMousedown() {
		paused = !paused;
	},
});

BottomBar.analyze = BottomBar.subcomponent({
    right: 1,
    top: 0,
    draw() {
        if (!analyzing) ctx.globalAlpha = 0.5;
        drawImage("analyze", 0, 0, 0, this.hasCursor() && !hasMenuVisible() ? 0.8 : 0.6)
        ctx.globalAlpha = 1;
    },
    onMousedown() {
        analyzing = !analyzing;
    }
});