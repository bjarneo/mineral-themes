// Palette source for all mineral themes. Each theme has a night variant and a
// day variant. The table below sets the character of each mineral. The math
// under it turns that into 2 complete Omarchy palettes, and it raises or
// lowers the lightness of each color until it reaches its contrast target.

// Fields of each mineral:
//   f        chemical formula
//   sys      crystal system
//   h        Mohs hardness as [lowest, highest]
//   lus      luster
//   streak   color of the powder on a streak plate, as [words, hex]
//   sg       specific gravity
//   loc      a notable locality
//   note     'Variety of ...' or 'Mineraloid', when it applies
//   habit    shape for tools/photo.html: nugget, dendrite, dipyramid, hopper,
//            octahedron, books, meteorite, cube, tetrahedron, rhombohedron,
//            massive, blades, prism, botryoidal, barrel, star, prism6, beryl,
//            prism3, scalenohedron, sixling, tabular, geode, acicular,
//            dodecahedron, druse, cross, wedge, prism4
//   mat      clear, trans (translucent), opaque or metal
//   pat      pattern: none, banded, mottled, speckled, chatoyant,
//            labradorescent, opal, iridescent, veined, swirl, radial,
//            widmanstatten, adularescent, aventurescent, zoned, web, streaked,
//            sheen
//   col      body color of the mineral in the photos
//   col2     second color: bands, inclusions, veins or the rim
//   mtx      color of the host rock under a specimen
//   gem      the close-up shows a cut gem
//   ior      refractive index of a clear mineral
//   disp     dispersion of a clear mineral, for colored flashes
//   bg       night background as OKLCH [lightness, chroma, hue]
//   accent   signature color as [hue, chroma, night lightness]
//   second   second color for borders and drawings, same form as accent
//   chroma   chroma of the 6 ANSI hues
//   warm     0 to 1. Pulls the cool ANSI hues to the warm side and lowers their chroma.
//   day      optional changes for the day variant: bg hue, accent and second

const CATEGORIES = {
  native: 'Native elements',
  sulfides: 'Sulfides',
  oxides: 'Oxides and hydroxides',
  halides: 'Halides',
  carbonates: 'Carbonates',
  sulfates: 'Sulfates and related minerals',
  phosphates: 'Phosphates, arsenates and vanadates',
  island: 'Island and group silicates',
  ring: 'Ring silicates',
  chain: 'Chain silicates',
  sheet: 'Sheet silicates',
  framework: 'Framework silicates',
};

const TABLE = [
  // Native elements
  ['Gold', 'native', 'A soft, heavy, yellow metal. It does not tarnish, so a nugget stays bright.', { f: 'Au', sys: 'Cubic', h: [2.5, 3], lus: 'Metallic', streak: ['Golden yellow', '#d4a83c'], sg: '19.3', loc: 'Victoria, Australia', habit: 'nugget', mat: 'metal', pat: 'none', col: '#e6b44c', mtx: '#d8d2c4', bg: [.17, .03, 85], accent: [88, .14, .84], second: [40, .1], chroma: .11, warm: .55 }],
  ['Silver', 'native', 'A white metal that grows as wires and branches. It turns black when it tarnishes.', { f: 'Ag', sys: 'Cubic', h: [2.5, 3], lus: 'Metallic', streak: ['Silver white', '#d0d0d0'], sg: '10.5', loc: 'Kongsberg, Norway', habit: 'dendrite', mat: 'metal', pat: 'none', col: '#dadbdf', mtx: '#8c8a86', bg: [.176, .016, 258], accent: [256, .026, .875], second: [71, .04], chroma: .09, warm: .2 }],
  ['Copper', 'native', 'A red metal that grows in branches. Air turns the surface brown, then green.', { f: 'Cu', sys: 'Cubic', h: [2.5, 3], lus: 'Metallic', streak: ['Copper red', '#b8643a'], sg: '8.9', loc: 'Keweenaw Peninsula, Michigan, USA', habit: 'dendrite', mat: 'metal', pat: 'none', col: '#d0784c', mtx: '#5a5650', bg: [.16, .03, 50], accent: [48, .13, .74], second: [170, .09], chroma: .12, warm: .5 }],
  ['Sulfur', 'native', 'Yellow crystals that form near volcanic vents. Sulfur melts at 115 °C and burns with a blue flame.', { f: 'S', sys: 'Orthorhombic', h: [1.5, 2.5], lus: 'Resinous', streak: ['White', '#f2f0e6'], sg: '2.07', loc: 'Sicily, Italy', habit: 'dipyramid', mat: 'trans', pat: 'none', col: '#e8d03a', mtx: '#c8c0b0', ior: 2.0, bg: [.198, .048, 101], accent: [101, .165, .893], second: [72, .095], chroma: .12, warm: .4 }],
  ['Bismuth', 'native', 'A heavy, pink-silver metal. Crystals grown in a lab form stepped squares with a thin rainbow oxide.', { f: 'Bi', sys: 'Trigonal', h: [2, 2.5], lus: 'Metallic', streak: ['Silver white', '#cfcac8'], sg: '9.8', loc: 'Schneeberg, Saxony, Germany', habit: 'hopper', mat: 'metal', pat: 'iridescent', col: '#cdbcc4', bg: [.17, .02, 330], accent: [330, .12, .78], second: [195, .1], chroma: .12, warm: .1 }],
  ['Diamond', 'native', 'Pure carbon and the hardest natural mineral. Its high dispersion splits white light into flashes of color.', { f: 'C', sys: 'Cubic', h: [10, 10], lus: 'Adamantine', streak: ['None, harder than the plate', '#ffffff'], sg: '3.52', loc: 'Kimberley, South Africa', habit: 'octahedron', mat: 'clear', pat: 'none', col: '#f6f8fa', mtx: '#3c4a44', gem: true, ior: 2.42, disp: .044, bg: [.137, .013, 274], accent: [208, .045, .934], second: [323, .095], chroma: .1, warm: .1 }],
  ['Graphite', 'native', 'Pure carbon in soft, black sheets. The sheets slide over each other, so graphite marks paper.', { f: 'C', sys: 'Hexagonal', h: [1, 2], lus: 'Metallic to dull', streak: ['Black', '#1c1c1e'], sg: '2.2', loc: 'Borrowdale, England', habit: 'books', mat: 'metal', pat: 'none', col: '#45474c', mtx: '#c8c4bc', bg: [.145, .003, 269], accent: [268, .019, .802], second: [210, .061], chroma: .08, warm: .2 }],
  ['Kamacite', 'native', 'An iron-nickel alloy from meteorites. Acid on a cut face shows the crossed bands of the Widmanstätten pattern.', { f: 'α-(Fe,Ni)', sys: 'Cubic', h: [4, 4], lus: 'Metallic', streak: ['Gray', '#8a8c8e'], sg: '7.9', loc: 'Gibeon meteorite, Namibia', habit: 'meteorite', mat: 'metal', pat: 'widmanstatten', col: '#a4a8ad', col2: '#6c5444', bg: [.17, .009, 64], accent: [60, .01, .878], second: [209, .079], chroma: .09, warm: .25 }],

  // Sulfides
  ['Pyrite', 'sulfides', 'Brass-yellow cubes with fine lines on the faces. People call it fool’s gold.', { f: 'FeS₂', sys: 'Cubic', h: [6, 6.5], lus: 'Metallic', streak: ['Greenish black', '#2a2c24'], sg: '5.0', loc: 'Navajún, La Rioja, Spain', habit: 'cube', mat: 'metal', pat: 'none', col: '#cfb873', mtx: '#8e877c', bg: [.15, .018, 100], accent: [98, .1, .82], second: [230, .06], chroma: .1, warm: .45 }],
  ['Galena', 'sulfides', 'Heavy, lead-gray cubes. It is the main ore of lead, and it breaks into perfect cubes.', { f: 'PbS', sys: 'Cubic', h: [2.5, 2.75], lus: 'Metallic', streak: ['Lead gray', '#5c6066'], sg: '7.6', loc: 'Joplin, Missouri, USA', habit: 'cube', mat: 'metal', pat: 'none', col: '#90959c', mtx: '#b8a890', bg: [.136, .004, 237], accent: [241, .047, .756], second: [22, .11], chroma: .09, warm: .2 }],
  ['Sphalerite', 'sulfides', 'The main ore of zinc. Clear crystals are orange to red, with more fire than diamond.', { f: 'ZnS', sys: 'Cubic', h: [3.5, 4], lus: 'Resinous to adamantine', streak: ['Pale yellow-brown', '#d8c49a'], sg: '4.0', loc: 'Picos de Europa, Spain', habit: 'tetrahedron', mat: 'clear', pat: 'none', col: '#c8601c', mtx: '#d0c8b8', ior: 2.37, disp: .156, bg: [.148, .04, 66], accent: [57, .166, .783], second: [24, .114], chroma: .12, warm: .5 }],
  ['Cinnabar', 'sulfides', 'Scarlet crystals of mercury sulfide. People ground it into the red pigment vermilion.', { f: 'HgS', sys: 'Trigonal', h: [2, 2.5], lus: 'Adamantine', streak: ['Scarlet', '#c0301e'], sg: '8.1', loc: 'Hunan, China', habit: 'rhombohedron', mat: 'trans', pat: 'none', col: '#c4231f', mtx: '#ece6da', ior: 2.9, bg: [.16, .045, 28], accent: [28, .18, .68], second: [80, .05], chroma: .13, warm: .45 }],
  ['Chalcopyrite', 'sulfides', 'Brass-yellow copper ore, deeper in color than pyrite. The surface often tarnishes to blue and purple.', { f: 'CuFeS₂', sys: 'Tetragonal', h: [3.5, 4], lus: 'Metallic', streak: ['Greenish black', '#26281e'], sg: '4.2', loc: 'Cornwall, England', habit: 'tetrahedron', mat: 'metal', pat: 'iridescent', col: '#c8aa3c', mtx: '#d8d4cc', bg: [.16, .028, 112], accent: [106, .13, .82], second: [295, .1], chroma: .11, warm: .4 }],
  ['Bornite', 'sulfides', 'A copper ore that tarnishes to purple, blue and gold. Miners call it peacock ore.', { f: 'Cu₅FeS₄', sys: 'Orthorhombic', h: [3, 3], lus: 'Metallic', streak: ['Grayish black', '#2c2a2c'], sg: '5.1', loc: 'Butte, Montana, USA', habit: 'massive', mat: 'metal', pat: 'iridescent', col: '#8c5a7c', bg: [.13, .03, 235], accent: [300, .15, .72], second: [70, .12], chroma: .12, warm: .1 }],
  ['Stibnite', 'sulfides', 'Long, steel-gray blades of antimony sulfide. The blades bend and twist, and they melt in a candle flame.', { f: 'Sb₂S₃', sys: 'Orthorhombic', h: [2, 2], lus: 'Metallic', streak: ['Lead gray', '#5a5e64'], sg: '4.6', loc: 'Jiangxi, China', habit: 'blades', mat: 'metal', pat: 'none', col: '#a6abb2', mtx: '#d8d0c0', bg: [.149, .025, 217], accent: [218, .02, .819], second: [103, .09], chroma: .09, warm: .25 }],
  ['Realgar', 'sulfides', 'Orange-red crystals of arsenic sulfide. Light slowly breaks it down into a yellow powder.', { f: 'As₄S₄', sys: 'Monoclinic', h: [1.5, 2], lus: 'Resinous', streak: ['Orange-red', '#e0602c'], sg: '3.56', loc: 'Shimen, Hunan, China', habit: 'prism', mat: 'trans', pat: 'none', col: '#d4461e', mtx: '#e0d8c8', ior: 2.6, bg: [.186, .043, 49], accent: [44, .15, .714], second: [98, .145], chroma: .12, warm: .5 }],
  ['Orpiment', 'sulfides', 'Golden-yellow arsenic sulfide with a pearly shine. Painters once used it as a yellow pigment.', { f: 'As₂S₃', sys: 'Monoclinic', h: [1.5, 2], lus: 'Resinous to pearly', streak: ['Pale yellow', '#f0dc8a'], sg: '3.49', loc: 'Twin Creeks Mine, Nevada, USA', habit: 'prism', mat: 'trans', pat: 'none', col: '#e8a028', mtx: '#7a6a58', ior: 2.4, bg: [.179, .035, 73], accent: [80, .14, .806], second: [33, .133], chroma: .12, warm: .5 }],
  ['Molybdenite', 'sulfides', 'Soft, blue-gray hexagonal plates. It looks like graphite but leaves a greenish streak on glazed porcelain.', { f: 'MoS₂', sys: 'Hexagonal', h: [1, 1.5], lus: 'Metallic', streak: ['Bluish gray', '#6a7078'], sg: '4.7', loc: 'Quebec, Canada', habit: 'books', mat: 'metal', pat: 'none', col: '#9ca3ae', mtx: '#e0dcd4', bg: [.133, .022, 242], accent: [243, .08, .817], second: [151, .074], chroma: .09, warm: .2 }],
  ['Covellite', 'sulfides', 'Thin indigo plates of copper sulfide with a purple shine.', { f: 'CuS', sys: 'Hexagonal', h: [1.5, 2], lus: 'Submetallic', streak: ['Lead gray to black', '#2c2e34'], sg: '4.6', loc: 'Sardinia, Italy', habit: 'books', mat: 'metal', pat: 'iridescent', col: '#2d3d92', mtx: '#8a8478', bg: [.13, .04, 278], accent: [278, .12, .7], second: [320, .12], chroma: .12, warm: .1 }],

  // Oxides and hydroxides
  ['Hematite', 'oxides', 'Iron oxide that looks steel-gray but leaves a red streak. Rounded masses are called kidney ore.', { f: 'Fe₂O₃', sys: 'Trigonal', h: [5, 6.5], lus: 'Metallic to earthy', streak: ['Reddish brown', '#8a2c22'], sg: '5.3', loc: 'Cumbria, England', habit: 'botryoidal', mat: 'metal', pat: 'none', col: '#4c4d55', col2: '#7a2a20', bg: [.142, .019, 24], accent: [24, .139, .712], second: [241, .038], chroma: .11, warm: .35 }],
  ['Magnetite', 'oxides', 'Black octahedrons of iron oxide. It is the most magnetic natural mineral.', { f: 'Fe₃O₄', sys: 'Cubic', h: [5.5, 6.5], lus: 'Metallic', streak: ['Black', '#141416'], sg: '5.2', loc: 'Kiruna, Sweden', habit: 'octahedron', mat: 'metal', pat: 'none', col: '#2e2f34', mtx: '#d8d0c4', bg: [.121, .01, 195], accent: [192, .036, .85], second: [21, .05], chroma: .09, warm: .2 }],
  ['Ruby', 'oxides', 'The red variety of corundum. Chromium gives the color and a red glow under ultraviolet light.', { f: 'Al₂O₃', sys: 'Trigonal', h: [9, 9], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '4.0', loc: 'Mogok, Myanmar', note: 'Variety of corundum', habit: 'barrel', mat: 'clear', pat: 'none', col: '#b8102e', mtx: '#e8e4dc', gem: true, ior: 1.77, disp: .018, bg: [.16, .05, 18], accent: [18, .19, .66], second: [335, .12], chroma: .13, warm: .3 }],
  ['Sapphire', 'oxides', 'Corundum in every color but red. Iron and titanium give the classic blue.', { f: 'Al₂O₃', sys: 'Trigonal', h: [9, 9], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '4.0', loc: 'Ratnapura, Sri Lanka', note: 'Variety of corundum', habit: 'barrel', mat: 'clear', pat: 'none', col: '#1d3ca8', mtx: '#d8d4cc', gem: true, ior: 1.77, disp: .018, bg: [.136, .045, 261], accent: [257, .157, .67], second: [212, .096], chroma: .12, warm: .1 }],
  ['Spinel', 'oxides', 'Bright pink and red octahedrons. In old crowns, people mistook large spinels for rubies.', { f: 'MgAl₂O₄', sys: 'Cubic', h: [7.5, 8], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '3.6', loc: 'Mahenge, Tanzania', habit: 'octahedron', mat: 'clear', pat: 'none', col: '#d8205e', mtx: '#ece8e0', gem: true, ior: 1.72, disp: .02, bg: [.17, .05, 0], accent: [0, .19, .72], second: [300, .1], chroma: .13, warm: .25 }],
  ['Rutile', 'oxides', 'Golden needles of titanium oxide. Here they grow as stars on a plate of hematite.', { f: 'TiO₂', sys: 'Tetragonal', h: [6, 6.5], lus: 'Adamantine to submetallic', streak: ['Light brown', '#b89070'], sg: '4.2', loc: 'Bahia, Brazil', habit: 'star', mat: 'trans', pat: 'none', col: '#d08a32', mtx: '#2e2e34', ior: 2.6, bg: [.116, .011, 48], accent: [74, .128, .828], second: [18, .081], chroma: .12, warm: .5 }],
  ['Cassiterite', 'oxides', 'Heavy, dark brown crystals with a bright shine. It is the main ore of tin.', { f: 'SnO₂', sys: 'Tetragonal', h: [6, 7], lus: 'Adamantine to submetallic', streak: ['White to light brown', '#e0d4c4'], sg: '6.9', loc: 'Viloco, Bolivia', habit: 'dipyramid', mat: 'clear', pat: 'none', col: '#3e2214', mtx: '#c4beb4', ior: 2.0, disp: .071, bg: [.115, .013, 41], accent: [47, .079, .721], second: [188, .08], chroma: .1, warm: .55 }],
  ['Alexandrite', 'oxides', 'A rare chrysoberyl that changes color. It is green in daylight and red under lamp light.', { f: 'BeAl₂O₄', sys: 'Orthorhombic', h: [8.5, 8.5], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '3.7', loc: 'Ural Mountains, Russia', note: 'Variety of chrysoberyl', habit: 'barrel', mat: 'clear', pat: 'none', col: '#8e1e4a', col2: '#1f7a62', mtx: '#6a6458', gem: true, ior: 1.75, disp: .015, bg: [.13, .03, 345], accent: [10, .14, .66], second: [165, .11], chroma: .12, warm: .2, day: { hue: 165, accent: [165, .12], second: [350, .14] } }],
  ['Cuprite', 'oxides', 'Deep red octahedrons of copper oxide. Thin edges glow red when light shines through.', { f: 'Cu₂O', sys: 'Cubic', h: [3.5, 4], lus: 'Adamantine to submetallic', streak: ['Brownish red', '#7a2a22'], sg: '6.1', loc: 'Onganja, Namibia', habit: 'octahedron', mat: 'clear', pat: 'none', col: '#5a0c10', mtx: '#3c6a4a', ior: 2.85, bg: [.115, .054, 20], accent: [21, .16, .636], second: [152, .102], chroma: .12, warm: .4 }],
  ['Goethite', 'oxides', 'Iron hydroxide in dark, velvety bubbles. It colors rust, ochre and many brown soils.', { f: 'FeO(OH)', sys: 'Orthorhombic', h: [5, 5.5], lus: 'Adamantine to silky', streak: ['Yellowish brown', '#a07a3a'], sg: '4.3', loc: 'Siegerland, Germany', habit: 'botryoidal', mat: 'opaque', pat: 'sheen', col: '#3e2c1c', col2: '#a8783a', bg: [.14, .028, 51], accent: [62, .104, .695], second: [109, .083], chroma: .1, warm: .55 }],

  // Halides
  ['Fluorite', 'halides', 'Cubes of calcium fluoride in purple, green and yellow. It gave its name to fluorescence.', { f: 'CaF₂', sys: 'Cubic', h: [4, 4], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '3.18', loc: 'Illinois, USA', habit: 'cube', mat: 'clear', pat: 'zoned', col: '#7a3cb8', col2: '#3c9c72', mtx: '#d8ccb4', ior: 1.43, bg: [.16, .035, 292], accent: [292, .14, .74], second: [150, .12], chroma: .12, warm: .1 }],
  ['Halite', 'halides', 'Rock salt. Microbes in salt lakes color the cubes pink.', { f: 'NaCl', sys: 'Cubic', h: [2, 2.5], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.17', loc: 'Searles Lake, California, USA', habit: 'cube', mat: 'clear', pat: 'none', col: '#f2c4cf', mtx: '#e8e0d4', ior: 1.54, bg: [.153, .01, 19], accent: [12, .053, .92], second: [218, .06], chroma: .1, warm: .25 }],
  ['Atacamite', 'halides', 'Dark green crystals of copper chloride. It forms where copper ore meets salty desert water.', { f: 'Cu₂Cl(OH)₃', sys: 'Orthorhombic', h: [3, 3.5], lus: 'Adamantine to vitreous', streak: ['Apple green', '#7ac080'], sg: '3.75', loc: 'Atacama Desert, Chile', habit: 'acicular', mat: 'trans', pat: 'none', col: '#1b6c4a', mtx: '#b8a890', ior: 1.86, bg: [.148, .04, 171], accent: [168, .108, .664], second: [53, .11], chroma: .12, warm: .2 }],

  // Carbonates
  ['Calcite', 'carbonates', 'Calcium carbonate in many shapes, here as golden pointed crystals. A clear piece shows a double image.', { f: 'CaCO₃', sys: 'Trigonal', h: [3, 3], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.71', loc: 'Elmwood Mine, Tennessee, USA', habit: 'scalenohedron', mat: 'clear', pat: 'none', col: '#ecbc64', mtx: '#6a625a', ior: 1.6, disp: .017, bg: [.196, .027, 87], accent: [90, .102, .858], second: [238, .089], chroma: .11, warm: .45 }],
  ['Aragonite', 'carbonates', 'The same chemistry as calcite in another structure. Its twins form six-sided columns.', { f: 'CaCO₃', sys: 'Orthorhombic', h: [3.5, 4], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.95', loc: 'Molina de Aragón, Spain', habit: 'beryl', mat: 'trans', pat: 'none', col: '#a8584a', mtx: '#b89a7a', bg: [.14, .024, 26], accent: [22, .116, .698], second: [128, .05], chroma: .11, warm: .5 }],
  ['Malachite', 'carbonates', 'Green copper carbonate in rounded masses. A cut face shows bands in many shades of green.', { f: 'Cu₂CO₃(OH)₂', sys: 'Monoclinic', h: [3.5, 4], lus: 'Silky to dull', streak: ['Light green', '#8ac8a0'], sg: '4.0', loc: 'Katanga, DR Congo', habit: 'botryoidal', mat: 'opaque', pat: 'banded', col: '#1f8c5c', col2: '#0b3c26', bg: [.14, .055, 150], accent: [145, .17, .68], second: [180, .1], chroma: .12, warm: .15 }],
  ['Azurite', 'carbonates', 'Deep blue copper carbonate. Over time, it can change into green malachite.', { f: 'Cu₃(CO₃)₂(OH)₂', sys: 'Monoclinic', h: [3.5, 4], lus: 'Vitreous', streak: ['Light blue', '#8aa8e0'], sg: '3.77', loc: 'Chessy, France', habit: 'prism', mat: 'trans', pat: 'none', col: '#1a2e90', mtx: '#6a5a4c', ior: 1.76, bg: [.115, .056, 273], accent: [269, .16, .669], second: [152, .111], chroma: .12, warm: .1 }],
  ['Rhodochrosite', 'carbonates', 'Manganese carbonate in raspberry-red rhombs. Stalactites from Argentina show pink bands.', { f: 'MnCO₃', sys: 'Trigonal', h: [3.5, 4], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '3.7', loc: 'Sweet Home Mine, Colorado, USA', habit: 'rhombohedron', mat: 'clear', pat: 'banded', col: '#d4485e', col2: '#f2c8cc', mtx: '#c8c2b8', ior: 1.7, bg: [.186, .043, 9], accent: [13, .147, .756], second: [78, .064], chroma: .12, warm: .3 }],
  ['Smithsonite', 'carbonates', 'Zinc carbonate in soft, rounded masses with a pearly shine. Its name honors James Smithson.', { f: 'ZnCO₃', sys: 'Trigonal', h: [4, 4.5], lus: 'Vitreous to pearly', streak: ['White', '#f4f4f4'], sg: '4.4', loc: 'Kelly Mine, New Mexico, USA', habit: 'botryoidal', mat: 'trans', pat: 'none', col: '#7cc4b8', bg: [.19, .025, 180], accent: [182, .08, .86], second: [330, .1], chroma: .1, warm: .15 }],
  ['Cerussite', 'carbonates', 'Heavy lead carbonate with a diamond-like shine. Its crystals twin into star-shaped clusters.', { f: 'PbCO₃', sys: 'Orthorhombic', h: [3, 3.5], lus: 'Adamantine', streak: ['White', '#f4f4f4'], sg: '6.55', loc: 'Tsumeb, Namibia', habit: 'sixling', mat: 'clear', pat: 'none', col: '#eef0ee', mtx: '#7a6a58', ior: 2.0, disp: .055, bg: [.141, .018, 84], accent: [86, .059, .865], second: [244, .083], chroma: .1, warm: .2 }],

  // Sulfates and related minerals
  ['Selenite', 'sulfates', 'Clear, soft blades of gypsum. Selenite crystals in the Naica cave in Mexico are more than 10 meters long.', { f: 'CaSO₄·2H₂O', sys: 'Monoclinic', h: [2, 2], lus: 'Vitreous to pearly', streak: ['White', '#f4f4f4'], sg: '2.3', loc: 'Naica, Chihuahua, Mexico', note: 'Variety of gypsum', habit: 'blades', mat: 'clear', pat: 'none', col: '#f2eee4', mtx: '#a8988a', ior: 1.52, bg: [.196, .011, 97], accent: [88, .027, .879], second: [19, .09], chroma: .1, warm: .35 }],
  ['Barite', 'sulfates', 'Heavy barium sulfate in golden plates. A small crystal feels very heavy in the hand.', { f: 'BaSO₄', sys: 'Orthorhombic', h: [3, 3.5], lus: 'Vitreous to pearly', streak: ['White', '#f4f4f4'], sg: '4.5', loc: 'Elk Creek, South Dakota, USA', habit: 'tabular', mat: 'clear', pat: 'none', col: '#dca44a', mtx: '#5a5048', ior: 1.64, bg: [.13, .032, 73], accent: [67, .095, .84], second: [219, .08], chroma: .11, warm: .45 }],
  ['Celestine', 'sulfates', 'Sky-blue strontium sulfate that lines geodes. Strontium makes the red color of fireworks.', { f: 'SrSO₄', sys: 'Orthorhombic', h: [3, 3.5], lus: 'Vitreous to pearly', streak: ['White', '#f4f4f4'], sg: '3.95', loc: 'Sakoany, Madagascar', habit: 'geode', mat: 'clear', pat: 'none', col: '#a8c8ea', mtx: '#c8bca8', ior: 1.62, bg: [.2, .02, 251], accent: [236, .1, .875], second: [95, .107], chroma: .1, warm: .15 }],
  ['Chalcanthite', 'sulfates', 'Vivid blue copper sulfate. It dissolves in water, so collectors keep it dry.', { f: 'CuSO₄·5H₂O', sys: 'Triclinic', h: [2.5, 2.5], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.28', loc: 'Chuquicamata, Chile', habit: 'prism', mat: 'clear', pat: 'none', col: '#1a6ad6', mtx: '#c8c0b4', ior: 1.54, bg: [.135, .046, 228], accent: [226, .144, .744], second: [203, .106], chroma: .12, warm: .1 }],
  ['Wulfenite', 'sulfates', 'Thin, square orange plates of lead molybdate. Some plates are as thin as paper.', { f: 'PbMoO₄', sys: 'Tetragonal', h: [2.75, 3], lus: 'Adamantine to resinous', streak: ['White', '#f4f4f4'], sg: '6.8', loc: 'Red Cloud Mine, Arizona, USA', habit: 'tabular', mat: 'clear', pat: 'none', col: '#e6721a', mtx: '#8a6a50', ior: 2.3, disp: .2, bg: [.18, .04, 58], accent: [56, .16, .76], second: [100, .1], chroma: .12, warm: .5 }],
  ['Crocoite', 'sulfates', 'Bright orange-red needles of lead chromate. Chemists found the element chromium in it.', { f: 'PbCrO₄', sys: 'Monoclinic', h: [2.5, 3], lus: 'Adamantine', streak: ['Orange-yellow', '#f0a040'], sg: '6.0', loc: 'Dundas, Tasmania, Australia', habit: 'acicular', mat: 'trans', pat: 'none', col: '#e4481a', mtx: '#5a4a3e', ior: 2.4, bg: [.165, .05, 37], accent: [40, .198, .741], second: [206, .085], chroma: .13, warm: .5 }],
  ['Scheelite', 'sulfates', 'Golden calcium tungstate. It glows bright blue under short-wave ultraviolet light.', { f: 'CaWO₄', sys: 'Tetragonal', h: [4.5, 5], lus: 'Vitreous to adamantine', streak: ['White', '#f4f4f4'], sg: '6.1', loc: 'Sichuan, China', habit: 'dipyramid', mat: 'clear', pat: 'none', col: '#e09a3c', mtx: '#d8d4cc', ior: 1.92, disp: .038, bg: [.165, .032, 64], accent: [66, .156, .786], second: [251, .148], chroma: .12, warm: .4 }],

  // Phosphates, arsenates and vanadates
  ['Apatite', 'phosphates', 'Hexagonal crystals of calcium phosphate. Bones and teeth are made of a form of apatite.', { f: 'Ca₅(PO₄)₃(F,Cl,OH)', sys: 'Hexagonal', h: [5, 5], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '3.2', loc: 'Madagascar', habit: 'beryl', mat: 'clear', pat: 'none', col: '#1ea8ba', mtx: '#d8d0c0', gem: true, ior: 1.63, disp: .013, bg: [.123, .038, 221], accent: [196, .162, .767], second: [107, .108], chroma: .12, warm: .1 }],
  ['Turquoise', 'phosphates', 'Sky-blue copper aluminum phosphate. Dark veins of the host rock make a spiderweb pattern.', { f: 'CuAl₆(PO₄)₄(OH)₈·4H₂O', sys: 'Triclinic', h: [5, 6], lus: 'Waxy', streak: ['Bluish white', '#d8eaea'], sg: '2.7', loc: 'Nishapur, Iran', habit: 'massive', mat: 'opaque', pat: 'web', col: '#52b8b0', col2: '#4a3828', bg: [.16, .035, 200], accent: [196, .12, .78], second: [50, .08], chroma: .11, warm: .2 }],
  ['Vanadinite', 'phosphates', 'Red hexagonal barrels of lead vanadate. It is a source of vanadium for steel.', { f: 'Pb₅(VO₄)₃Cl', sys: 'Hexagonal', h: [3, 4], lus: 'Resinous to adamantine', streak: ['Pale yellow', '#ecd8a0'], sg: '6.9', loc: 'Mibladen, Morocco', habit: 'barrel', mat: 'trans', pat: 'none', col: '#c8301c', mtx: '#a88a6a', ior: 2.35, bg: [.18, .055, 34], accent: [36, .17, .7], second: [60, .06], chroma: .13, warm: .45 }],
  ['Pyromorphite', 'phosphates', 'Bright green barrels of lead phosphate. A melted bead turns back into crystals as it cools.', { f: 'Pb₅(PO₄)₃Cl', sys: 'Hexagonal', h: [3.5, 4], lus: 'Resinous', streak: ['White', '#f4f4f4'], sg: '7.0', loc: 'Bunker Hill Mine, Idaho, USA', habit: 'barrel', mat: 'trans', pat: 'none', col: '#78b828', mtx: '#6a5a48', ior: 2.05, bg: [.13, .047, 119], accent: [130, .17, .688], second: [38, .091], chroma: .12, warm: .3 }],
  ['Variscite', 'phosphates', 'Apple-green aluminum phosphate. Nodules from Utah show a web of dark veins.', { f: 'AlPO₄·2H₂O', sys: 'Orthorhombic', h: [3.5, 4.5], lus: 'Waxy', streak: ['White', '#f4f4f4'], sg: '2.5', loc: 'Utah, USA', habit: 'massive', mat: 'opaque', pat: 'web', col: '#6cbc88', col2: '#5a4a34', bg: [.147, .024, 133], accent: [137, .098, .78], second: [60, .073], chroma: .1, warm: .25 }],
  ['Adamite', 'phosphates', 'Lime-green fans of zinc arsenate. It glows bright green under ultraviolet light.', { f: 'Zn₂(AsO₄)(OH)', sys: 'Orthorhombic', h: [3.5, 3.5], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '4.4', loc: 'Mapimí, Durango, Mexico', habit: 'acicular', mat: 'clear', pat: 'none', col: '#c4d434', mtx: '#a85a2c', ior: 1.74, bg: [.16, .03, 125], accent: [113, .149, .748], second: [45, .13], chroma: .12, warm: .3 }],
  ['Vivianite', 'phosphates', 'Clear blue-green blades of iron phosphate. Light slowly darkens the crystals.', { f: 'Fe₃(PO₄)₂·8H₂O', sys: 'Monoclinic', h: [1.5, 2], lus: 'Vitreous to pearly', streak: ['White, turns blue', '#e8eef4'], sg: '2.7', loc: 'Bolivia', habit: 'blades', mat: 'clear', pat: 'none', col: '#1c5c5a', mtx: '#8a8478', ior: 1.6, bg: [.123, .025, 180], accent: [182, .087, .725], second: [257, .08], chroma: .1, warm: .1 }],
  ['Wavellite', 'phosphates', 'Green balls of radiating needles. A broken ball shows a star on each face.', { f: 'Al₃(PO₄)₂(OH,F)₃·5H₂O', sys: 'Orthorhombic', h: [3.5, 4], lus: 'Vitreous to pearly', streak: ['White', '#f4f4f4'], sg: '2.36', loc: 'Arkansas, USA', habit: 'botryoidal', mat: 'trans', pat: 'radial', col: '#8cd06a', mtx: '#c8c4bc', bg: [.199, .02, 138], accent: [130, .103, .835], second: [111, .109], chroma: .11, warm: .25 }],
  ['Erythrite', 'phosphates', 'Crimson-pink sprays of cobalt arsenate. Miners called it cobalt bloom.', { f: 'Co₃(AsO₄)₂·8H₂O', sys: 'Monoclinic', h: [1.5, 2.5], lus: 'Adamantine to pearly', streak: ['Pale red', '#e8a0b0'], sg: '3.06', loc: 'Bou Azzer, Morocco', habit: 'acicular', mat: 'trans', pat: 'none', col: '#c43a78', mtx: '#5a524c', ior: 1.68, bg: [.15, .05, 345], accent: [342, .16, .7], second: [100, .07], chroma: .12, warm: .2 }],

  // Island and group silicates
  ['Peridot', 'island', 'The gem variety of olivine. It forms deep in the mantle, and lava brings it up.', { f: '(Mg,Fe)₂SiO₄', sys: 'Orthorhombic', h: [6.5, 7], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '3.3', loc: 'Zabargad Island, Egypt', note: 'Variety of forsterite', habit: 'prism', mat: 'clear', pat: 'none', col: '#94bc2a', mtx: '#3a3634', gem: true, ior: 1.67, disp: .02, bg: [.182, .042, 125], accent: [129, .159, .832], second: [80, .091], chroma: .12, warm: .3 }],
  ['Almandine', 'island', 'The common deep red garnet. It forms twelve-sided crystals in schist.', { f: 'Fe₃Al₂(SiO₄)₃', sys: 'Cubic', h: [7, 7.5], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '4.3', loc: 'Wrangell, Alaska, USA', habit: 'dodecahedron', mat: 'clear', pat: 'none', col: '#6a0e24', mtx: '#5c5a58', gem: true, ior: 1.79, disp: .024, bg: [.13, .04, 8], accent: [8, .14, .64], second: [60, .07], chroma: .12, warm: .3 }],
  ['Spessartine', 'island', 'Manganese garnet in bright mandarin orange. The best crystals grow on smoky quartz.', { f: 'Mn₃Al₂(SiO₄)₃', sys: 'Cubic', h: [6.5, 7.5], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '4.2', loc: 'Fujian, China', habit: 'dodecahedron', mat: 'clear', pat: 'none', col: '#e2601c', mtx: '#4a3c32', gem: true, ior: 1.8, disp: .027, bg: [.13, .046, 36], accent: [47, .18, .735], second: [60, .049], chroma: .12, warm: .5 }],
  ['Uvarovite', 'island', 'Chromium garnet in tiny emerald-green crystals. It covers rock as a sparkly crust.', { f: 'Ca₃Cr₂(SiO₄)₃', sys: 'Cubic', h: [6.5, 7], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '3.6', loc: 'Ural Mountains, Russia', habit: 'druse', mat: 'clear', pat: 'none', col: '#147a3c', mtx: '#3a3632', ior: 1.86, bg: [.148, .048, 142], accent: [142, .16, .76], second: [33, .04], chroma: .12, warm: .2 }],
  ['Topaz', 'island', 'A hard aluminum silicate. Imperial topaz from Brazil is golden orange with a pink hint.', { f: 'Al₂SiO₄(F,OH)₂', sys: 'Orthorhombic', h: [8, 8], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '3.5', loc: 'Ouro Preto, Brazil', habit: 'prism', mat: 'clear', pat: 'none', col: '#e89a54', mtx: '#c8c0b8', gem: true, ior: 1.62, disp: .014, bg: [.18, .035, 45], accent: [52, .13, .8], second: [350, .1], chroma: .12, warm: .45 }],
  ['Zircon', 'island', 'One of the oldest minerals on Earth, up to 4.4 billion years old. It has a bright, diamond-like shine.', { f: 'ZrSiO₄', sys: 'Tetragonal', h: [7.5, 7.5], lus: 'Adamantine', streak: ['White', '#f4f4f4'], sg: '4.7', loc: 'Ratanakiri, Cambodia', habit: 'dipyramid', mat: 'clear', pat: 'none', col: '#b8502c', mtx: '#d0c8bc', gem: true, ior: 1.95, disp: .039, bg: [.125, .037, 37], accent: [40, .11, .709], second: [235, .08], chroma: .12, warm: .4 }],
  ['Kyanite', 'island', 'Blue blades of aluminum silicate. It is soft along the blade and hard across it.', { f: 'Al₂SiO₅', sys: 'Triclinic', h: [4.5, 7], lus: 'Vitreous to pearly', streak: ['White', '#f4f4f4'], sg: '3.6', loc: 'Minas Gerais, Brazil', habit: 'blades', mat: 'trans', pat: 'streaked', col: '#2e5ab4', col2: '#d8e0ec', mtx: '#c8c0b0', ior: 1.72, bg: [.167, .036, 248], accent: [252, .13, .73], second: [205, .067], chroma: .12, warm: .1 }],
  ['Staurolite', 'island', 'Brown crystals that twin into crosses. People call them fairy crosses.', { f: 'Fe₂Al₉Si₄O₂₃(OH)', sys: 'Monoclinic', h: [7, 7.5], lus: 'Vitreous to resinous', streak: ['Gray-white', '#e0dcd8'], sg: '3.7', loc: 'Georgia, USA', habit: 'cross', mat: 'opaque', pat: 'none', col: '#5c3222', mtx: '#a49a8c', bg: [.18, .016, 35], accent: [32, .078, .749], second: [113, .071], chroma: .1, warm: .55 }],
  ['Titanite', 'island', 'Yellow-green wedges of calcium titanium silicate. Its fire is stronger than that of diamond.', { f: 'CaTiSiO₅', sys: 'Monoclinic', h: [5, 5.5], lus: 'Adamantine', streak: ['White', '#f4f4f4'], sg: '3.5', loc: 'Pakistan', habit: 'wedge', mat: 'clear', pat: 'none', col: '#a8c43c', mtx: '#d0ccc4', gem: true, ior: 1.95, disp: .051, bg: [.2, .025, 115], accent: [105, .163, .9], second: [-5, .117], chroma: .12, warm: .3 }],
  ['Epidote', 'island', 'Pistachio-green striated prisms. It forms when heat and water change rock.', { f: 'Ca₂(Al₂Fe)(SiO₄)(Si₂O₇)O(OH)', sys: 'Monoclinic', h: [6, 7], lus: 'Vitreous', streak: ['Grayish white', '#e4e4e0'], sg: '3.4', loc: 'Knappenwand, Austria', habit: 'prism', mat: 'clear', pat: 'none', col: '#5a7c26', mtx: '#c8c0b0', ior: 1.75, bg: [.135, .038, 102], accent: [100, .115, .763], second: [29, .065], chroma: .11, warm: .35 }],
  ['Tanzanite', 'island', 'The violet-blue variety of zoisite. It comes from only one place: the Merelani Hills of Tanzania.', { f: 'Ca₂Al₃(SiO₄)(Si₂O₇)O(OH)', sys: 'Orthorhombic', h: [6, 7], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '3.35', loc: 'Merelani Hills, Tanzania', note: 'Variety of zoisite', habit: 'prism', mat: 'clear', pat: 'none', col: '#4a38b4', mtx: '#7a7268', gem: true, ior: 1.7, disp: .021, bg: [.15, .05, 284], accent: [284, .16, .7], second: [335, .1], chroma: .12, warm: .1 }],

  // Ring silicates
  ['Emerald', 'ring', 'The green variety of beryl. Chromium and vanadium give the color.', { f: 'Be₃Al₂Si₆O₁₈', sys: 'Hexagonal', h: [7.5, 8], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.7', loc: 'Muzo, Colombia', note: 'Variety of beryl', habit: 'beryl', mat: 'clear', pat: 'none', col: '#0e8a52', mtx: '#e8e2d6', gem: true, ior: 1.58, disp: .014, bg: [.16, .052, 160], accent: [161, .143, .759], second: [91, .075], chroma: .12, warm: .15 }],
  ['Aquamarine', 'ring', 'The sea-blue variety of beryl. Iron gives the color.', { f: 'Be₃Al₂Si₆O₁₈', sys: 'Hexagonal', h: [7.5, 8], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.7', loc: 'Shigar Valley, Pakistan', note: 'Variety of beryl', habit: 'beryl', mat: 'clear', pat: 'none', col: '#8ed0e2', mtx: '#e8e4dc', gem: true, ior: 1.58, disp: .014, bg: [.164, .031, 208], accent: [205, .085, .853], second: [240, .078], chroma: .11, warm: .1 }],
  ['Morganite', 'ring', 'The peach-pink variety of beryl. Manganese gives the color.', { f: 'Be₃Al₂Si₆O₁₈', sys: 'Hexagonal', h: [7.5, 8], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.8', loc: 'Pala, California, USA', note: 'Variety of beryl', habit: 'beryl', mat: 'clear', pat: 'none', col: '#f2b0a2', mtx: '#e0dad0', gem: true, ior: 1.59, disp: .014, bg: [.197, .04, 21], accent: [28, .12, .842], second: [198, .048], chroma: .11, warm: .35 }],
  ['Watermelon Tourmaline', 'ring', 'Elbaite with a pink core and a green rim. A cut slice looks like a watermelon.', { f: 'Na(Li₁.₅Al₁.₅)Al₆(Si₆O₁₈)(BO₃)₃(OH)₄', sys: 'Trigonal', h: [7, 7.5], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '3.05', loc: 'Minas Gerais, Brazil', note: 'Variety of elbaite', habit: 'prism3', mat: 'clear', pat: 'zoned', col: '#e0407c', col2: '#2a8a4c', mtx: '#e4e0d8', ior: 1.63, disp: .017, bg: [.15, .035, 140], accent: [355, .16, .72], second: [145, .14], chroma: .13, warm: .2 }],
  ['Schorl', 'ring', 'Black tourmaline in long striated prisms. It is the most common tourmaline.', { f: 'NaFe₃Al₆(Si₆O₁₈)(BO₃)₃(OH)₄', sys: 'Trigonal', h: [7, 7.5], lus: 'Vitreous', streak: ['Gray-white', '#e0e0e4'], sg: '3.2', loc: 'Erongo, Namibia', habit: 'prism3', mat: 'opaque', pat: 'none', col: '#121214', mtx: '#e2ddd4', bg: [.12, .006, 300], accent: [80, .04, .9], second: [300, .05], chroma: .09, warm: .25 }],
  ['Dioptase', 'ring', 'Intense blue-green copper silicate. Early miners thought it was emerald.', { f: 'CuSiO₃·H₂O', sys: 'Trigonal', h: [5, 5], lus: 'Vitreous', streak: ['Pale greenish blue', '#a0d8cc'], sg: '3.3', loc: 'Altyn-Tyube, Kazakhstan', habit: 'rhombohedron', mat: 'clear', pat: 'none', col: '#0d7868', mtx: '#e0d8c8', ior: 1.67, disp: .036, bg: [.12, .046, 180], accent: [180, .151, .746], second: [79, .092], chroma: .12, warm: .1 }],
  ['Sugilite', 'ring', 'Opaque purple silicate, rich in manganese. Geologists first found it in Japan in 1944.', { f: 'KNa₂(Fe,Mn,Al)₂Li₃Si₁₂O₃₀', sys: 'Hexagonal', h: [5.5, 6.5], lus: 'Vitreous to waxy', streak: ['White', '#f4f4f4'], sg: '2.75', loc: 'Wessels Mine, South Africa', habit: 'massive', mat: 'opaque', pat: 'mottled', col: '#7a2a7c', col2: '#3a1a3c', bg: [.14, .055, 325], accent: [322, .17, .7], second: [60, .07], chroma: .12, warm: .1 }],

  // Chain silicates
  ['Jadeite', 'chain', 'The rarer and harder of the two jades. The bright green kind is called imperial jade.', { f: 'NaAlSi₂O₆', sys: 'Monoclinic', h: [6.5, 7], lus: 'Vitreous to greasy', streak: ['White', '#f4f4f4'], sg: '3.3', loc: 'Hpakant, Myanmar', habit: 'massive', mat: 'trans', pat: 'mottled', col: '#26965a', col2: '#c8e0c8', bg: [.163, .04, 156], accent: [153, .124, .758], second: [299, .065], chroma: .12, warm: .15 }],
  ['Rhodonite', 'chain', 'Rose-pink manganese silicate with black veins. It is the state gem of Massachusetts.', { f: 'MnSiO₃', sys: 'Triclinic', h: [5.5, 6.5], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '3.6', loc: 'Broken Hill, Australia', habit: 'massive', mat: 'opaque', pat: 'veined', col: '#c8506a', col2: '#1c1618', bg: [.157, .026, 349], accent: [6, .116, .718], second: [248, .024], chroma: .12, warm: .3 }],
  ['Kunzite', 'chain', 'The lilac-pink variety of spodumene. Strong light can fade its color.', { f: 'LiAlSi₂O₆', sys: 'Monoclinic', h: [6.5, 7], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '3.2', loc: 'Nuristan, Afghanistan', note: 'Variety of spodumene', habit: 'blades', mat: 'clear', pat: 'none', col: '#e2a2d4', mtx: '#d8d2c8', gem: true, ior: 1.67, disp: .017, bg: [.196, .032, 335], accent: [333, .093, .844], second: [268, .085], chroma: .11, warm: .15 }],
  ['Charoite', 'chain', 'Lilac silicate with silky swirls. It is known from only one place, the Chara River in Siberia.', { f: 'K(Ca,Na)₂Si₄O₁₀(OH,F)·H₂O', sys: 'Monoclinic', h: [5, 6], lus: 'Vitreous to silky', streak: ['White', '#f4f4f4'], sg: '2.6', loc: 'Chara River, Siberia, Russia', habit: 'massive', mat: 'opaque', pat: 'swirl', col: '#8c4cb4', col2: '#d8c0e8', bg: [.19, .035, 300], accent: [300, .11, .82], second: [200, .05], chroma: .12, warm: .1 }],
  ['Larimar', 'chain', 'A sea-blue variety of pectolite. It is known from only one place, in the Dominican Republic.', { f: 'NaCa₂Si₃O₈(OH)', sys: 'Triclinic', h: [4.5, 5], lus: 'Silky to vitreous', streak: ['White', '#f4f4f4'], sg: '2.9', loc: 'Barahona, Dominican Republic', note: 'Variety of pectolite', habit: 'massive', mat: 'opaque', pat: 'mottled', col: '#68b8da', col2: '#eef4f6', bg: [.19, .033, 229], accent: [225, .091, .803], second: [185, .077], chroma: .11, warm: .1 }],

  // Sheet silicates
  ['Muscovite', 'sheet', 'Common mica. It splits into clear, flexible sheets that people once used as windows.', { f: 'KAl₂(AlSi₃O₁₀)(OH)₂', sys: 'Monoclinic', h: [2, 2.5], lus: 'Vitreous to pearly', streak: ['White', '#f4f4f4'], sg: '2.8', loc: 'Nellore, India', habit: 'books', mat: 'trans', pat: 'none', col: '#c8b890', mtx: '#e0dcd2', bg: [.2, .008, 76], accent: [82, .08, .8], second: [146, .077], chroma: .1, warm: .45 }],
  ['Lepidolite', 'sheet', 'Lilac lithium mica in scaly books. It is an ore of lithium.', { f: 'K(Li,Al)₃(Al,Si,Rb)₄O₁₀(F,OH)₂', sys: 'Monoclinic', h: [2.5, 3], lus: 'Pearly', streak: ['White', '#f4f4f4'], sg: '2.85', loc: 'Manitoba, Canada', habit: 'books', mat: 'trans', pat: 'none', col: '#b48ac8', mtx: '#e4dcd4', bg: [.172, .028, 319], accent: [315, .101, .85], second: [354, .11], chroma: .11, warm: .15 }],
  ['Chrysocolla', 'sheet', 'Blue-green hydrated copper silicate. It forms crusts and masses near copper ores.', { f: '(Cu,Al)₂H₂Si₂O₅(OH)₄·nH₂O', sys: 'Orthorhombic', h: [2.5, 3.5], lus: 'Vitreous to waxy', streak: ['Pale blue', '#c8e4ea'], sg: '2.2', loc: 'Ray Mine, Arizona, USA', habit: 'massive', mat: 'opaque', pat: 'mottled', col: '#26a2b4', col2: '#5a3c2a', bg: [.157, .037, 218], accent: [214, .133, .697], second: [150, .117], chroma: .12, warm: .15 }],
  ['Serpentine', 'sheet', 'Green magnesium silicate with a greasy shine. The name comes from its snake-like pattern.', { f: 'Mg₃Si₂O₅(OH)₄', sys: 'Monoclinic', h: [2.5, 4], lus: 'Greasy to waxy', streak: ['White', '#f4f4f4'], sg: '2.6', loc: 'Lizard Peninsula, England', habit: 'massive', mat: 'trans', pat: 'veined', col: '#8a9c3c', col2: '#2a3420', bg: [.14, .025, 115], accent: [110, .09, .72], second: [170, .06], chroma: .1, warm: .35 }],
  ['Talc', 'sheet', 'The softest mineral, 1 on the Mohs scale. It feels soapy, and it is the base of talcum powder.', { f: 'Mg₃Si₄O₁₀(OH)₂', sys: 'Monoclinic', h: [1, 1], lus: 'Pearly to greasy', streak: ['White', '#f4f4f4'], sg: '2.75', loc: 'Vermont, USA', habit: 'massive', mat: 'opaque', pat: 'sheen', col: '#d8e2d6', col2: '#b8c8b8', bg: [.198, .008, 149], accent: [148, .055, .94], second: [48, .035], chroma: .1, warm: .3 }],
  ['Apophyllite', 'sheet', 'Clear to pale green crystals with a pearly top face. They grow in holes in the lava rock of India.', { f: 'KCa₄Si₈O₂₀(F,OH)·8H₂O', sys: 'Tetragonal', h: [4.5, 5], lus: 'Vitreous to pearly', streak: ['White', '#f4f4f4'], sg: '2.35', loc: 'Jalgaon, India', habit: 'prism4', mat: 'clear', pat: 'none', col: '#c8ecd2', mtx: '#e8e0d4', ior: 1.54, bg: [.161, .018, 171], accent: [164, .087, .879], second: [102, .08], chroma: .11, warm: .25 }],
  ['Cavansite', 'sheet', 'Vivid blue balls of radiating crystals. Almost all good specimens come from Pune in India.', { f: 'Ca(VO)Si₄O₁₀·4H₂O', sys: 'Orthorhombic', h: [3, 4], lus: 'Vitreous to pearly', streak: ['Light blue', '#c0d8f0'], sg: '2.25', loc: 'Pune, India', habit: 'acicular', mat: 'trans', pat: 'none', col: '#1c78d2', mtx: '#e8c8a8', ior: 1.54, bg: [.146, .052, 238], accent: [245, .139, .749], second: [58, .07], chroma: .12, warm: .1 }],

  // Framework silicates
  ['Quartz', 'framework', 'Clear silicon dioxide. It is one of the most common minerals in the crust of the Earth.', { f: 'SiO₂', sys: 'Trigonal', h: [7, 7], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.65', loc: 'Hot Springs, Arkansas, USA', habit: 'prism6', mat: 'clear', pat: 'none', col: '#f6fafc', mtx: '#c8b8a4', ior: 1.54, disp: .013, bg: [.19, .02, 202], accent: [209, .034, .849], second: [63, .089], chroma: .1, warm: .2 }],
  ['Amethyst', 'framework', 'The purple variety of quartz. Iron and natural radiation give the color.', { f: 'SiO₂', sys: 'Trigonal', h: [7, 7], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.65', loc: 'Artigas, Uruguay', note: 'Variety of quartz', habit: 'geode', mat: 'clear', pat: 'none', col: '#7a2cb4', mtx: '#8a8478', gem: true, ior: 1.54, disp: .013, bg: [.14, .055, 302], accent: [302, .17, .7], second: [80, .08], chroma: .12, warm: .1 }],
  ['Citrine', 'framework', 'The yellow variety of quartz. Most citrine on the market is heated amethyst.', { f: 'SiO₂', sys: 'Trigonal', h: [7, 7], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.65', loc: 'Rio Grande do Sul, Brazil', note: 'Variety of quartz', habit: 'prism6', mat: 'clear', pat: 'none', col: '#eaa83a', mtx: '#d8d0c4', gem: true, ior: 1.54, disp: .013, bg: [.169, .046, 80], accent: [79, .164, .861], second: [296, .094], chroma: .12, warm: .5 }],
  ['Smoky Quartz', 'framework', 'Brown to gray quartz. Natural radiation darkens it over millions of years.', { f: 'SiO₂', sys: 'Trigonal', h: [7, 7], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.65', loc: 'Gotthard, Swiss Alps', note: 'Variety of quartz', habit: 'prism6', mat: 'clear', pat: 'none', col: '#6c4c34', mtx: '#d0ccc4', ior: 1.54, disp: .013, bg: [.168, .025, 47], accent: [55, .09, .742], second: [239, .055], chroma: .1, warm: .45 }],
  ['Rose Quartz', 'framework', 'Pink quartz that rarely forms crystals. Fine fibers in it give a soft, milky glow.', { f: 'SiO₂', sys: 'Trigonal', h: [7, 7], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.65', loc: 'Madagascar', note: 'Variety of quartz', habit: 'massive', mat: 'trans', pat: 'mottled', col: '#f0b4c2', col2: '#f8d8de', bg: [.184, .042, 353], accent: [350, .097, .81], second: [81, .051], chroma: .11, warm: .3 }],
  ['Agate', 'framework', 'Banded chalcedony that fills holes in lava. Each band is a layer of microscopic quartz.', { f: 'SiO₂', sys: 'Trigonal', h: [6.5, 7], lus: 'Waxy to vitreous', streak: ['White', '#f4f4f4'], sg: '2.6', loc: 'Lake Superior, USA', note: 'Variety of chalcedony', habit: 'massive', mat: 'trans', pat: 'banded', col: '#c0542a', col2: '#f0e4d4', bg: [.177, .024, 32], accent: [40, .119, .761], second: [248, .058], chroma: .12, warm: .5 }],
  ['Chrysoprase', 'framework', 'Apple-green chalcedony. Nickel gives the color.', { f: 'SiO₂', sys: 'Trigonal', h: [6.5, 7], lus: 'Waxy to vitreous', streak: ['White', '#f4f4f4'], sg: '2.6', loc: 'Queensland, Australia', note: 'Variety of chalcedony', habit: 'massive', mat: 'trans', pat: 'mottled', col: '#78d09a', col2: '#a8e4bc', bg: [.191, .042, 149], accent: [150, .109, .83], second: [83, .046], chroma: .11, warm: .2 }],
  ['Tiger’s Eye', 'framework', 'Quartz with fine fibers of iron oxide. The fibers make a band of light that moves as you turn the stone.', { f: 'SiO₂', sys: 'Trigonal', h: [6.5, 7], lus: 'Silky', streak: ['White to pale brown', '#e8dccc'], sg: '2.65', loc: 'Northern Cape, South Africa', note: 'Variety of quartz', habit: 'massive', mat: 'opaque', pat: 'chatoyant', col: '#b8862c', col2: '#4c3018', bg: [.137, .036, 58], accent: [69, .12, .756], second: [23, .088], chroma: .12, warm: .55 }],
  ['Opal', 'framework', 'Hydrated silica, a mineraloid with no crystals. Tiny spheres in it split light into flashes of color.', { f: 'SiO₂·nH₂O', sys: 'Amorphous', h: [5.5, 6.5], lus: 'Vitreous to waxy', streak: ['White', '#f4f4f4'], sg: '2.1', loc: 'Lightning Ridge, Australia', note: 'Mineraloid', habit: 'massive', mat: 'opaque', pat: 'opal', col: '#1a1e2c', col2: '#5a4a3a', bg: [.163, .01, 260], accent: [196, .136, .783], second: [326, .133], chroma: .12, warm: .1 }],
  ['Obsidian', 'framework', 'Volcanic glass, a mineraloid. The lava cooled so fast that no crystals could form.', { f: 'SiO₂ (glass)', sys: 'Amorphous', h: [5, 5.5], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.4', loc: 'Glass Buttes, Oregon, USA', note: 'Mineraloid', habit: 'massive', mat: 'opaque', pat: 'sheen', col: '#0f0f13', col2: '#5a4c78', bg: [.115, .007, 289], accent: [289, .063, .793], second: [134, .073], chroma: .1, warm: .15 }],
  ['Moonstone', 'framework', 'Feldspar with a blue glow that floats under the surface. Thin layers in it scatter the light.', { f: 'KAlSi₃O₈', sys: 'Monoclinic', h: [6, 6.5], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.57', loc: 'Meetiyagoda, Sri Lanka', note: 'Variety of orthoclase', habit: 'massive', mat: 'trans', pat: 'adularescent', col: '#e6e8ec', col2: '#7aa8e8', bg: [.149, .012, 261], accent: [225, .102, .84], second: [69, .067], chroma: .1, warm: .15 }],
  ['Amazonite', 'framework', 'Blue-green microcline feldspar with white streaks. Lead and water in the crystal give the color.', { f: 'KAlSi₃O₈', sys: 'Triclinic', h: [6, 6.5], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.56', loc: 'Pikes Peak, Colorado, USA', note: 'Variety of microcline', habit: 'prism', mat: 'opaque', pat: 'streaked', col: '#58b8a8', col2: '#e8f0ec', mtx: '#6a5a50', bg: [.181, .045, 190], accent: [188, .116, .841], second: [92, .027], chroma: .11, warm: .15 }],
  ['Labradorite', 'framework', 'Gray feldspar that flashes blue and gold. Thin layers in the crystal make the colors.', { f: '(Ca,Na)(Al,Si)₄O₈', sys: 'Triclinic', h: [6, 6.5], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.7', loc: 'Labrador, Canada', habit: 'massive', mat: 'opaque', pat: 'labradorescent', col: '#4a4e55', col2: '#2a6ac8', bg: [.129, .014, 242], accent: [235, .119, .744], second: [88, .12], chroma: .12, warm: .15 }],
  ['Sunstone', 'framework', 'Orange feldspar with tiny plates of hematite. The plates glitter in the light.', { f: '(Na,Ca)(Al,Si)₄O₈', sys: 'Triclinic', h: [6, 6.5], lus: 'Vitreous', streak: ['White', '#f4f4f4'], sg: '2.65', loc: 'Tvedestrand, Norway', note: 'Variety of oligoclase', habit: 'massive', mat: 'trans', pat: 'aventurescent', col: '#d27a42', col2: '#ffb060', bg: [.164, .038, 36], accent: [51, .135, .794], second: [23, .123], chroma: .12, warm: .5 }],
  ['Lazurite', 'framework', 'The deep blue mineral of lapis lazuli. Painters ground it into the pigment ultramarine.', { f: '(Na,Ca)₈(AlSiO₄)₆(SO₄,S,Cl)₂', sys: 'Cubic', h: [5, 5.5], lus: 'Vitreous to dull', streak: ['Bright blue', '#3a5ac8'], sg: '2.4', loc: 'Sar-e-Sang, Afghanistan', habit: 'massive', mat: 'opaque', pat: 'speckled', col: '#1e389e', col2: '#d8b45c', bg: [.147, .056, 270], accent: [272, .167, .678], second: [88, .118], chroma: .12, warm: .1 }],
];

// Signature palettes. Like Osaka Jade or Miasma in Omarchy, these themes fill
// the 6 ANSI slots with the colors of the mineral, so a slot can hold a color
// that is not its name: the yellow of Lazurite is the gold of its pyrite
// flecks, and the blue of Watermelon Tourmaline is the green of its rim. Each
// slot is "hue chroma lightness" in OKLCH, in the order red, green, yellow,
// blue, magenta, cyan. The lightness is for night. The contrast check still
// raises or lowers every color.
const SIGNATURE = {
  'Gold': '35 .13 .68, 118 .08 .78, 88 .15 .88, 70 .08 .74, 20 .09 .74, 98 .06 .9',
  'Copper': '35 .14 .66, 160 .1 .78, 78 .12 .86, 50 .1 .72, 15 .1 .74, 178 .09 .84',
  'Bismuth': '350 .14 .70, 150 .12 .78, 92 .13 .86, 255 .13 .72, 312 .14 .74, 198 .12 .82',
  'Kamacite': '30 .12 .70, 150 .07 .78, 75 .1 .86, 225 .07 .74, 330 .06 .76, 200 .06 .84',
  'Pyrite': '35 .12 .68, 125 .08 .78, 95 .12 .86, 72 .07 .74, 20 .08 .74, 105 .05 .9',
  'Cinnabar': '27 .17 .64, 140 .08 .78, 82 .1 .86, 250 .07 .74, 5 .12 .74, 200 .05 .86',
  'Chalcopyrite': '25 .12 .70, 130 .1 .78, 100 .14 .86, 260 .1 .72, 300 .12 .74, 200 .08 .84',
  'Bornite': '20 .14 .68, 160 .1 .78, 85 .12 .86, 268 .14 .70, 315 .14 .74, 220 .11 .82',
  'Covellite': '15 .12 .70, 160 .08 .78, 85 .1 .86, 270 .15 .70, 320 .13 .74, 235 .11 .82',
  'Hematite': '25 .15 .64, 145 .07 .78, 80 .1 .86, 240 .06 .74, 10 .1 .72, 210 .05 .84',
  'Ruby': '15 .17 .66, 150 .08 .78, 85 .1 .86, 250 .08 .74, 350 .15 .74, 200 .06 .86',
  'Sapphire': '20 .12 .72, 160 .08 .78, 85 .1 .86, 262 .15 .72, 300 .1 .76, 225 .11 .84',
  'Spinel': '15 .15 .68, 150 .08 .78, 85 .1 .86, 280 .1 .74, 352 .16 .74, 210 .07 .84',
  'Alexandrite': '12 .14 .68, 162 .12 .78, 85 .1 .86, 250 .09 .72, 345 .14 .74, 178 .1 .84',
  'Fluorite': '355 .12 .70, 150 .14 .78, 95 .12 .86, 265 .12 .72, 302 .15 .74, 190 .1 .84',
  'Malachite': '25 .12 .68, 150 .15 .78, 100 .1 .86, 185 .1 .72, 330 .09 .76, 165 .12 .84',
  'Azurite': '20 .12 .70, 155 .13 .78, 85 .1 .86, 264 .16 .70, 300 .1 .76, 225 .11 .84',
  'Rhodochrosite': '10 .14 .68, 150 .08 .78, 85 .1 .88, 250 .08 .74, 355 .13 .76, 200 .06 .86',
  'Wulfenite': '40 .16 .66, 120 .08 .78, 88 .14 .86, 60 .1 .74, 20 .1 .74, 95 .07 .9',
  'Turquoise': '30 .12 .70, 160 .1 .78, 75 .1 .86, 205 .12 .74, 330 .08 .76, 190 .12 .84',
  'Vanadinite': '33 .17 .64, 125 .08 .78, 80 .12 .86, 55 .1 .74, 15 .11 .72, 95 .06 .9',
  'Erythrite': '10 .13 .70, 150 .08 .78, 85 .1 .86, 280 .1 .74, 345 .15 .74, 200 .07 .84',
  'Emerald': '25 .12 .70, 155 .16 .78, 95 .1 .86, 185 .1 .72, 330 .09 .76, 170 .12 .84',
  'Watermelon Tourmaline': '0 .16 .68, 145 .15 .78, 100 .12 .86, 160 .1 .72, 340 .15 .74, 175 .1 .84',
  'Dioptase': '25 .12 .70, 160 .14 .78, 90 .1 .86, 220 .1 .72, 330 .09 .76, 178 .14 .84',
  'Charoite': '355 .12 .70, 150 .08 .78, 85 .1 .86, 280 .12 .72, 305 .15 .74, 250 .08 .84',
  'Amethyst': '355 .12 .70, 150 .08 .78, 85 .1 .86, 285 .13 .72, 305 .15 .74, 260 .08 .84',
  'Agate': '30 .14 .68, 130 .08 .78, 80 .12 .86, 50 .08 .74, 15 .1 .74, 200 .05 .86',
  'Tiger’s Eye': '35 .13 .68, 115 .08 .78, 80 .14 .86, 60 .07 .74, 15 .09 .74, 90 .06 .9',
  'Opal': '25 .15 .68, 145 .15 .80, 95 .14 .88, 245 .14 .72, 330 .15 .74, 195 .13 .84',
  'Labradorite': '45 .12 .70, 150 .12 .78, 85 .14 .86, 240 .15 .72, 290 .1 .76, 200 .13 .82',
  'Sunstone': '35 .14 .68, 120 .08 .78, 75 .14 .86, 55 .09 .74, 15 .1 .74, 90 .06 .9',
  'Lazurite': '25 .12 .70, 150 .08 .78, 88 .14 .86, 266 .16 .72, 295 .1 .76, 225 .1 .84',
};
// ---------- color math ----------

function rng(seed) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// OKLCH to linear sRGB.
function lin(L, C, h) {
  h *= Math.PI / 180;
  const a = C * Math.cos(h), b = C * Math.sin(h);
  const l = (L + .3963377774 * a + .2158037573 * b) ** 3;
  const m = (L - .1055613458 * a - .0638541728 * b) ** 3;
  const s = (L - .0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + .2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - .3413193965 * s,
    -.0041960863 * l - .7034186147 * m + 1.707614701 * s,
  ];
}

// OKLCH to hex. Chroma drops until the color fits in sRGB.
export function oklchHex(L, C, h) {
  let c = C, r = lin(L, c, h);
  while (c > 0 && r.some(v => v < -.001 || v > 1.001)) { c -= .005; r = lin(L, c, h); }
  return '#' + r.map(v => {
    v = Math.min(1, Math.max(0, v));
    v = v <= .0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - .055;
    return Math.round(v * 255).toString(16).padStart(2, '0');
  }).join('');
}

// Hex to OKLCH.
export function hexOklch(hex) {
  const [r, g, b] = [1, 3, 5].map(i => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(.4122214708 * r + .5363325363 * g + .0514459929 * b);
  const m = Math.cbrt(.2119034982 * r + .6806995451 * g + .1073969566 * b);
  const s = Math.cbrt(.0883024619 * r + .2817188376 * g + .6299787005 * b);
  const L = .2104542553 * l + .7936177850 * m - .0040720468 * s;
  const A = 1.9779984951 * l - 2.4285922050 * m + .4505937099 * s;
  const B = .0259040371 * l + .7827717662 * m - .8086757660 * s;
  return { L, C: Math.hypot(A, B), h: (Math.atan2(B, A) * 180 / Math.PI + 360) % 360 };
}

// Linear sRGB mix, the same math that Omarchy uses for derived shades.
export function mix(a, b, t) {
  const pa = [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.floor(v * (1 - t) + pb[i] * t + .5).toString(16).padStart(2, '0')).join('');
}

// WCAG contrast ratio of two hex colors.
export function contrast(a, b) {
  const lum = hex => {
    const [r, g, bl] = [1, 3, 5].map(i => {
      const v = parseInt(hex.slice(i, i + 2), 16) / 255;
      return v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4;
    });
    return .2126 * r + .7152 * g + .0722 * bl;
  };
  const x = lum(a), y = lum(b);
  return (Math.max(x, y) + .05) / (Math.min(x, y) + .05);
}

// The first color at or above lightness L that reaches the target contrast.
function lighten(L, C, h, bg, target) {
  let hex = oklchHex(L, C, h);
  while (contrast(hex, bg) < target && L < 1) { L = Math.min(1, L + .005); hex = oklchHex(L, C, h); }
  return hex;
}

// The first color at or below lightness L that reaches the target contrast.
function darken(L, C, h, bg, target) {
  let hex = oklchHex(L, C, h);
  while (contrast(hex, bg) < target && L > 0) { L = Math.max(0, L - .005); hex = oklchHex(L, C, h); }
  return hex;
}

// Converts names with accents or apostrophes, such as Tiger’s Eye, to folder names.
export function slugify(name) {
  return name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd')
    .toLowerCase().replace(/&/g, 'and').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const hueDist = (a, b) => { const d = Math.abs(((a - b) % 360 + 540) % 360 - 180); return d; };
const hueDelta = (from, to) => ((to - from) % 360 + 540) % 360 - 180;

// Yaru icon themes that ship with Omarchy, keyed by OKLCH hue.
const YARU = [
  [15, 'Yaru-red'], [45, 'Yaru'], [85, 'Yaru-yellow'], [115, 'Yaru-olive'],
  [150, 'Yaru-sage'], [200, 'Yaru-prussiangreen'], [255, 'Yaru-blue'],
  [300, 'Yaru-purple'], [345, 'Yaru-magenta'], [375, 'Yaru-red'],
];

function iconTheme(hex) {
  const { h, C } = hexOklch(hex);
  if (C < .03) return 'Yaru';
  let best = YARU[0], dist = Infinity;
  for (const entry of YARU) {
    const d = Math.min(Math.abs(entry[0] - h), Math.abs(entry[0] - (h + 360)));
    if (d < dist) { dist = d; best = entry; }
  }
  return best[1];
}

// ---------- palette generator ----------

// ANSI order: red, green, yellow, blue, magenta, cyan.
const BASE_HUE = [27, 140, 88, 250, 340, 200];
// Night and day start lightness of each hue, before the contrast check.
const NIGHT_L = [.72, .76, .83, .74, .74, .78];
const DAY_L = [.52, .54, .6, .5, .52, .54];
// Contrast targets against the background.
const TARGET = { night: { normal: 5.5, bright: 7.5, muted: 3.8, accent: 6, second: 4.5, fg: 11 }, day: { normal: 4.5, bright: 6, muted: 3.8, accent: 4.5, second: 4, fg: 11 } };

// The 6 hues of a theme. Warm themes move blue, cyan, green and magenta to the
// warm side and lower their chroma. The slot nearest to the accent moves up to
// 20 degrees to the accent hue, so each palette carries its drink color.
// The second color moves another slot up to 12 degrees. Red moves 6 degrees at most.
function ansiHues(t, r) {
  const w = t.warm;
  const h = [24 + 4 * w, 140 - 22 * w, 88 - 8 * w, 250 - 18 * w, 340 + 8 * w, 200 - 14 * w];
  // The table chroma spreads out around .1, so lively drinks differ more from calm ones.
  const chroma = .1 + (t.chroma - .1) * 1.6;
  const c = [1, 1 - .25 * w, 1, 1 - .3 * w, 1 - .15 * w, 1 - .3 * w].map(x => x * chroma);
  // The accent pulls its nearest slot. Then the second color pulls the nearest
  // other slot by less.
  const taken = new Set();
  for (const [hue, C, max] of [[t.accent[0], t.accent[1], 20], [t.second[0], t.second[1], 12]]) {
    let best = -1, bd = 999;
    h.forEach((x, k) => { const d = hueDist(x, hue); if (!taken.has(k) && d < bd) { bd = d; best = k; } });
    if (best < 0 || bd >= 50 || C <= .06) continue;
    taken.add(best);
    // Red stays red, because it marks errors.
    const m = best === 0 ? 6 : max;
    h[best] += Math.max(-m, Math.min(m, hueDelta(h[best], hue) * .7));
    c[best] = Math.max(c[best], Math.min(C, chroma * 1.3));
  }
  return { h: h.map(x => (x + (r() - .5) * 6 + 360) % 360), c };
}

// The 6 slots of a theme as { h, c, night, day }, where night and day are the
// start lightness before the contrast check.
function slots(t, r) {
  if (t.sig) return t.sig.map(([h, c, L]) => ({ h, c, night: L, day: .5 + (L - .74) * .6 }));
  const { h, c } = ansiHues(t, r);
  return h.map((x, k) => ({ h: x, c: c[k], night: NIGHT_L[k], day: DAY_L[k] }));
}

function oklabDistance(a, b) {
  const p = hexOklch(a), q = hexOklch(b);
  const rad = Math.PI / 180;
  return Math.hypot(p.L - q.L, p.C * Math.cos(p.h * rad) - q.C * Math.cos(q.h * rad), p.C * Math.sin(p.h * rad) - q.C * Math.sin(q.h * rad));
}

// Two slots that look the same waste a color. When 2 slots are closer than
// MIN_DISTANCE in OKLab, the later one moves away in lightness: lighter at
// night and darker in the day, which also keeps its contrast.
const MIN_DISTANCE = .06;
function separate(colors, list, step, fit) {
  const out = [...colors];
  for (let j = 1; j < out.length; j++) {
    for (let n = 0; n < 8 && out.slice(0, j).some(x => oklabDistance(x, out[j]) < MIN_DISTANCE); n++) {
      const { L } = hexOklch(out[j]);
      out[j] = fit(Math.min(.96, Math.max(.2, L + step)), list[j].c, list[j].h);
    }
  }
  return out;
}

function nightPalette(t, r) {
  // The table chroma of the background is a little strong for large areas.
  const [bl, bc, bh] = [t.bg[0], t.bg[1] * .8, t.bg[2]];
  const bg = oklchHex(bl, bc, bh);
  const list = slots(t, r);
  const T = TARGET.night;
  const fit = (L, C, h) => lighten(L, C, h, bg, T.normal);
  const normal = separate(list.map(s => fit(s.night, s.c, s.h)), list, .03, fit);
  const bright = list.map((s, k) => lighten(Math.min(.95, hexOklch(normal[k]).L + .07), s.c * .82, s.h, bg, T.bright));
  const fg = lighten(.91, Math.min(bc * .6 + .008, .03), bh, bg, T.fg);
  const ansi = [
    oklchHex(bl + .065, bc * 1.1, bh), ...normal, oklchHex(.84, Math.min(bc * .6 + .01, .03), bh),
    lighten(.55, Math.min(bc + .01, .05), bh, bg, T.muted), ...bright, oklchHex(.975, .01, bh),
  ];
  const accent = lighten(t.accent[2] || .76, t.accent[1], t.accent[0], bg, T.accent);
  const second = lighten(t.second[2] || .72, t.second[1], t.second[0], bg, T.second);
  const orange = orangeFor(normal[0], normal[2], bg, l => lighten(l.L, l.C, l.h, bg, T.normal));
  return {
    ansi, accent, second,
    colors: {
      mode: 'dark', accent, selection: mix(bg, accent, .28), muted: ansi[8],
      background: bg, dark_background: mix(bg, '#000000', .25), darker_background: mix(bg, '#000000', .5), lighter_background: ansi[0],
      foreground: fg, dark_foreground: mix(fg, bg, .38), light_foreground: ansi[7], bright_foreground: ansi[15],
      red: normal[0], yellow: normal[2], orange, green: normal[1], cyan: normal[5], blue: normal[3], magenta: normal[4],
      brown: lighten(.5, .08, 55, bg, 3),
      bright_red: bright[0], bright_yellow: bright[2], bright_green: bright[1], bright_cyan: bright[5], bright_blue: bright[3], bright_magenta: bright[4],
    },
  };
}

// The day background is a pale tint of the mineral. It keeps the hue of the
// night background, so a pink mineral stays pink in daylight. A mineral can
// change the hue in the day, like Alexandrite, which is green in daylight.
function dayBackground(t) {
  const [bl, bc, bh] = t.bg;
  const h = t.day?.hue ?? bh;
  // A darker night background gives a slightly darker day background.
  return [.948 + (Math.min(Math.max(bl, .12), .19) - .12) * .38, Math.min(Math.max(bc * .7, .012), .03), (h + 360) % 360];
}

function dayPalette(t, r) {
  const [dl, dc, dh] = dayBackground(t);
  const bg = oklchHex(dl, dc, dh);
  const list = slots(t, r);
  const T = TARGET.day;
  const fit = (L, C, h) => darken(L, C * 1.08, h, bg, T.normal);
  const normal = separate(list.map(s => fit(s.day, s.c, s.h)), list, -.03, fit);
  const bright = list.map((s, k) => darken(hexOklch(normal[k]).L - .06, s.c * 1.12, s.h, bg, T.bright));
  const fg = darken(.3, Math.min(t.bg[1] * .8 + .01, .04), dh, bg, T.fg);
  const ansi = [
    oklchHex(dl - .055, dc * 1.4, dh), ...normal, oklchHex(.42, Math.min(t.bg[1] * .7 + .01, .035), dh),
    darken(.6, Math.min(t.bg[1] * .7 + .01, .035), dh, bg, T.muted), ...bright, oklchHex(.2, Math.min(t.bg[1] * .6 + .01, .03), dh),
  ];
  const ac = t.day?.accent || t.accent, sc = t.day?.second || t.second;
  const accent = darken(Math.min(ac[2] || .55, .55), Math.max(ac[1] * 1.1, .06), ac[0], bg, T.accent);
  const second = darken(Math.min(sc[2] || .55, .58), Math.max(sc[1] * 1.1, .05), sc[0], bg, T.second);
  const orange = orangeFor(normal[0], normal[2], bg, l => darken(l.L, l.C, l.h, bg, T.normal));
  return {
    ansi, accent, second,
    colors: {
      mode: 'light', accent, selection: mix(bg, accent, .22), muted: ansi[8],
      background: bg, dark_background: oklchHex(dl - .03, dc * 1.2, dh), darker_background: oklchHex(dl - .07, dc * 1.3, dh), lighter_background: ansi[0],
      foreground: fg, dark_foreground: darken(.5, Math.min(dc + .01, .03), dh, bg, 5), light_foreground: ansi[7], bright_foreground: ansi[15],
      red: normal[0], yellow: normal[2], orange, green: normal[1], cyan: normal[5], blue: normal[3], magenta: normal[4],
      brown: darken(.45, .08, 55, bg, 5),
      bright_red: bright[0], bright_yellow: bright[2], bright_green: bright[1], bright_cyan: bright[5], bright_blue: bright[3], bright_magenta: bright[4],
    },
  };
}

// Orange sits between the red and yellow hues of each palette.
function orangeFor(red, yellow, bg, fit) {
  const a = hexOklch(red), b = hexOklch(yellow);
  return fit({ L: (a.L + b.L) / 2, C: (a.C + b.C) / 2, h: a.h + hueDelta(a.h, b.h) / 2 });
}

// Variant order, labels, and the suffix of the installed theme name.
export const VARIANTS = [
  { key: 'night', label: 'Night', suffix: '-night', mode: 'dark' },
  { key: 'day', label: 'Day', suffix: '-day', mode: 'light' },
];

export { CATEGORIES };

// Luster to the roughness and reflectance of the surface in the photos.
function surfaceOf(lus, mat) {
  const l = lus.toLowerCase();
  if (mat === 'metal') return { rough: l.includes('dull') || l.includes('earthy') || l.includes('sub') ? .32 : .22, f0: .6 };
  if (l.startsWith('adamantine')) return { rough: .04, f0: .12 };
  if (l.startsWith('vitreous')) return { rough: l.includes('pearly') ? .12 : .06, f0: .05 };
  if (l.startsWith('resinous') || l.startsWith('submetallic')) return { rough: .1, f0: .07 };
  if (l.startsWith('silky')) return { rough: .22, f0: .05 };
  if (l.startsWith('pearly')) return { rough: .2, f0: .05 };
  if (l.startsWith('waxy') || l.startsWith('greasy')) return { rough: .28, f0: .045 };
  return { rough: .45, f0: .04 };
}

export const themes = TABLE.map(([name, cat, desc, o], i) => {
  const slug = slugify(name);
  const t = { warm: .4, ...o };
  if (SIGNATURE[name]) t.sig = SIGNATURE[name].split(',').map(x => x.trim().split(/\s+/).map(Number));
  const make = (key, build) => {
    const v = VARIANTS.find(x => x.key === key);
    const p = build(t, rng(i * 7919 + 13));
    return { variant: key, label: v.label, install: `${slug}${v.suffix}`, name: `${name} ${v.label}`, ansi: p.ansi, second: p.second, icons: iconTheme(p.accent), colors: p.colors };
  };
  return {
    index: i + 1, name, slug, cat, category: CATEGORIES[cat], desc, origin: t.loc,
    formula: t.f, system: t.sys, hardness: t.h, luster: t.lus, streak: t.streak, sg: t.sg, locality: t.loc, note: t.note || '',
    habit: t.habit, mat: t.mat, pattern: t.pat, color: t.col, color2: t.col2 || t.col, matrix: t.mtx || '#8a8478',
    gem: !!t.gem, ior: t.ior || 1.55, disp: t.disp || 0, surface: surfaceOf(t.lus, t.mat),
    closeup: t.gem ? 'gem' : ['massive', 'meteorite'].includes(t.habit) || ['banded', 'web', 'radial', 'widmanstatten', 'zoned'].includes(t.pat) || name === 'Amazonite' ? 'slab' : 'macro',
    signature: !!t.sig,
    variants: { night: make('night', nightPalette), day: make('day', dayPalette) },
  };
});

export function colorsToml(v) {
  const k = v.colors;
  return `mode = "${k.mode}"

accent = "${k.accent}"
selection = "${k.selection}"
muted = "${k.muted}"

background = "${k.background}"
dark_background = "${k.dark_background}"
darker_background = "${k.darker_background}"
lighter_background = "${k.lighter_background}"

foreground = "${k.foreground}"
dark_foreground = "${k.dark_foreground}"
light_foreground = "${k.light_foreground}"
bright_foreground = "${k.bright_foreground}"

hyprland_active_border = "rgba(${k.accent.slice(1)}ee) rgba(${v.second.slice(1)}ee) 45deg"
hyprland_inactive_border = "rgba(${k.muted.slice(1)}aa)"

red = "${k.red}"
yellow = "${k.yellow}"
orange = "${k.orange}"
green = "${k.green}"
cyan = "${k.cyan}"
blue = "${k.blue}"
magenta = "${k.magenta}"
brown = "${k.brown}"

bright_red = "${k.bright_red}"
bright_yellow = "${k.bright_yellow}"
bright_green = "${k.bright_green}"
bright_cyan = "${k.bright_cyan}"
bright_blue = "${k.bright_blue}"
bright_magenta = "${k.bright_magenta}"
`;
}

// For tools that tune the table.
export { TABLE, SIGNATURE, nightPalette, dayPalette, rng };
