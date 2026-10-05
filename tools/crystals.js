// The shapes of the crystals, shared by tools/photo.html and
// tools/render.html. Each habit is a convex shape: a list of face planes
// [nx, ny, nz, offset] in unit space, with y up the long axis of the crystal.
// Both pages load this file with a script tag.

const DEG = Math.PI / 180;
const unit = v => { const l = Math.hypot(...v); return v.map(x => x / l); };
const pl = (n, d) => [...unit(n), d];
// Faces around the y axis: count faces at azimuth a0 + k * 360 / count,
// tilted up by elev degrees (0 is a vertical face), at distance d.
function ring(count, a0, elev, d) {
  const out = [];
  for (let k = 0; k < count; k++) {
    const a = (a0 + k * 360 / count) * DEG, e = elev * DEG;
    out.push(pl([Math.cos(a) * Math.cos(e), Math.sin(e), Math.sin(a) * Math.cos(e)], d));
  }
  return out;
}
// A prism of `count` faces with radius r and half length h, and a cap of
// faces tilted by capElev at the top. The cap meets the prism at y = h.
function prismCap(count, r, h, capElev, a0 = 0, capCount = count, capA0 = a0, bottom = -h) {
  const e = capElev * DEG;
  return [
    ...ring(count, a0, 0, r),
    ...ring(capCount, capA0, capElev, r * Math.cos(e) + h * Math.sin(e)),
    pl([0, -1, 0], -bottom),
  ];
}
const HABITS = {
  // Quartz: a six-sided prism with a pointed termination
  prism6: () => prismCap(6, .5, .9, 38.2),
  // Beryl and apatite: a six-sided prism with a flat end and small bevels
  beryl: () => [...ring(6, 0, 0, .5), pl([0, 1, 0], 1.0), ...ring(6, 0, 45, .5 * Math.cos(45 * DEG) + 1.0 * Math.sin(45 * DEG) - .06), pl([0, -1, 0], 1.0)],
  // Corundum, vanadinite: a barrel of six faces that taper to flat ends
  barrel: () => [...ring(6, 0, 7, .5), ...ring(6, 0, -7, .5), pl([0, 1, 0], .62), pl([0, -1, 0], .62)],
  // Tourmaline: three wide faces and three narrow ones, and a low termination
  prism3: () => [...ring(3, 90, 0, .5), ...ring(3, 30, 0, .58), ...ring(3, 30, 52, .58 * Math.cos(52 * DEG) + 1.2 * Math.sin(52 * DEG)), pl([0, -1, 0], 1.2)],
  // Apophyllite: a square prism with a pyramid turned 45 degrees and a flat top
  prism4: () => [...ring(4, 0, 0, .5), ...ring(4, 45, 32, .5 * Math.SQRT2 * Math.cos(32 * DEG) * .9 + .75 * Math.sin(32 * DEG)), pl([0, 1, 0], 1.2), pl([0, -1, 0], .8)],
  cube: () => [pl([1, 0, 0], .5), pl([-1, 0, 0], .5), pl([0, 1, 0], .5), pl([0, -1, 0], .5), pl([0, 0, 1], .5), pl([0, 0, -1], .5)],
  // Fluorite and galena: cubes with small cut edges or corners
  cubeEdge: () => [...HABITS.cube(), ...[[1, 1, 0], [1, -1, 0], [-1, 1, 0], [-1, -1, 0], [1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1], [0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, -1]].map(n => pl(n, .66))],
  cubeOcta: () => [...HABITS.cube(), ...[[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]].map(n => pl(n, .72))],
  octahedron: () => [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]].map(n => pl(n, .5)),
  dodecahedron: () => [[1, 1, 0], [1, -1, 0], [-1, 1, 0], [-1, -1, 0], [1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1], [0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, -1]].map(n => pl(n, .55)),
  tetrahedron: () => [...[[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]].map(n => pl(n, .4)), ...[[-1, -1, -1], [-1, 1, 1], [1, -1, 1], [1, 1, -1]].map(n => pl(n, .62))],
  // Zircon, cassiterite: a square prism with a pyramid at both ends
  zircon: () => [...ring(4, 0, 0, .5), ...ring(4, 0, 42, .5 * Math.cos(42 * DEG) + .7 * Math.sin(42 * DEG)), ...ring(4, 0, -42, .5 * Math.cos(42 * DEG) + .7 * Math.sin(42 * DEG))],
  // Scheelite: a steep dipyramid of 8 faces
  dipyramid: () => [...ring(4, 45, 33, .5), ...ring(4, 45, -33, .5)],
  // Sulfur: a dipyramid with the three axes of the orthorhombic crystal
  sulfur: () => [[1.23, 1, .525], [1.23, 1, -.525], [1.23, -1, .525], [1.23, -1, -.525], [-1.23, 1, .525], [-1.23, 1, -.525], [-1.23, -1, .525], [-1.23, -1, -.525]].map(n => pl([n[0], n[2], n[1]], .5)).concat([pl([0, 1, 0], 1.3), pl([0, -1, 0], 1.3)]),
  rhombohedron: () => [...ring(3, 0, 42, .45), ...ring(3, 60, -42, .45)],
  // Dioptase: a short six-sided prism with rhombohedral ends
  prismRhomb: () => [...ring(6, 30, 0, .5), ...ring(3, 0, 50, .5 * Math.cos(50 * DEG) + .45 * Math.sin(50 * DEG)), ...ring(3, 60, -50, .5 * Math.cos(50 * DEG) + .45 * Math.sin(50 * DEG))],
  // Calcite dogtooth: a scalenohedron of 12 steep faces
  scalenohedron: () => [...ring(3, -22, 18, .32), ...ring(3, 22, 18, .32), ...ring(3, 38, -18, .32), ...ring(3, 82, -18, .32)],
  // Wulfenite: a thin square plate with beveled edges
  plate: () => [...ring(4, 0, 0, .7), ...ring(4, 0, 62, .7 * Math.cos(62 * DEG) + .08 * Math.sin(62 * DEG)), ...ring(4, 0, -62, .7 * Math.cos(62 * DEG) + .08 * Math.sin(62 * DEG)), pl([0, 1, 0], .1), pl([0, -1, 0], .1)],
  // Barite: a rectangular plate with sloped ends
  barite: () => [pl([1, 0, 0], .9), pl([-1, 0, 0], .9), pl([0, 0, 1], .55), pl([0, 0, -1], .55), pl([1, 0, 1.4], .9), pl([1, 0, -1.4], .9), pl([-1, 0, 1.4], .9), pl([-1, 0, -1.4], .9), pl([0, 1, 0], .13), pl([0, -1, 0], .13), pl([.7, 1, 0], .7), pl([-.7, 1, 0], .7), pl([.7, -1, 0], .7), pl([-.7, -1, 0], .7)],
  // Stibnite, kyanite, selenite: a long flat blade with a chisel end
  blade: () => [pl([1, 0, 0], .32), pl([-1, 0, 0], .32), pl([0, 0, 1], .09), pl([0, 0, -1], .09), pl([.9, .45, 0], .46), pl([-.9, .45, 0], .46), pl([0, -1, 0], 1.0), pl([0, 1, 0], 1.5)],
  // Topaz, epidote and other prisms: a rhombic prism with a roof of 4 faces
  prism: () => [...ring(2, 35, 0, .5), ...ring(2, 145, 0, .5), pl([0, 0, 1], .42), pl([0, 0, -1], .42), ...ring(2, 35, 46, .5 * Math.cos(46 * DEG) + .8 * Math.sin(46 * DEG)), ...ring(2, 145, 46, .5 * Math.cos(46 * DEG) + .8 * Math.sin(46 * DEG)), pl([0, .8, .6], .42 * .6 + .8 * .8 + .05), pl([0, .8, -.6], .42 * .6 + .8 * .8 + .05), pl([0, -1, 0], .9)],
  // Microcline: a blocky crystal
  blocky: () => [pl([1, 0, 0], .55), pl([-1, 0, 0], .55), pl([0, 0, 1], .45), pl([0, 0, -1], .45), pl([0, 1, 0], .6), pl([0, -1, 0], .6), pl([.8, .6, 0], .62), pl([-.8, -.6, 0], .62)],
  // Titanite: a flat wedge
  wedge: () => [pl([.62, .78, 0], .55), pl([-.62, .78, 0], .55), pl([.62, -.78, 0], .55), pl([-.62, -.78, 0], .55), pl([0, 0, 1], .16), pl([0, 0, -1], .16), pl([.35, .45, .82], .4), pl([-.35, -.45, -.82], .4), pl([.35, -.45, -.82], .4), pl([-.35, .45, .82], .4)],
  // A thin prism for needles and sprays
  needle: () => [...ring(4, 45, 0, .5), ...ring(4, 45, 35, .5 * Math.cos(35 * DEG) + 1.0 * Math.sin(35 * DEG)), pl([0, -1, 0], 0)],
  needle6: () => [...ring(6, 0, 0, .5), pl([0, 1, 0], 1.0), pl([0, -1, 0], 0)],
  // A flat six-sided plate for books of mica and molybdenite
  hexPlate: () => [...ring(6, 0, 0, 1.0), pl([0, 1, 0], .05), pl([0, -1, 0], .05)],
  // A rhombic plate with pointed ends, for the twins of cerussite
  chevron: () => [pl([1, 0, 0], .07), pl([-1, 0, 0], .07), pl([0, .5, .87], .62), pl([0, .5, -.87], .62), pl([0, -.5, .87], .62), pl([0, -.5, -.87], .62)],
};

// The round brilliant cut and the step cut of emerald. A face tilts by `tilt`
// degrees from the girdle plane, so its normal rises by 90 - tilt.
function facet(count, a0, tilt, r, y, down = false) {
  const e = (90 - tilt) * (down ? -1 : 1);
  return ring(count, a0, e, r * Math.cos(e * DEG) + y * Math.sin(e * DEG));
}
function gemPlanes(cut) {
  if (cut === 'step') {
    // An emerald cut: a rectangle with cut corners, 3 steps on the crown and
    // 3 steps on the pavilion. The steps flatten toward the table.
    const out = [];
    const sides = [[1, 0, .74], [-1, 0, .74], [0, 1, .5], [0, -1, .5], [.7071, .7071, .78], [-.7071, .7071, .78], [.7071, -.7071, .78], [-.7071, -.7071, .78]];
    let top = 0, bottom = 0;
    for (const [x, z, d] of sides) {
      out.push(pl([x, 0, z], d));
      let r = d, y = .03;
      for (const [tilt, len] of [[44, .09], [32, .09], [20, .1]]) {
        const e = (90 - tilt) * DEG;
        out.push(pl([x * Math.cos(e), Math.sin(e), z * Math.cos(e)], r * Math.cos(e) + y * Math.sin(e)));
        r -= len * Math.cos(tilt * DEG); y += len * Math.sin(tilt * DEG);
      }
      top = y;
      r = d; y = -.03;
      for (const [tilt, len] of [[46, .14], [52, .16], [58, .2]]) {
        const e = -(90 - tilt) * DEG;
        out.push(pl([x * Math.cos(e), Math.sin(e), z * Math.cos(e)], r * Math.cos(e) + y * Math.sin(e)));
        r -= len * Math.cos(tilt * DEG); y -= len * Math.sin(tilt * DEG);
      }
      bottom = y;
    }
    out.push(pl([0, 1, 0], top), pl([0, -1, 0], -bottom - .05));
    return out;
  }
  return [
    pl([0, 1, 0], .322),
    ...facet(8, 0, 34.5, 1, .02),
    ...facet(8, 22.5, 22, .6, .322),
    ...facet(16, 11.25, 41, 1, .02),
    ...ring(16, 0, 0, 1.0),
    ...facet(8, 0, 40.75, 1, -.02, true),
    ...facet(16, 11.25, 42, 1, -.02, true),
  ];
}

// The shape and size of each habit in the specimen scene.
const HABIT_INFO = {
  prism6: { planes: 'prism6' }, beryl: { planes: 'beryl' }, barrel: { planes: 'barrel' }, prism3: { planes: 'prism3' }, prism4: { planes: 'prism4' },
  cube: { planes: 'cube' }, octahedron: { planes: 'octahedron' }, dodecahedron: { planes: 'dodecahedron' }, tetrahedron: { planes: 'tetrahedron' },
  dipyramid: { planes: 'dipyramid' }, rhombohedron: { planes: 'rhombohedron' }, scalenohedron: { planes: 'scalenohedron' },
  tabular: { planes: 'plate' }, blades: { planes: 'blade' }, prism: { planes: 'prism' }, wedge: { planes: 'wedge' },
};

// Stretches the planes of a unit crystal by the aspect A and keeps unit
// normals, so the shader gets true distances from a plain dot product.
function stretch(planes, A) {
  return planes.map(([x, y, z, d]) => { const m = [x / A[0], y / A[1], z / A[2]], L = Math.hypot(...m); return [m[0] / L, m[1] / L, m[2] / L, d / L]; });
}

// Picks the planes of a mineral: some minerals need a variant of their habit.
function planesFor(t) {
  const s = t.slug;
  if (s === 'fluorite') return HABITS.cubeEdge();
  if (s === 'galena') return HABITS.cubeOcta();
  if (s === 'sulfur') return HABITS.sulfur();
  if (s === 'zircon' || s === 'cassiterite') return HABITS.zircon();
  if (s === 'barite') return HABITS.barite();
  if (s === 'dioptase') return HABITS.prismRhomb();
  if (s === 'amazonite') return HABITS.blocky();
  if (s === 'cerussite') return HABITS.chevron();
  if (s === 'stibnite') return HABITS.needle();
  if (t.habit === 'geode') return t.slug === 'celestine' ? HABITS.prism() : HABITS.prism6();
  if (t.habit === 'druse') return HABITS.dodecahedron();
  if (t.habit === 'acicular' || t.habit === 'star') return s === 'atacamite' || s === 'adamite' ? HABITS.needle6() : HABITS.needle();
  if (t.habit === 'books') return HABITS.hexPlate();
  if (t.habit === 'cross') return HABITS.prism();
  if (t.habit === 'sixling') return HABITS.chevron();
  const info = HABIT_INFO[t.habit];
  return info ? HABITS[info.planes]() : HABITS.prism6();
}

// The aspect of a single crystal of the mineral: x, y and z stretch.
function aspectFor(t) {
  const s = t.slug;
  const A = {
    quartz: [1, 1.7, 1], citrine: [1, 1.5, 1], 'smoky-quartz': [1, 1.8, 1], emerald: [1, 1.5, 1], aquamarine: [1, 2.2, 1], morganite: [1.2, .55, 1.2], apatite: [1, 1.1, 1],
    aragonite: [1, 1.3, 1], ruby: [1, .9, 1], sapphire: [1, 1.5, 1], alexandrite: [1, .7, 1], vanadinite: [1, .9, 1], pyromorphite: [.8, 1.2, .8],
    'watermelon-tourmaline': [1, 2.4, 1], schorl: [1, 2.1, 1], apophyllite: [1, 1.1, 1], kyanite: [1, 1.8, 1], stibnite: [.32, 2.6, .24], selenite: [1.2, 2.4, 1.2],
    vivianite: [1, 2.2, 1], kunzite: [1.3, 1.8, 1.3], topaz: [1, 1.5, 1], epidote: [.7, 2.2, .7], tanzanite: [1, 1.2, 1], realgar: [.9, 1.1, .9], orpiment: [1, 1.1, 1],
    peridot: [1, 1.1, 1], azurite: [1, .8, 1.3], chalcanthite: [1, .9, 1.2], amazonite: [1, 1, 1], scheelite: [1, 1.3, 1], zircon: [1, 1.4, 1], cassiterite: [1, 1, 1],
    sulfur: [1, 1, 1], calcite: [1, 2.6, 1], dioptase: [1, 1.1, 1], rhodochrosite: [1, 1, 1], cinnabar: [1, .8, 1], wulfenite: [1, 1, 1], barite: [1, 1, 1],
  };
  return A[s] || [1, 1, 1];
}

// The corners of a convex shape: points where 3 planes meet inside all others.
function vertices(planes, a) {
  const P = planes.map(([x, y, z, d]) => [x / a[0], y / a[1], z / a[2], d]);
  const out = [];
  for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) for (let k = j + 1; k < P.length; k++) {
    const [a1, b1, c1, d1] = P[i], [a2, b2, c2, d2] = P[j], [a3, b3, c3, d3] = P[k];
    const det = a1 * (b2 * c3 - b3 * c2) - b1 * (a2 * c3 - a3 * c2) + c1 * (a2 * b3 - a3 * b2);
    if (Math.abs(det) < 1e-6) continue;
    const x = (d1 * (b2 * c3 - b3 * c2) - b1 * (d2 * c3 - d3 * c2) + c1 * (d2 * b3 - d3 * b2)) / det;
    const y = (a1 * (d2 * c3 - d3 * c2) - d1 * (a2 * c3 - a3 * c2) + c1 * (a2 * d3 - a3 * d2)) / det;
    const z = (a1 * (b2 * d3 - b3 * d2) - b1 * (a2 * d3 - a3 * d2) + d1 * (a2 * b3 - a3 * b2)) / det;
    if (P.every(([px, py, pz, pd]) => px * x + py * y + pz * z <= pd + 1e-5) && !out.some(o => Math.abs(o[0] - x) + Math.abs(o[1] - y) + Math.abs(o[2] - z) < 1e-6)) out.push([x, y, z]);
  }
  return out;
}
// ---------- quaternions in JavaScript ----------

function qAxisJS(ax, a) { const n = unit(ax), s = Math.sin(a / 2); return [n[0] * s, n[1] * s, n[2] * s, Math.cos(a / 2)]; }
function qMul(a, b) {
  return [
    a[3] * b[0] + b[3] * a[0] + (a[1] * b[2] - a[2] * b[1]),
    a[3] * b[1] + b[3] * a[1] + (a[2] * b[0] - a[0] * b[2]),
    a[3] * b[2] + b[3] * a[2] + (a[0] * b[1] - a[1] * b[0]),
    a[3] * b[3] - (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]),
  ];
}
function qFromYJS(a) { a = unit(a); const w = 1 + a[1]; if (w < 1e-4) return [1, 0, 0, 0]; return unit([a[2], 0, -a[0], w]); }
function qApply(q, v) {
  const [x, y, z, w] = q;
  const c1 = [y * v[2] - z * v[1] + w * v[0], z * v[0] - x * v[2] + w * v[1], x * v[1] - y * v[0] + w * v[2]];
  return [v[0] + 2 * (y * c1[2] - z * c1[1]), v[1] + 2 * (z * c1[0] - x * c1[2]), v[2] + 2 * (x * c1[1] - y * c1[0])];
}


// ---------- drawings for the data card ----------

// Ideal forms of each crystal system, for minerals without a crystal habit
// of their own, such as massive stones and nuggets.
const SYSTEM_FORMS = {
  Cubic: () => HABITS.cube(),
  Hexagonal: () => HABITS.beryl(),
  Trigonal: () => HABITS.rhombohedron(),
  Tetragonal: () => HABITS.zircon(),
  Orthorhombic: () => HABITS.prism(),
  // A prism with one sloped end, as the monoclinic axes lean in one plane
  Monoclinic: () => [...ring(2, 35, 0, .5), ...ring(2, 145, 0, .5), pl([0, 0, 1], .42), pl([0, 0, -1], .42), pl([.45, .89, 0], .78), pl([-.45, -.89, 0], .78)],
  // A prism that leans in two planes
  Triclinic: () => [pl([.94, 0, .34], .5), pl([-.94, 0, -.34], .5), pl([.17, 0, .98], .42), pl([-.17, 0, -.98], .42), pl([.36, .86, .36], .74), pl([-.36, -.86, -.36], .74)],
};

// The solids to draw for a mineral, each as { planes, q }: q turns the solid.
// Twins draw 2 or 3 solids.
function cardSolids(t) {
  const polyHabits = ['prism6', 'beryl', 'barrel', 'prism3', 'prism4', 'cube', 'octahedron', 'dodecahedron', 'tetrahedron', 'dipyramid', 'rhombohedron', 'scalenohedron', 'tabular', 'blades', 'prism', 'wedge', 'geode', 'druse'];
  const id = [0, 0, 0, 1];
  if (t.habit === 'cross') {
    const p = stretch([...ring(2, 35, 0, .5), ...ring(2, 145, 0, .5), pl([0, 0, 1], .38), pl([0, 0, -1], .38), pl([0, 1, 0], .9), pl([0, -1, 0], .9)], [1, 1.9, 1]);
    return [{ planes: p, q: id }, { planes: p, q: qAxisJS([0, 0, 1], Math.PI / 3) }];
  }
  if (t.habit === 'sixling') {
    const p = HABITS.chevron();
    return [0, 1, 2].map(k => ({ planes: p, q: qAxisJS([0, 1, 0], k * Math.PI / 3) }));
  }
  if (polyHabits.includes(t.habit)) return [{ planes: stretch(planesFor(t), t.habit === 'druse' || t.habit === 'geode' ? [1, 1.2, 1] : aspectFor(t)), q: id }];
  // Native metals grow as octahedrons; lazurite as twelve-sided crystals.
  if (['gold', 'silver', 'copper'].includes(t.slug)) return [{ planes: HABITS.octahedron(), q: id }];
  if (t.slug === 'lazurite') return [{ planes: HABITS.dodecahedron(), q: id }];
  if (t.habit === 'books') return [{ planes: stretch(HABITS.hexPlate(), [1, 1.6, 1]), q: id }];
  if (t.habit === 'acicular' || t.habit === 'star') return [{ planes: stretch(t.system === 'Tetragonal' || t.system === 'Orthorhombic' ? HABITS.needle() : HABITS.needle6(), [.45, 1.6, .45]), q: id }];
  const f = SYSTEM_FORMS[t.system];
  return f ? [{ planes: f(), q: id }] : [];
}

// Words for the habit of each mineral, for the card.
const HABIT_WORDS = {
  prism6: 'six-sided prisms with pointed ends', beryl: 'six-sided prisms with flat ends', barrel: 'six-sided barrels',
  prism3: 'striated prisms with three sides', prism4: 'square prisms with pyramids', cube: 'cubes', octahedron: 'octahedrons',
  dodecahedron: 'twelve-sided crystals', tetrahedron: 'tetrahedrons', dipyramid: 'double pyramids', rhombohedron: 'rhombs',
  scalenohedron: 'dogtooth crystals', tabular: 'flat plates', blades: 'long blades', prism: 'prisms', wedge: 'flat wedges',
  acicular: 'sprays of needles', star: 'needles that form stars', botryoidal: 'rounded masses', massive: 'masses without crystal faces',
  geode: 'crystals that line a geode', druse: 'a crust of tiny crystals', nugget: 'nuggets and grains', dendrite: 'branches and wires',
  hopper: 'stepped hopper crystals', books: 'stacks of thin sheets', cross: 'twins that cross', sixling: 'twins in the shape of a star',
  meteorite: 'iron masses from space',
};
