"use strict";

// Data file for furnaces...
// Name is an inside joke ;)

function furnaceWithTriFuel(req, mult, def = 1) {
	return (chunk, block) => {
		if (chunk.data.t === "tri") {
			block.data += chunk.value.toNumber();
			return { block };
		}
		if (block.data >= req) {
			block.data -= req;
			return { mult, block };
		}
		return [def, false];
	};
}

const furnaceMults = {
	furnace: 1,
	furnace2: 2,
	furnace3: 4,
	furnace4: chunk => {
		if (chunk.data.path.length > 14) return [2, false];
		return 50;
	},
	furnace5: 8,
	furnace6: chunk => {
		if (chunk.data.upg[4] === 1) return 50;
		return [1, false];
	},
	furnace7: chunk => {
		if (chunk.data.upg[3] === 0) return 500;
		return [1, false];
	},
	furnace8: 64,

	furnacet1: furnaceWithTriFuel(5, 250),
	furnacet2: furnaceWithTriFuel(500, 1000, 100),
	furnacet3: (chunk, block) => {
		if (chunk.data.t === "tri") {
			block.data += chunk.value.toNumber();
			return { block };
		}
		if (
			block.data >= 1_000 &&
			chunk.data.upg[4] !== 1 &&
			chunk.data.upg[4] !== 2 &&
			chunk.data.upg[7] !== 1 &&
			chunk.data.upg[18] !== 1
		) {
			block.data -= 1_000;
			return { mult: 10_000, block };
		}
		return [250, false];
	},
	furnacet4: furnaceWithTriFuel(1.0e6, 50_000, 2_500),

	furnacer1: () => player.shards,
};
