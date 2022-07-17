function remove(array, item) {
	return array.splice(array.indexOf(item), 1);
}

Math.sum = function(array, func = (x => x)) {
	const isDecimal = func(array[0]) instanceof Decimal;
	return array.reduce((a, v) => isDecimal ? (a.add(func(v))) : (a + func(v)), isDecimal ? new Decimal(0) : 0);
}

Math.mean = function(array, func) {
	return array[0] instanceof Decimal ? Math.sum(array, func).div(array.length) : Math.sum(array, func) / array.length;
}

Math.clamp = function(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

Math.lerp = function(va, vb, alpha) {
	return vb * alpha + va * (1 - alpha);
}

Math.roundTo = function(v, to) {
	return Math.floor(v / to) * to;
}

function checkNaN(property) {
	if (typeof property !== "number" && !(property instanceof Decimal)) return false;
	if (typeof property === "number") return isNaN(property);
	return isNaN(property.mag) || isNaN(property.layer) || isNaN(property.sign);
}

function deepAssign(target, source) {
	for (const prop of Object.keys(source)) {
		if (typeof source[prop] === "object") deepAssign(target[prop], source[prop]);
		else target[prop] = source[prop];
	}
}

function capitalize(x) {
	return x[0].toUpperCase() + x.slice(1);
}

function extend(obj, extensions) {
	const newObj = structuredClone(obj);
	for (const prop in newObj) {
		if (!(prop in extensions)) extensions[prop] = newObj[prop];
	}
	return extensions;
}