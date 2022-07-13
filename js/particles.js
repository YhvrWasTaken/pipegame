"use strict";

let particles = [];
// TODO make cap actually take effect
// Just in case we reach this point
let maxParticles = 5000;

/**
 * `start`, `vel`, and `accel` all have the same keys:
 * { x,
 *   y,
 *   s,  // scale
 *   r,  // rotation
 *   a } // alpha
 * `start` is where the values start in the particle
 * `vel`   is how the start values change every tick
 * `accel` is how the velocity values change every tick
 * i hate myself
 */
function addParticle(
	img,
	expiry,
	start,
	vel,
	accel = { x: 0, y: 0, r: 0, s: 0, a: 0 }
) {
	particles.push({
		img,
		x: start.x ?? 0,
		y: start.y ?? 0,
		s: start.s ?? 1,
		r: start.r ?? 0,
		a: start.a ?? 1,
		xv: vel.x ?? 0,
		yv: vel.y ?? 0,
		rv: vel.r ?? 0,
		sv: vel.s ?? 0,
		av: vel.a ?? 0,
		xa: accel.x ?? 0,
		ya: accel.y ?? 0,
		ra: accel.r ?? 0,
		sa: accel.s ?? 0,
		aa: accel.a ?? 0,
		expiry: Date.now() + expiry,
	});
}

// Helper to handle multiple particles
function addParticles(
	amt,
	img,
	expiry,
	start,
	vel,
	accel = { x: [0, 0], y: [0, 0], r: [0, 0], s: [0, 0], a: [0, 0] }
) {
	for (let i = 0; i < amt; i++) {
		addParticle(
			img,
			expiry,
			{
				x: randIn(start.x, 0),
				y: randIn(start.y, 0),
				r: randIn(start.r, 0),
				s: randIn(start.s, 1),
				a: randIn(start.a, 1),
			},
			{
				x: randIn(vel.x, 0),
				y: randIn(vel.y, 0),
				r: randIn(vel.r, 0),
				s: randIn(vel.s, 0),
				a: randIn(vel.a, 0),
			},
			{
				x: randIn(accel.x, 0),
				y: randIn(accel.y, 0),
				r: randIn(accel.r, 0),
				s: randIn(accel.s, 0),
				a: randIn(accel.a, 0),
			}
		);
	}
}

// https://stackoverflow.com/a/1527820
function randIn(range, fallback) {
	if (range === undefined) {
		return fallback;
	}
	if (range[1] === undefined) return range;
	let [min, max] = range;

	return Math.random() * (max - min) + min;
}

function tickParticles(mult) {
	let newParticles = [];
	particles.forEach(p => {
		if (Date.now() >= p.expiry) return;
		// Particles will prob look different on different Hz.
		// WHO CARES?
		p.x += p.xv * mult;
		p.y += p.yv * mult;
		p.r += p.rv * mult;
		p.s += p.sv * mult;
		p.a += p.av * mult;
		p.xv += p.xa * mult;
		p.yv += p.ya * mult;
		p.rv += p.ra * mult;
		p.sv += p.sa * mult;
		p.av += p.aa * mult;
		newParticles.push(p);
	});
	particles = newParticles;
}

function drawParticles() {
	particles.forEach(p => {
		ctx.globalAlpha = Math.max(p.a, 0);
		drawBlock(p.img, p.x, p.y, p.r, p.s);
	});
}