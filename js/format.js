"use strict";

function format(n) {
	let num = D(n);
	if (num.eq(0)) return "0.000";
	let negative = false;
	if (num.lt(0)) negative = true;
	num = num.abs();
	let e = num.log10().floor();
	let m = num.div(D(10).pow(e));
	let fm = m.toFixed(Decimal.max(2 - e.log10().floor(), 0));
	if (fm.startsWith("10")) {
		fm = D(1).toFixed(Decimal.max(2 - e.log10().floor(), 0));
		e = e.add(1);
	}
	if (e.gte(6)) {
		return `${negative ? "-" : ""}${fm}e${e}`;
	}
	if (e.gte(3)) {
		return `${negative ? "-" : ""}${num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/gimu, ",")}`;
	}
	return `${negative ? "-" : ""}${num.toFixed(Math.min(3 - e.toNumber(), 1))}`;
}
