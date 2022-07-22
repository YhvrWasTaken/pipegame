// You know how this is supposed to be a polyfill?
// Well, it turns out in some cases the polyfilled version works and the non-polyfilled one doesn't
// Whoops
window.structuredClone = function(object) {
	if (typeof object !== "object" || object instanceof Decimal) return object;
	let fillObject;
	if (object.constructor === Array) fillObject = [];
	else fillObject = {};
	for (const prop of Object.keys(object)) {
		fillObject[prop] = structuredClone(object[prop]);
	}
	return fillObject;
}
