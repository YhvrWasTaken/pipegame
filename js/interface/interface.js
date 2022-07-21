const ALIGN = { LEFT: 1, RIGHT: 2, TOP: 3, BOTTOM: 4, CENTRE: 5 };

class ComponentBasic {
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
		if (config.horizontalAlign === ALIGN.CENTRE) {
			config.x = "left" in config ? -config.left : config.right;
		} else {
			if ("left" in config) {
				config.x = config.left;
				config.horizontalAlign = ALIGN.LEFT;
			} else if ("right" in config) {
				config.x = config.right;
				config.horizontalAlign = ALIGN.RIGHT;
			}
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
		return this.config.width <= 0 ? this.parentWidth + this.config.width : this.config.width;
	}

	set width(v) {
		this.config.width = v;
	}

	get height() {
		return this.config.height <= 0 ? this.parentHeight + this.config.height : this.config.height;
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
		return this.verticalAlign === ALIGN.TOP ? this.y : this.parentHeight - this.y - this.height;
	}

	set top(v) {
		this.y = v;
		this.verticalAlign = ALIGN.TOP;
	}

	get bottom() {
		return this.verticalAlign === ALIGN.BOTTOM ? this.y : this.parentHeight - this.y - this.height;
	}

	set bottom(v) {
		this.y = v;
		this.verticalAlign = ALIGN.BOTTOM;
	}

	get left() {
		if (this.horizontalAlign === ALIGN.CENTRE)
			return this.x > 0 ? ceil(this.parentWidth / 2 - 1) + this.x
				: floor(this.parentWidth / 2 + 1) + this.x - this.width;
		return this.horizontalAlign === ALIGN.LEFT ? this.x : this.parentWidth - this.x - this.width;
	}

	set left(v) {
		if (this.horizontalAlign === ALIGN.CENTRE) {
			this.x = -v;
			return;
		}
		this.x = v;
		this.horizontalAlign = ALIGN.LEFT;
	}

	get right() {
		if (this.horizontalAlign === ALIGN.CENTRE) this.parentWidth - this.left - this.width;
		return this.horizontalAlign === ALIGN.RIGHT ? this.x : this.parentWidth - this.x - this.width;
	}

	set right(v) {
		this.x = v;
		if (this.horizontalAlign === ALIGN.CENTRE) return;
		this.horizontalAlign = ALIGN.RIGHT;
	}
}
class Interface extends ComponentBasic {
	get parentWidth() {
		return Interface.width;
	}
	
	get parentHeight() {
		return Interface.height;
	}

	get isVisible() {
		return this.config.isVisible ?? true;
	}

	set isVisible(v) {
		this.config.isVisible = v;
	}

	get hasCursorEvents() {
		return this.config.hasCursorEvents ?? true;
	}

	set hasCursorEvents(v) {
		this.config.hasCursorEvents = v;
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
		if (!cursorVisible) return false;
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
		ctx.setTransform(blockWidth / 60, 0, 0, blockWidth / 60, this.left * blockWidth, this.top * blockWidth);
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

	static hoveredElement = null

	static add(config) {
		const zIndex = config.zIndex || 0;
		if (!this.layers[zIndex]) this.layers[zIndex] = [];
		const newInterface = new Interface(config);
		this.layers[zIndex].push(newInterface);
		return newInterface;
	}

	static get width() {
		return canvas.width / blockWidth;
	}

	static get height() {
		return canvas.height / blockWidth;
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
		const isMousemove = eventName === "mousemove";
		let layers = [...this.layers].filter(x => x);
		layers.reverse();
		for (const layer of layers) {
			const reverseLayer = [...layer].reverse();
			for (const item of reverseLayer) {
				if (item.hasCursorEvents && item.hasCursor()) {
					// I am very sorry for this code but at least it works on mobile decently-ish
					const clientX = event.offsetX ?? event.touches[0].clientX,
						clientY = event.offsetY ?? event.touches[0].clientY;
					const relX = clientX / blockWidth - item.left, relY = clientY / blockWidth - item.top;
					if (isMousemove) {
						if (item !== this.hoveredElement) {
							this.hoveredElement?.onMouseleave?.();
							this.hoveredElement = item;
							item.onMouseenter?.();
						}
					}
					item[`on${capitalize(eventName)}`](relX, relY, event);
					return;
				}
			}
		}
	}

	static dispatchMouseLeave() {
		this.hoveredElement?.onMouseup?.();
	}
}

class Subcomponent extends ComponentBasic {
	constructor(parent, config) {
		super(config);
		this.parent = parent;
		this.width = this.config.width ?? 1;
		this.height = this.config.height ?? 1;
	}

	get parentWidth() {
		return this.parent.width;
	}

	get parentHeight() {
		return this.parent.height;
	}

	get isVisible() {
		return this.config.isVisible ?? true;
	}

	set isVisible(v) {
		this.config.isVisible = v;
	}

	relativeX(x) {
		return this.parent.relativeX(x) - this.left;
	}

	relativeY(y) {
		return this.parent.relativeY(y) - this.top;
	}

	hasCursor(x, y) {
		if (!cursorVisible) return false;
		if (x === undefined && y === undefined) {
			return (cellX >= this.left + this.parent.left && cellX < this.left + this.parent.left + this.width) &&
				(cellY >= this.top + this.parent.top && cellY < this.top + this.parent.top + this.height);
		}
		return (x >= this.left && x < this.left + this.width) &&
			(y >= this.top && y < this.top + this.height);
	}

	draw() {
		if (!this.isVisible) return;
		ctx.translate(this.left * 60, this.top * 60);
		this.config.draw.bind(this)();
		ctx.translate(-this.left * 60, -this.top * 60);
	}
	
	background(c) {
		drawRect(0, 0, this.width * 60, this.height * 60, c);
	}

	tryCursorEvent(type, x, y, e) {
		if (this.isVisible && this.hasCursor(x, y)) {
			this.config[`on${capitalize(type)}`].bind(this)(x - this.left, y - this.top, e);
		}
	}
}