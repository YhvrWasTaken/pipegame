"use strict";

// Helper function to generate upgrades that have a simple effect and
// a max amount of uses
function upgradeWithCap(id, maxUses, mult, func = "mul") {
	return (value, data) => {
		if (data.upg[id] < maxUses) {
			data.upg[id]++;
			return { value: value[func](mult), data };
		}
		return false;
	};
}

// Helper function to generate upgrades that have a simple effect amd
// a max amount of uses, that take triangles as fuel
function upgradeWithTriAndCap(id, maxUses, fuelReq, mult, func = "mul") {
	return (value, data, block, chunk) => {
		if (data.t === "tri") {
			block.data += value.toNumber();
			addParticle(
				"trianglefuel",
				1000,
				{
					x: chunk.x * 60 + (Math.random() * 10 - 5) - 30,
					y: chunk.y * 60 - 30,
					s: 0.25 + Math.random() / 4,
				},
				{ y: -60, a: -1 },
				{ y: 60 }
			);
			return { block, keep: false };
		}
		if (block.data >= fuelReq && data.upg[id] < maxUses) {
			if (data.upg[26] === 1) return false;
			block.data -= fuelReq;
			data.upg[id]++;
			if (id <= 24) data.upg[26] = 2;
			return { value: value[func](mult), data, block };
		}
		return false;
	};
}

const upgrades = {
	upgrade1: value => value.add(1),
	upgrade2: value => value.add(5),
	upgrade3: upgradeWithCap(0, 5, 1.3),
	upgrade4: value => {
		if (value < 1_000) return value.mul(2);
		return false;
	},
	upgrade5: upgradeWithCap(1, 1, 2),
	upgrade6: (value, data) => {
		if (data.upg[2] < 5) {
			data.upg[2]++;
			// The data.sv.eq is the gen8 effect
			// The data.upg[7] is upg16 effect
			return {
				value: value.mul(2),
				data,
				keep: Math.random() > 0.2 || data.sv.eq(500_000) || data.upg[7],
			};
		}
		return false;
	},
	upgrade7: upgradeWithCap(3, 7, 1.5),
	upgrade8: value => value.add(10_000),
	upgrade9: (value, data) => {
		if (data.upg[4] === 0) {
			data.upg[4] = 1;
			return { value: value.mul(5), data };
		}
		return false;
	},
	upgrade10: (value, data) => {
		if (data.upg[4] === 1) {
			data.upg[4] = 2;
			return { value: value.mul(3), data };
		}
		return false;
	},
	upgrade11: (value, data) => {
		if (data.path.length === 0) return value.mul(6);
		return false;
	},
	upgrade12: (value, data) => {
		if (data.upg[5] < 3 && data.speed === 1) {
			data.upg[5]++;
			return { value: value.mul(2.5), data };
		}
		return false;
	},
	upgrade13: (value, data) => {
		if (data.upg[0] < 5) {
			data.upg[0]++;
			return { value: value.mul(2), data };
		}
		return false;
	},
	upgrade14: value => {
		if (value < 2.5e7) return value.mul(1.1);
		return false;
	},
	upgrade15: upgradeWithCap(6, 3, 3),
	upgrade16: upgradeWithCap(7, 1, 2),
	upgrade17: value => value.add(1e8),
	upgrade18: (value, data) => {
		if (data.upg[7] === 1) data.upg[7] = 2;
		data.upg[18] = 2;

		// TODO maybe return `false` if [7] == 2 and [18] == 2 and used?
		if (data.upg[19] === 0) {
			data.upg[19]++;
			return { value: value.mul(2.5), data };
		}
		return value;
	},
	upgrade19: (value, data) => {
		if (data.upg[3] === 0) {
			data.upg[3] = 7;
			return { value: value.mul(64), data };
		}
		return false;
	},
	upgrade20: (value, data) => {
		if (data.upg[0] === 0) {
			data.upg[0] = 5;
			return { value: value.mul(100), data };
		}
		return false;
	},
	// The "1-10 usage" code is handled in js/upgrade.js
	upgrade21: upgradeWithCap(25, 1, 10_000),
	upgrade22: (value, data) => {
		if (data.upg[5] < 3 && data.speed === 5) {
			data.upg[5]++;
			return { value: value.mul(5), data };
		}
		return false;
	},
	upgrade23: (value, data) => {
		if (data.upg[28] < 2) {
			data.upg[28]++;
			data.upg[5] = 0;
			return { value: value.pow(0.92), data };
		}
		return false;
	},

	upgradet1: upgradeWithTriAndCap(8, 1, 1, 10),
	upgradet2: upgradeWithTriAndCap(9, 1, 1, 3),
	upgradet3: upgradeWithTriAndCap(10, 1, 2, 5),
	upgradet4: upgradeWithTriAndCap(11, 1, 4, 3.3),
	upgradet5: upgradeWithTriAndCap(13, 2, 20, 2),
	upgradet6: upgradeWithTriAndCap(17, 1, 500, 4),
	upgradet7: (value, data, block, chunk) => {
		// TODO is this optimal?
		let out = upgradeWithTriAndCap(21, 1, 1000, 1.5)(
			value,
			data,
			block,
			chunk
		);

		if (data.t === "square" && out !== false) out.data.upg[4] = 3;
		return out;
	},
	upgradet8: upgradeWithTriAndCap(24, 2, 500_000, 10),
	upgradet9: upgradeWithTriAndCap(26, 1, 1.0e7, 1.0e7),

	upgradett1: (value, data) =>
		upgradeWithCap(12, 2 + data.upg[16], 2)(value, data),
	upgradett2: upgradeWithCap(14, 1, 3),
	upgradett3: (value, data) => {
		if (data.path.length >= 4 && data.upg[15] === 0) {
			data.upg[15]++;
			return { value: value.mul(5), data };
		}
		return false;
	},
	upgradett4: upgradeWithCap(16, 1, 1.5),
	upgradett5: (value, data) => {
		if (data.upg[20] < 2) {
			data.upg[20]++;
			return {
				value: value.mul(3),
				data,
				keep: Math.random() > 0.2,
			};
		}
		return false;
	},
	upgradett6: (value, data) => value.add(250 * data.stacks),
	upgradett7: upgradeWithCap(27, 5, 1.4),

	upgrader1: (value, data) =>
		upgradeWithCap(22, 1, player.shards)(value, data),

	upgradert1: (value, data) =>
		upgradeWithCap(23, 1, player.shards)(value, data),

	/* eslint-disable-next-line */
	upgradec1: (_, _2, block) => {
		block.r += 180;
		block.r %= 360;
		return { block, upgraded: false };
	},
	/* eslint-disable-next-line */
	upgradec2: (value, data, block, chunk) => {
		let {
			to: [x, y],
		} = chunk;
		if (block.r === 90) y--;
		else if (block.r === 180) x++;
		else if (block.r === 270) y++;
		else x--;

		return {
			value: value.div(2),
			upgraded: false,
			extra: [
				chunk.x,
				chunk.y,
				value.div(2),
				structuredClone(chunk.color),
				[x, y],
				[Math.clamp(chunk.offset[0] + Math.random() / 25 - 0.02, -0.25, 0.25),
				Math.clamp(chunk.offset[1] + Math.random() / 25 - 0.02, -0.25, 0.25)],
				structuredClone(data),
			],
		};
	},
	/* eslint-disable-next-line */
	upgradec3: (_, _2, block) => {
		if (block.data === 1) block.r += 90;
		else block.r -= 90;

		block.data = !block.data - 0;

		if (block.r === -90) block.r = 270;

		block.r %= 360;
		return { block, upgraded: false };
	},
};

// Which types of chunks can go in which upgraders
// defaults to ["square"]
const upgradeTypes = {
	upgradet1: ["tri", "square"],
	upgradet2: ["tri", "square"],
	upgradet3: ["tri", "square"],
	upgradet4: ["tri", "square"],
	upgradet5: ["tri", "square"],
	upgradet6: ["tri", "square"],
	upgradet7: ["tri", "square"],
	upgradet8: ["tri", "square"],
	upgradet9: ["tri", "square"],
	upgradet10: ["tri", "square"],

	upgradett1: ["tri"],
	upgradett2: ["tri"],
	upgradett3: ["tri"],
	upgradett4: ["tri"],
	upgradett5: ["tri"],
	upgradett6: ["tri"],
	upgradett7: ["tri"],
	upgradett8: ["tri"],

	upgradert1: ["tri"],

	upgradec1: ["tri", "square"],
	upgradec2: ["tri"],
	upgradec3: ["tri", "square"],
};

const upgradeColors = {
	upgrade1: "#ff0000",
	upgrade2: "#ff8800",
	upgrade3: "#ffff00",
	upgrade4: "#88ff00",
	upgrade5: "#00ff00",
	upgrade6: "#00ff88",
	upgrade7: "#00ffff",
	upgrade8: "#0088ff",
	upgrade9: "#0000ff",
	upgrade10: "#8800ff",
	upgrade11: "#ff00ff",
	upgrade12: "#ff0088",
	upgrade13: "#ffffff",
	upgrade14: "#880000",
	upgrade15: "#884400",
	upgrade16: "#888800",
	upgrade17: "#448800",
	upgrade18: "#008800",
	upgrade19: "#008844",
	upgrade20: "#008888",
	upgrade21: "#883333",
	upgrade22: "#004488",
	upgrade23: "#000088",

	upgradet1: "#ff0000",
	upgradet2: "#ff8800",
	upgradet3: "#ffff00",
	upgradet4: "#88ff00",
	upgradet5: "#00ff00",
	upgradet6: "#00ff88",
	upgradet7: "#00ffff",
	upgradet8: "#0088ff",

	upgradett1: "#ff0000",
	upgradett2: "#ff8800",
	upgradett3: "#ffff00",
	upgradett4: "#88ff00",
	upgradett5: "#00ff00",
	upgradett6: "#00ff88",
	upgradett7: "#00ffff",
	upgradett8: "#0088ff",
};
