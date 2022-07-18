const MobileControls = Interface.add({
    left: 0,
    bottom: 0,
    width: -3,
    height: 1,
    zIndex: 1,
    draw() {
        this.background(player.options.dark ? "#223032" : "#889092");
        this.trash.draw();
        this.rotateCw.draw();
        this.rotateCcw.draw();
        this.analyze.draw();
    },
    onMousedown(x, y) {
        this.trash.tryCursorEvent("mousedown", x, y);
        this.rotateCw.tryCursorEvent("mousedown", x, y);
        this.rotateCcw.tryCursorEvent("mousedown", x, y);
        this.analyze.tryCursorEvent("mousedown", x, y);
    }
});

MobileControls.trash = MobileControls.subcomponent({
    left: 0,
    top: 0,
    width: 2,
    draw() {
        this.background("#f006");
        drawImage("trashcan", 0, 0, 0, this.hasCursor() && !SettingsTab.isVisible && placing.isnt("nothing") ? 1.1 : 0.8);
    },
    onMousedown() {
        deleteBlock();
    }
});

MobileControls.rotateCw = MobileControls.subcomponent({
    left: 2,
    top: 0,
    draw() {
        drawImage("r-cw", 0, 0, 0, this.hasCursor() && !SettingsTab.isVisible && placing.isnt("nothing") ? 1.15 : 0.8);
    },
    onMousedown() {
        rotate();
    }
});

MobileControls.rotateCcw = MobileControls.subcomponent({
    left: 3,
    top: 0,
    draw() {
        drawImage("r-ccw", 0, 0, 0, this.hasCursor() && !SettingsTab.isVisible && placing.isnt("nothing") ? 1.15 : 0.8);
    },
    onMousedown() {
        rotate(true);
    }
});

MobileControls.analyze = MobileControls.subcomponent({
    left: 5,
    top: 0,
    draw() {
        if (!analyzing) ctx.globalAlpha = 0.5;
        drawImage("analyze", 0, 0, 0, this.hasCursor() && !SettingsTab.isVisible ? 0.8 : 0.6)
        ctx.globalAlpha = 1;
    },
    onMousedown() {
        analyzing = !analyzing;
    }
})