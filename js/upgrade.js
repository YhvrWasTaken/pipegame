"use strict";

// TODO overlap IDs for different chunk types?
// 0: upg3/13/20 cap
// 1: upg5 cap
// 2: upg6 cap
// 3: upg7 cap
// 4: upg9 status (burning)
//   0: not done
//   1: done
//   2: reversed
//   3: normalized
// 5: upg12 status
// 6: upg15 status
// 7: upg16 status (tough)
//   0: no
//   1: done
//   2: reversed
// 8: tupg1 status
// 9: tupg2 status
// 10: tupg3 status
// 11: tupg4 status
// 12: ttupg1 status
// 13: tupg5 status
// 14: ttupg2 status
// 15: ttupg3 status
// 16: ttupg4 status (adds to ttupg1)
// 17: tupg6 status
// 18: gen11 status (irradiated)
//   0: not done
//   1: dropped by gen11
//   2: clean
// 19: upg18 status
// 20: ttupg5 status
// 21: tupg7 status
// 22: rupg1 status
// 23: rtupg1 status
// 24: tupg8 status
// 25: upg21 status (locks 1-10)
//   0: not ran thru 1-10
//   1: locked
//   2: ran thru 1-10
// 26: tupg9 status (locks T1-8)
//   0: not ran thru t1-8
//   1: locked
//   2: ran thru t1-8
// 27: ttupg7 status
const defaultData = new Array(28).fill(0);

// This function is on the VERGE of being hated by ESLint
// ESLint hates it
// eslint-disable-next-line complexity
function upgradeChunk(chunk, block) {
	let { value, color, data } = chunk;

	if (data.upg[4] === 1) value = value.div(1.1);
	if (data.upg[18] === 1) value = value.sub(1.0e10);

	if (upgradeTints[block.id]) {
		let [r, g, b] = upgradeTints[block.id];
		color[0] = (color[0] + r * 0.25) / 1.25;
		color[1] = (color[1] + g * 0.25) / 1.25;
		color[2] = (color[2] + b * 0.25) / 1.25;
	}
	let useful = true;
	let keep = true;
	let upgraded = true;
	let extra = false;

	// "Easy" way to determine if its t1->10
	if (
		(block.id >= "upgrade1" && block.id <= "upgrade9" && block.id.length === 8) ||
		block.id === "upgrade10"
	) {
		if (data.upg[25] === 1) {
			useful = false;
			upgraded = false;
		} else data.upg[25] = 2;
	}

	if (upgrades[block.id] && canPassThru(block.id, chunk.data.t) && useful) {
		const output = upgrades[block.id](value, data, block, chunk);
		if (output instanceof Decimal) {
			value = output;
		} else if (typeof output === "object") {
			if (output.value !== undefined) value = output.value;
			if (output.data !== undefined) data = output.data;
			if (output.keep !== undefined) keep = output.keep;
			if (output.useful !== undefined) useful = output.useful;
			if (output.block !== undefined) block = output.block;
			if (output.upgraded !== undefined) upgraded = output.upgraded;
			if (output.extra !== undefined) extra = output.extra;
		} else if (typeof output === "boolean") {
			useful = output;
		}
	}

	if (upgraded) {
		data.path.unshift([block.id, useful]);
		// limit data.path to prevent memory leak from over-looping
		data.path.splice(150);
	}

	if (!useful) color = [255, 0, 0];

	chunk.value = value;
	chunk.color = color;
	chunk.data = data;

	return [chunk, keep, block, extra];
}

const RGB_HEX = /^#?(?:([\da-f]{3})[\da-f]?|([\da-f]{6})(?:[\da-f]{2})?)$/iu;

/* eslint-disable */
// God bless https://gist.github.com/comficker/871d378c535854c1c460f7867a191a5a?permalink_comment_id=2615849#gistcomment-2615849
const hex2RGB = str => {
	const [, short, long] = String(str).match(RGB_HEX) || [];

	if (long) {
		const value = Number.parseInt(long, 16);
		return [value >> 16, (value >> 8) & 0xff, value & 0xff];
	}
	if (short) {
		return Array.from(short, s => Number.parseInt(s, 16)).map(
			n => (n << 4) | n
		);
	}
};

// Parse upgradeColors so they can be used to just tint the chunk
const upgradeTints = {};

for (const key in upgradeColors) {
	upgradeTints[key] = hex2RGB(upgradeColors[key].substring(1));
}

function canPassThru(id, type) {
	return (upgradeTypes[id] ?? ["square"]).includes(type);
}
