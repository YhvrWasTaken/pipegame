const Paginator = {
	width: 3,
	height: 1,
	draw() {
		const page = this.config.page;
		if (page > 0) drawImage("arrow-left", 0, 0);
		if (page <= this.config.maxPage() - 1) drawImage("arrow-right", 120, 0);
		drawText(page + 1, 90, 50, {
			max: 60,
			align: "center",
			color: "#fff",
			font: "50px monospace",
		});
	},
	onMousedown(x, _, e) {
		if (floor(x) === 1) return;
		const isRight = floor(x) >= 2;
		const maxPage = this.config.maxPage();
		if (e.button === 2) {
			if (isRight) this.config.page = maxPage;
			else this.config.page = 0;
			return;
		}
		const mag = e.button === 1 ? 5 : 1;
		if (isRight) {
			this.config.page = Math.min(maxPage, this.config.page + mag);
		} else {
			this.config.page = Math.max(0, this.config.page - mag);
		}
	}
}