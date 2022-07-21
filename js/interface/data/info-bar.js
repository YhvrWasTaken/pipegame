const InfoBar = Interface.add({
	left: 0,
	top: 1,
	width: 1,
	height: 1,
	zIndex: 1,
	draw() {
		const textProps = {
			font: "20px monospace",
			color: "white"
		};
		drawText(`Fast time: ${format(player.fastTime)}s`, 5, 25, textProps);
		drawText(`FPS: ${Math.round(fps)}`, 5, 45, textProps);
	},
	hasCursorEvents: false
});