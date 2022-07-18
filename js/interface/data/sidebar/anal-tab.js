const AnalTab = Interface.add({
	right: 0,
	bottom: 2,
	width: 3,
	height: 7,
	zIndex: 2,
	draw() {
		const type = openAnalysis.data.t;
		if (type === "tri") {
			drawTriangleChunk(20, 20, `rgb(${openAnalysis.color.join(", ")})`);
		} else {
			if (openAnalysis.data.sv === "1000000000000")
				drawImage("nubert", 0, 0, 0, 0.75);
			else
				drawRect(20, 20, 20, 20, `rgb(${openAnalysis.color.join(", ")})`);
			drawImage("money", 30, 0, 0, 0.5);
		}

		
		if (type === "tri" && openAnalysis.data.stacks > 1) {
			drawText(format(openAnalysis.value), 55, 30, {
				color: "#ffffff",
				font: "20px monospace",
			});
			drawText(`Approx. of ${openAnalysis.data.stacks} ▲`, 55, 45, {
				color: "#ffffff",
				font: "12px monospace",
			});
		} else {
			drawText(format(openAnalysis.value), type === "tri" ? 60 : 75, 38, {
				color: type === "tri" ? "#ffffff" : "#88ff88",
				font: "25px monospace",
			});
		}
		let place = [0, 0];
		for (let i = analPage * 15; i < 15 + analPage * 15; i++) {
			if (place[0] === 3) {
				place[0] = 0;
				place[1]++;
			}
			let upg = openAnalysis.data.path[i];
			if (upg) {
				if (upg === "gone") {
					drawText("DEL", place[0] * 60 + 30, place[1] * 60 + 100, {
						color: "#800",
						align: "center",
						font: "30px monospace"
					});
				} else {
					drawBlock(upg[0], place[0] * 60, place[1] * 60 + 60);
					if (!upg[1]) {
						drawRect(
							place[0] * 60,
							place[1] * 60 + 60,
							60,
							60,
							"#ff000088"
						);
					}
				}
			}

			place[0]++;
		}
	},
	get isVisible() {
		return sidebarMenu === "anal";
	}
});


const AnalTabPaginator = Interface.add(extend(Paginator, {
	right: 0,
	bottom: 1,
	zIndex: 2,
	page() {
		return analPage;
	},
	changePage(x) {
		analPage += x;
	},
	maxPage() {
		return floor(openAnalysis.data.path.length / 15);
	},
	get isVisible() {
		return sidebarMenu === "anal";
	}
}));