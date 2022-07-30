"use strict";

/* eslint-disable max-len */

let hasStartedGame = false;
const { ceil, floor, abs } = Math;
const id = n => document.getElementById(n);
const gid = id;
const D = n => new Decimal(n);

console.log("%cpipegame;", "font-size: 25px; font-weight: bold;");
console.log("%cmade w/ <3 by yhvr", "font-style: italic");
console.log("%cmaintained by scar1337", "font-style: italic");
console.log("%cusing break_eternity.js by patashu", "font-style: italic");
console.log(
	"%cIf you don't know what you're doing, you might want to close this.",
	"color: #ffbbbb"
);
console.log(
	"%cIf you know what you're doing--I'm so sorry. My crimes can't be forgiven now.",
	"color: #ffbbbb"
);

const messages = [
	"no longer sex",
	"my man!",
	"tree game 4",
	"certified by obama",
	"rip kongregate",
	"hi chat",
	"ty for playing!",
	"me when the <→",
	"NO HOMESTUCK",
	"better than minehut",
	"EEEEEEEEEEEE",
	"[object Object]",
	"PT is killing DI",
	"not made in TMT!",
	"flash was better",
	"RIP technoblade",
	"techno never dies",
	"crunch SuperSpruce",
	"pipegame lore",
	// Credit: TheTastyPi
	"factorio 2",
	// Credit: yahtzee
	"triangles boost nubert",
	// Credit: Fishydids
	"the gay club",
];

setInterval(() => {
	document.title = `pipegame (${
		messages[Math.floor(Math.random() * messages.length)]
	})`;
}, 1000 * 60);
