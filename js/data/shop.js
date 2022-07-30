"use strict";

/* eslint-disable max-len */

const shopItems = [
	["gen1", 0],
	["furnace", 0],
	["conveyor", 2.5],
	["upgrade1", 10],
	["upgrade2", 100],
	["gen2", 250],
	["conveyor2", 1000],
	["upgrade3", 5_000],
	["furnace2", 10_000],
	["gen3", 25_000],
	["upgrade4", 100_000],
	["conveyor3", 1.0e6],
	["gen4", 1.0e6],
	["upgrade5", 2.5e6],
	["upgrade6", 5.0e6],
	["furnace3", 5.0e7],
	["gen5", 1.0e8],
	["upgrade7", 2.5e8],
	["furnace4", 5.0e9],
	["upgrade8", 1.0e10],
	["upgrade9", 2.0e10],
	["conveyor4", 5.0e10],
	["gen6", 1.0e11],
	["furnace5", 5.0e11],
	["upgrade10", 1.0e12],
	["upgrade11", 3.0e12],
	["gen7", 1.0e13],
	["upgrade12", 5.0e13],
	["furnace6", 3.3e14],
	["conveyor5", 1.0e15],
	["nubert", 1.0e15],
	["upgrade13", 1.0e15],
	["gen8", 1.0e16],
	["upgrade14", 2.5e16],
	["furnace7", 2.5e17],
	["upgrade15", 7.5e17],
	["gen9", 5.0e18],
	["furnace8", 1.0e19],
	["upgrade16", 2.5e19],
	["conveyor6", 5.0e19],
	["gent1", 1.0e20],
	["upgradet1", 1.0e20],
	["gent2", 1.0e21],
	["upgradet2", 1.0e21],
	["gent3", 2.0e21],
	["upgradec1", 2.0e21],
	["upgradet3", 3.0e21],
	["upgradet4", 1.5e22],
	["upgrade17", 3.0e22],
	["gen10", 8.0e22],
	["furnacet1", 1.0e24],
	["upgradett1", 6.0e24],
	["bluebert", 1.0e25],
	["upgradet5", 1.0e25],
	["upgradett2", 3.0e25],
	["gent4", 3.0e25],
	["furnacet2", 5.0e25],
	["upgradett3", 5.0e25],
	["upgradett4", 1.5e26],
	["upgradet6", 3.0e26],
	["upgradec2", 5.0e26],
	["upgradec3", 5.0e26],
	["gen11", 5.0e26],
	["upgrade18", 2.5e27],
	["upgradett5", 1.0e28],
	["upgradet7", 1.0e28],
	["furnacet3", 1.0e28],
	["upgrade19", 1.5e29],
	["upgrade20", 2.0e31],
	["gen12", 5.0e31],
	["conveyor7", 1.0e32],
	["upgradet8", 5.0e32],
	["upgradett6", 3.3e33],
	["upgrade21", 8.0e34],
	["upgrade22", 1.0e36],
	["furnacet4", 1.0e37],
	["upgradet9", 5.0e37],
	["upgradett7", 1.0e38],
	["gent5", 5.0e38],
	["genn1", 1.0e39],
	//["upgrade23", 1.0e40],
];

const rebirthShopItems = [
	[
		["upgrader1", 0],
		["upgradert1", 0],
		["furnacer1", 0],
	]
];

const shopTooltips = {
	conveyor: "Moves chunks at x1 speed permanently. (Tier 1)",
	conveyor2: "Moves chunks at x2 speed permanently. (Tier 2)",
	conveyor3: "Moves chunks at x3 speed permanently. (Tier 3)",
	conveyor4: "Moves chunks at x4 speed permanently. (Tier 4)",
	conveyor5: "Moves chunks at x5 speed permanently. (Tier 5)",
	conveyor6: "Moves chunks at x6 speed permanently. (Tier 6)",
	conveyor7: "Moves chunks at x10 speed permanently. (Tier 7)",
	conveyor8: "Moves chunks at x12 speed permanently. (Tier 8)",
	conveyor9: "Moves chunks at x15 speed permanently. (Tier 9)",
	conveyor10: "Moves chunks at x20 speed permanently. (Tier 10)",

	upgradec1:
		"Moves chunks. Rotates itself by 180° after every chunk. (Tier 7)",
	upgradec2:
		"Splits ▲ in half. Sends one going in each direction worth 1/2 the value of what was inputted. (Tier 7)",
	upgradec3:
		"Moves chunks. Rotates back and forth 90° after every chunk. (Tier 7)",

	furnace: "Sells ■ for x1 money. (Tier 1)",
	furnace2: "Sells ■ for x2 money. (Tier 2)",
	furnace3: "Sells ■ for x4 money. (Tier 3)",
	furnace4:
		"Sells ■ for x50 money if they have gone through 14 or fewer upgraders. Otherwise, sell for x2. (Tier 4)",
	furnace5: "Sells ■ for x8 money. (Tier 5)",
	furnace6:
		"Sells ■ for x50 money if they have the Burning effect. Otherwise, sell for x1. (Tier 6)",
	furnace7:
		"Sells ■ for x500 money if they haven't been through a Tier 7 upgrader. Otherwise, sell for x1. (Tier 7)",
	furnace8: "Sells ■ for x64 money. (Tier 8)",
	furnace9: "Sells ■. (Tier 9)",
	furnace10: "Sells ■. (Tier 10)",

	furnacet1:
		"(Requires ▲5) Sells ■ for x250 money. Sell for x1 if there is not enough ▲. (Tier T1)",
	furnacet2:
		"(▲500) Sells ■ for x2,500 money. Sell for x100 if there is not enough ▲. (Tier T2)",
	furnacet3:
		"(▲1,000) Sells ■ for x10,000 money if they have no effects. Sell for x250 if there is not enough ▲ OR the chunk has ANY effects. (Tier T3)",
	furnacet4:
		"(▲1.00e6) Sells ■ for x50,000 money. Sell for x2,500 if there is not enough ▲. (Tier T4)",

	furnacer1:
		"Sells ■ for a multiplier equal to the number of Shards you have. (Tier R1)",

	gen1: "Drops ■ worth $1. (Tier 1)",
	gen2: "Drops ■ worth $10. (Tier 2)",
	gen3: "Drops ■ worth $50. (Tier 3)",
	gen4: "Drops ■ worth $999. (Tier 4)",
	gen5: "Drops ■ worth $5,000. (Tier 5)",
	gen6: "Drops ■ worth $50,000. (Tier 6)",
	gen7: "Drops ■ worth $250,000. (Tier 7)",
	gen8: "Drops ■ worth $500,000 that can't be destroyed by Tier 6 Upgraders. (Tier 8)",
	gen9: "Drops ■ worth $5.00e6. (Tier 9)",
	gen10: "Drops ■ worth $2.50e8. (Tier 10)",
	gen11: "Drops ■ worth $2.0e10 with the Irradiated effect ($1.0e10 subtracted from value before each upgrade). (Tier 11)",
	gen12: "Drops ■ worth $5.0e11. (Tier 12)",

	genn1: "Drops... Nubert? What the fuck? (Drops retextured ■ worth $1.0e12.) (Tier 13)",

	gent1: "Drops... triangles? What? (Hint: There is no triangle cap!) (Tier T1)",
	gent2: "Drops ▲ worth ▲5. (Tier T2)",
	gent3: "Drops ▲ worth ▲20. (Tier T3)",
	gent4: "Drops ▲ worth ▲50. (Tier T4)",
	gent5: "Drops ▲ worth ▲2,500. (Tier T5)",

	upgrade1: "Adds $1 to the value of a ■. Infinite uses. (Tier 1)",
	upgrade2: "Adds $5 to the value of a ■. Infinite uses. (Tier 2)",
	upgrade3:
		"Multiplies ■ value by 1.3. Has no effect after 5th use per ■. (Tier 3)",
	upgrade4:
		"Multiplies ■ value by 2, if the ■ is worth less than $1,000 (Tier 4)",
	upgrade5: "Multiplies ■ value by 2. Has no effect after 1st use. (Tier 5)",
	upgrade6:
		"Multiplies ■ value by 2, but has a 20% chance to destroy it. Has no multiplier nor destruction chance after 5th use. (Tier 6)",
	upgrade7:
		"Multiplies ■ value by 1.5. Has no effect after 7th use. (Tier 7)",
	upgrade8: "Adds $10,000 to ■ value. Infinite uses. (Tier 8)",
	upgrade9:
		"Multiplies ■ value by 5, but applies the Burning effect (divides value by 1.1 every following upgrader). Has no effect after 1st use. (Tier 9)",
	upgrade10:
		"Multiplies ■ value by 3 if the Burning effect is applied. Removes Burning effect, but applies Frigid effect (has no effect). (Tier 10)",
	upgrade11:
		"Multiplies ■ value by 6 if the ■ has not gone through any upgraders yet. (Tier 11)",
	upgrade12:
		"Multiplies ■ value by 2.5 if the ■ is going at x1 speed. Has no effect after 3rd use. (Tier 12)",
	upgrade13:
		"Multiplies ■ value by 2. Has no effect after 5th use. Shares use cap with Tier 3 upgrader. (Tier 13)",
	upgrade14:
		"Multiplies ■ value by 1.1 if the ■ is worth less than $2.50e7. (Hint: Maybe you don't need a long chain of these..?)  (Tier 14)",
	upgrade15:
		"Multiplies ■ value by 3. Has no effect after 3rd use. (Tier 15)",
	upgrade16:
		"Multiplies ■ value by 2. Applies the Tough effect (immunity to destruction by Tier 6 Upgraders). Has no effect after 1st use. (Tier 16)",
	upgrade17: "Adds $1.00e8 to ■ value. Infinite uses. (Tier 17)",
	upgrade18:
		"Removes Tough and Irradiated effects and multiplies ■ value by 2.5. Has no effect after 1st use. (Tier 18)",
	upgrade19:
		"Multiplies ■ value by 64. Only works if no Tier 7 upgraders have been used. Prevents the use of Tier 7 upgraders. Has no effect after 1st use. (Tier 19)",
	upgrade20:
		"Multiplies ■ value by 100. Only works if no Tier 3/13 upgraders have been used. Prevents the use of Tier 3/13 upgraders. Has no effect after 1st use. (Tier 20)",
	upgrade21:
		"Multiplies ■ value by 10,000. Only works if no Tier 1 thru 10 upgraders have been used. Prevents the use of Tier 1 thru 10 upgraders. Has no effect after 1st use. (Tier 21)",
	upgrade22:
		"Multiplies ■ value by 5 if the ■ is going at x5 speed. Has no effect after 3rd use. Shares use cap with Tier 12 upgrader (Tier 22)",
	upgrade23:
		"Resets the use cap of Tier 12/22 upgraders, but raises ■ value by 0.8. Has no effect after 3rd use.",

	upgradet1:
		"(Requires ▲1 to be inputted per ■ to work) Multiplies ■ value by 10. Has no effect after 1st use. (Tier V1)",
	upgradet2:
		"(Requires ▲1 to be inputted work) Multiplies ■ value by 3. Has no effect after 1st use. (Tier V2)",
	upgradet3:
		"(Requires ▲2 to work) Multiplies ■ value by 5. Has no effect after 1st use. (Tier V3)",
	upgradet4:
		"(Requires ▲4) Multiplies ■ value by 3.3. Has no effect after 1st use. (Tier V4)",
	upgradet5:
		"(▲20) Multiplies ■ value by 2. Has no effect after 2nd use. (Tier V5)",
	upgradet6:
		"(▲750) Multiplies ■ value by 4. Has no effect after 1st use. (Tier V6)",
	upgradet7:
		"(▲1,000) Multiplies ■ value by 1.5, and removes the Frigid effect. Has no effect after 1st use. (Tier V7)",
	upgradet8:
		"(▲500,000) Multiplies ■ value by 10. Has no effect after 2nd use. (Tier V8)",
	upgradet9:
		"(▲1.00e7) Multiplies ■ value by 1.00e7. Prevents use of tier V1 thru V8 upgraders. Can't be used if any tier V1 thru V8 upgraders have been used. Has no effect after 1st use. (Tier V9)",

	upgradett1:
		"Multiplies ▲ value by 2. Has no effect after 2nd use. (Tier A1)",
	upgradett2:
		"Multiplies ▲ value by 3. Has no effect after 1st use. (Tier A2)",
	upgradett3:
		"Multiplies ▲ value by 5 if it has gone through 4 or more upgraders. Has no effect after 1st use. (Tier A3)",
	upgradett4:
		"Adds 1 max use to Tier T1 ▲ Upgrader, and multiplies ▲ value by 1.5. Has no effect after 1st use. (Tier A4)",
	upgradett5:
		"Multiplies ▲ value by 3, but has a 20% chance to destroy it. Has no effect after 2nd use. (Tier A5)",
	upgradett6: "Adds ▲250 to ▲ value. Infinite uses. (Tier A6)",
	upgradett7:
		"Multiplies ▲ value by 1.4. Has no effect after 5th use. (Tier A7)",

	upgrader1:
		"Multiplies ■ value by the number of Shards you have. Has no effect after 1st use. (Tier R1)",

	upgradert1:
		"Multiplies ▲ value by the number of Shards you have. Has no effect after 1st use. (Tier R1)",

	nothing: "",
	nubert: "My man! (Hint: Nuberts have no use.) (Tier ∞)",
	bluebert: "My... woman? (Tier T∞)",
	wigbert: "Everybody loves him! (Tier D)",
	gaybert: "Men love him! (Tier D)",
	transbert: "My woman! (Tier D)",
	yellowbert: "He's yellow! (Tier D)",
	greenbert: "She's green! (Tier D)",
	glassbert: "These are non-perscription! I still can't see! (Tier D)",
	trebun: "(D reiT) !nam yM",
	unbert: "You hurt his feelings! (Tier D)",
	orangebert: "He's gonna paint the town orange! (Tier D)",
};
