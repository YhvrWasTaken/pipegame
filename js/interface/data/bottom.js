const BottomBar = Interface.add({
	left: 0,
	bottom: 0,
	width: -3,
	height: 1,
	zIndex: 1,
	draw() {
		this.background(player.options.dark ? "#223032" : "#889092");
		this.trash.draw();
		this.moveUpDown.draw();
		this.moveLeftRight.draw();
		this.pause.draw();
		this.analyze.draw();
	},
	onMousedown(x, y) {
		this.trash.tryCursorEvent("mousedown", x, y);
		this.moveUpDown.tryCursorEvent("mousedown", x, y);
		this.moveLeftRight.tryCursorEvent("mousedown", x, y);
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

BottomBar.moveUpDown = BottomBar.subcomponent({
    left: 3,
    top: 0,
    draw() {
        if (boardOffset[1] > 0) drawImage("caret", 0, 0);
        if (boardOffset[1] < maxBoardOffset[1]()) drawImage("caret", 0, 30, 180);
        if (!this.hasCursor() || hasMenuVisible()) return;
        if (this.relativeY(cellYSmall) < 0.5) {
            if (boardOffset[1] > 0) drawRect(0, 0, 60, 30, "#fff8");
        } else {
            if (boardOffset[1] < maxBoardOffset[1]()) drawRect(0, 30, 60, 30, "#fff8");
        }
    },
    onMousedown(_, y) {
        y < 0.5 ? offsetUp() : offsetDown();
    }
});
BottomBar.moveLeftRight = BottomBar.subcomponent({
    left: 4,
    top: 0,
    draw() {
        ctx.rotate(-Math.PI / 2);
        if (boardOffset[0] > 0) drawImage("caret", -60, 0);
        if (boardOffset[0] < maxBoardOffset[0]()) drawImage("caret", -60, 30, 180);
        ctx.rotate(Math.PI / 2);
        if (!this.hasCursor() || hasMenuVisible()) return;
        if (this.relativeX(cellXSmall) < 0.5) {
            if (boardOffset[0] > 0) drawRect(0, 0, 30, 60, "#fff8");
        } else {
            if (boardOffset[0] < maxBoardOffset[0]()) drawRect(30, 0, 30, 60, "#fff8");
        }
    },
    onMousedown(x) {
        x < 0.5 ? offsetLeft() : offsetRight();
    }
});

BottomBar.pause = BottomBar.subcomponent({
	right: 1,
	top: 0,
	draw() {
		drawImage(paused ? "continue" : "pause", 0, 0, 0, this.hasCursor() && !hasMenuVisible() ? 1.1 : 0.9);
	},
	onMousedown() {
		paused = !paused;
	},
});

BottomBar.analyze = BottomBar.subcomponent({
	right: 0,
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