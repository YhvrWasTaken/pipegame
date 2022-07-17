const ALIGN = { LEFT: 1, RIGHT: 2, TOP: 3, BOTTOM: 4 };

class Interface {
	constructor(config) {
		// Lazy way out
		this.config = config;
		if ("top" in config) {
			config.y = config.top;
			config.verticalAlign = ALIGN.TOP;
		} else if ("bottom" in config) {
			config.y = config.bottom;
			config.verticalAlign = ALIGN.BOTTOM;
		}
		if ("left" in config) {
			config.x = config.left;
			config.horizontalAlign = ALIGN.LEFT;
		} else if ("right" in config) {
			config.x = config.right;
			config.horizontalAlign = ALIGN.RIGHT;
		}
	}

	get horizontalAlign() {
		return this.config.horizontalAlign || ALIGN.LEFT;
	}

	set horizontalAlign(v) {
		this.config.horizontalAlign = v;
	}

	get verticalAlign() {
		return this.config.verticalAlign || ALIGN.TOP;
	}

	set verticalAlign(v) {
		this.config.verticalAlign = v;
	}

	get width() {
		return this.config.width <= 0 ? Interface.width + this.config.width : this.config.width;
	}

	set width(v) {
		this.config.width = v;
	}

	get height() {
		return this.config.height <= 0 ? Interface.height + this.config.height : this.config.height;
	}

	set height(v) {
		this.config.height = v;
	}

	get x() {
		return this.config.x;
	}

	set x(v) {
		this.config.x = v;
	}

	get y() {
		return this.config.y;
	}

	set y(v) {
		this.config.y = v;
	}

	get top() {
		return this.verticalAlign === ALIGN.TOP ? this.y : Interface.height - this.y - this.height;
	}

	set top(v) {
		this.y = v;
		this.verticalAlign = ALIGN.TOP;
	}

	get bottom() {
		return this.verticalAlign === ALIGN.BOTTOM ? this.y : Interface.height - this.y - this.height;
	}

	set bottom(v) {
		this.y = v;
		this.verticalAlign = ALIGN.BOTTOM;
	}

	get left() {
		return this.horizontalAlign === ALIGN.LEFT ? this.x : Interface.width - this.x - this.width;
	}

	set left(v) {
		this.x = v;
		this.horizontalAlign = ALIGN.LEFT;
	}

	get right() {
		return this.horizontalAlign === ALIGN.RIGHT ? this.x : Interface.width - this.x - this.width;
	}

	set right(v) {
		this.x = v;
		this.horizontalAlign = ALIGN.RIGHT;
	}

	get isVisible() {
		return this.config.isVisible ?? true;
	}

	set isVisible(v) {
		this.config.isVisible = v;
	}

	get cursorX() {
		return cellX - this.left;
	}

	get cursorY() {
		return cellY - this.top;
	}

	relativeX(x) {
		return x - this.left;
	}
	
	relativeY(y) {
		return y - this.top;
	}

	cellPositionAtX(x) {
		return x + this.left;
	}

	cellPositionAtY(y) {
		return y + this.top;
	}

	canvasPositionAtX(x) {
		return this.cellPositionAtX(x) * 60;
	}

	canvasPositionAtY(y) {
		return this.cellPositionAtY(y) * 60;
	}

	hasCursor(x = cellX, y = cellY) {
		return (x >= this.left && x < this.left + this.width) &&
			(y >= this.top && y < this.top + this.height) && this.isVisible;
	}

	onClick(relX, relY, e) {
		if (!this.config.onClick) return;
		this.config.onClick.bind(this)(relX, relY, e);
	}

	onMousemove(relX, relY, e) {
		if (!this.config.onMousemove) return;
		this.config.onMousemove.bind(this)(relX, relY, e);
	}

	onMousedown(relX, relY, e) {
		if (!this.config.onMousedown) return;
		this.config.onMousedown.bind(this)(relX, relY, e);
	}

	onMouseup(relX, relY, e) {
		if (!this.config.onMouseup) return;
		this.config.onMouseup.bind(this)(relX, relY, e);
	}

	draw() {
		if (!this.isVisible) return;
		ctx.setTransform(1, 0, 0, 1, this.left * 60, this.top * 60);
		this.config.draw.bind(this)();
		ctx.resetTransform();
	}

	background(c) {
		drawRect(0, 0, this.width * 60, this.height * 60, c);
	}

	subcomponent(config) {
		return new Subcomponent(this, config);
	}

	static layers = []

	static add(config) {
		const zIndex = config.zIndex || 0;
		if (!this.layers[zIndex]) this.layers[zIndex] = [];
		const newInterface = new Interface(config);
		this.layers[zIndex].push(newInterface);
		return newInterface;
	}

	static get width() {
		return canvas.width / 60;
	}

	static get height() {
		return canvas.height / 60;
	}

	static byId(id) {
		return this.layers.flat().find(x => x.config.id === id);
	}

	static byClass(clAss) {
		return this.layers.flat().filter(x => x.config.class === clAss);
	}

	static drawAll() {
		for (const layer of this.layers.filter(x => x)) for (const item of layer) item.draw();
		ctx.resetTransform();
	}

	static dispatchCursorEvent(eventName, event) {
		let layers = [...this.layers].filter(x => x);
		layers.reverse();
		for (const layer of layers) {
			const reverseLayer = [...layer].reverse();
			for (const item of reverseLayer) {
				if (item.hasCursor()) {
					const relX = event.offsetX / 60 - item.left, relY = event.offsetY / 60 - item.top;
					item[`on${capitalize(eventName)}`](relX, relY, event);
					return;
				}
			}
		}
	}
}

class Subcomponent {
	constructor(parent, config) {
		this.parent = parent;
		this.config = config;
		this.config.width = this.config.width ?? 1;
		this.config.height = this.config.height ?? 1;
		if ("top" in config) {
			config.y = config.top;
			config.verticalAlign = ALIGN.TOP;
		} else if ("bottom" in config) {
			config.y = config.bottom;
			config.verticalAlign = ALIGN.BOTTOM;
		}
		if ("left" in config) {
			config.x = config.left;
			config.horizontalAlign = ALIGN.LEFT;
		} else if ("right" in config) {
			config.x = config.right;
			config.horizontalAlign = ALIGN.RIGHT;
		}
	}

	get horizontalAlign() {
		return this.config.horizontalAlign || ALIGN.LEFT;
	}

	set horizontalAlign(v) {
		this.config.horizontalAlign = v;
	}

	get verticalAlign() {
		return this.config.verticalAlign || ALIGN.TOP;
	}

	set verticalAlign(v) {
		this.config.verticalAlign = v;
	}

	get width() {
		return this.config.width <= 0 ? this.parent.width - this.config.width : this.config.width;
	}

	set width(v) {
		this.config.width = v;
	}

	get height() {
		return this.config.height <= 0 ? this.parent.height - this.config.height : this.config.height;
	}

	set height(v) {
		this.config.height = v;
	}

	get x() {
		return this.config.x;
	}

	set x(v) {
		this.config.x = v;
	}

	get y() {
		return this.config.y;
	}

	set y(v) {
		this.config.y = v;
	}

	get top() {
		return this.verticalAlign === ALIGN.TOP ? this.y : this.parent.height - this.y - this.height;
	}

	set top(v) {
		this.y = v;
		this.verticalAlign = ALIGN.TOP;
	}

	get bottom() {
		return this.verticalAlign === ALIGN.BOTTOM ? this.y : this.parent.height - this.y - this.height;
	}

	set bottom(v) {
		this.y = v;
		this.verticalAlign = ALIGN.BOTTOM;
	}

	get left() {
		return this.horizontalAlign === ALIGN.LEFT ? this.x : this.parent.width - this.x - this.width;
	}

	set left(v) {
		this.x = v;
		this.horizontalAlign = ALIGN.LEFT;
	}

	get right() {
		return this.horizontalAlign === ALIGN.RIGHT ? this.x : this.parent.width - this.x - this.width;
	}

	set right(v) {
		this.x = v;
		this.horizontalAlign = ALIGN.RIGHT;
	}

	hasCursor(x, y) {
		return (x >= this.left && x < this.left + this.width) &&
			(y >= this.top && y < this.top + this.height);
	}
}