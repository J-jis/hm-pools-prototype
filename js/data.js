/* HM Pools architect's guide: content.
   Everything the guide shows lives here, so copy can be edited without touching app.js.
   sections[].choices[].specs are [label, text] pairs shown under "What it means for your design". */
(function (HM) {
  "use strict";

  HM.sections = [
    {
      id: "type", title: "Pool type", choices: [
        {
          id: "skimmer", label: "Skimmer", img: "img/kirkkonummi.jpg",
          blurb: "The classic pool. Water sits a little below the edge, and openings in the wall (skimmers) pull the surface water to the filter. Worth deciding early, because it shapes the edge detail and the technical room.",
          specs: [["Look", "Water about 10-15 cm below the edge, so the pool edge stays visible"], ["How it works", "Skimmers and floor drains send water straight to the filter"], ["Space", "No extra tank needed. The smallest technical room of the three"], ["Good for", "Simpler budgets, compact sites, hot tubs"]]
        },
        {
          id: "overflow", label: "Overflow", img: "img/mustasaari.jpg",
          blurb: "Water fills the pool to the rim and is flush with the floor around it, giving a calm, mirror-like surface. Worth deciding early, because it needs a lower-level tank.",
          specs: [["Look", "Water level with the surrounding floor. No visible step down"], ["How it works", "Water spills into a gutter with a grating around the pool and drains to a balance tank"], ["Space", "The balance tank must sit lower than the pool, so plan a basement or pit for it"], ["Detail", "The floor next to the gutter gets wet, so slope it towards drains"]]
        },
        {
          id: "infinity", label: "Infinity edge", img: "img/saana.jpg",
          blurb: "On one or two sides the water seems to run straight into the view. It flows over a slightly lowered edge into a hidden trough and is pumped back. Worth deciding early, because it depends on the site.",
          specs: [["Site", "Needs a view and a drop in ground level on the edge side"], ["Precision", "The edge must be almost perfectly level (about ±1.5 mm) for an even water film"], ["Trough", "A hidden catch trough below the edge. HM Pools sizes it for wind, drop height and use"], ["Other sides", "The remaining edges are normal or overflow edges"]]
        }
      ]
    },
    {
      id: "use", title: "Purpose & rules", choices: [
        {
          id: "private", label: "Private home", img: "img/uusimaa.jpg",
          blurb: "A pool used only by the owner's household. The public-pool water decree does not apply, but European domestic-pool standards and the local building rules do.",
          specs: [["Standards", "EN 16582-1/-2 (domestic pools: slip resistance, ladders, entrapment); EN 16713-2 circulation: full turnover within max. 8 h"], ["Permit", "Under the Building Act (in force 1.1.2025) the need for a permit depends on the municipality's building ordinance, so ask rakennusvalvonta early"], ["Suction safety", "At least two suction outlets per suction line or certified anti-entrapment grilles"]]
        },
        {
          id: "public", label: "Hotel, spa, public", img: "img/mustasaari.jpg",
          blurb: "Any pool the public can use (paid or free, private owner or not) is a 'public pool' under the Finnish pool-water decree. That covers hotels, spas, rehab centres and swimming halls.",
          specs: [["Water quality", "STM decree 315/2002: water quality limits, owner's self-monitoring and regular sampling by the municipality"], ["Design safety", "EN 15288-1 (safety in design of public pools); fittings and grilles to EN 13451"], ["Suction outlets", "Velocity through grilles ≤ 0.5 m/s, gaps ≤ 8 mm, two outlets ≥ 2 m apart per suction line"], ["Circulation", "Overflow is the standard choice for public pools"]]
        },
        {
          id: "hottub", label: "Hot tub / spa pool", img: "img/clarion.jpg",
          blurb: "Small, hot and heavily used per litre of water. High temperature speeds up corrosion, which affects the steel grade and the plant.",
          specs: [["Standard", "Domestic spas: EN 17125 requires two suction fittings per pump, or one certified grille"], ["Public", "Spas open to the public fall under STM 315/2002"], ["Floor load", "1 m of water ≈ 10 kN/m², plus people and the shell"], ["Steel grade", "Warm, chloride-rich water. Confirm the grade with HM Pools"]]
        },
        {
          id: "therapy", label: "Therapy & rehab", img: "img/live.jpg",
          blurb: "Warm water and users with reduced mobility. Accessibility equipment and ventilation drive the design.",
          specs: [["Access", "Lift, stairs with handrails on both sides"], ["Ventilation", "Warmer water evaporates more, so dehumidification must be upsized"], ["Regulation", "STM 315/2002 and EN 15288-1 when open to the public"]]
        }
      ]
    },
    {
      id: "dims", title: "Dimensions", kind: "dims",
      blurb: "Rough numbers are enough. HM Pools refines them with you. Leave anything blank that isn't decided yet.",
      fields: [["l", "Length (m)", "e.g. 10"], ["w", "Width (m)", "e.g. 4"], ["d1", "Shallow end (m)", "e.g. 1.2"], ["d2", "Deep end (m)", "e.g. 1.6"]],
      specs: [
        ["Shape", "Any outline is possible. Attach a sketch in \u201cShare your project\u201d"],
        ["Weight", "Every metre of depth adds about 1 tonne of water per m\u00b2. This matters most inside a building"],
        ["Depth", "Total depth needed below floor level = water depth + shell and base, plus the balance tank for overflow and infinity pools"],
        ["Delivery", "If the pool can't be delivered in one piece, because of its size or site access, it comes in sections welded on site"]
      ]
    },
    {
      id: "install", title: "Location & installation", choices: [
        {
          id: "outdoor", label: "Outdoors, in the ground", img: "img/oulu.jpg",
          blurb: "The finished steel pool arrives in one piece and is lifted into place. In the Finnish climate, the key question is summer-only or year-round use.",
          specs: [["Delivery", "Truck and crane, so plan crane access to the spot"], ["Foundation", "The pool requires a suitable engineered support structure. Foundation type, ground conditions, frost protection and drainage must be coordinated with the structural designer and HM Pools."], ["Season", "Summer only, or heated and covered all year?"], ["Ground", "Frost protection and rainwater drainage around the pool"], ["Surroundings", "Trees and wind bring leaves into the water"], ["Time", "Design and manufacturing 10-20 weeks, installation a few days"]]
        },
        {
          id: "indoor", label: "Indoors, in a building", img: "img/raasepori.jpg",
          blurb: "In a basement, spa wing or pool hall. Steel is much lighter than a concrete pool, but the water itself is heavy. An indoor pool is also a ventilation project, because the water evaporates all the time, so bring in the HVAC engineer from the start.",
          specs: [["Floor", "A structural engineer checks the slab for the full water weight"], ["Getting it in", "If the pool can't be delivered in one piece, it comes in sections welded on site"], ["Ventilation", "A dedicated pool dehumidifier is needed. Ordinary ventilation is not enough"], ["Comfort", "Air kept slightly warmer than the water, humidity around 50-60 %"], ["Winter", "Plan windows and cold walls against condensation"], ["Service", "Keep access to the pipes and the underside of the pool"]]
        },
        {
          id: "retrofit", label: "Into an old pool", img: "img/hakunila.jpg",
          blurb: "An existing pool may be renovated by installing a new stainless steel structure within or in place of the old pool. The approach depends on the condition, dimensions and structural capacity of the existing construction.",
          specs: [
            ["Survey", "Check the existing pool dimensions, structure, waterproofing and condition before selecting a renovation method."],
            ["Space", "Allow for any reduction in internal dimensions caused by the new structure and installation details."],
            ["Connections", "Review existing pipework, drainage, water treatment and technical space for possible upgrades."],
            ["Construction", "Installation and project duration depend on site access and the condition of the existing pool."]
          ]
        }
      ]
    },
    {
      id: "water", title: "Water source", noPhoto: true, choices: [
        {
          id: "mains", label: "Municipal water",
          blurb: "The simplest option: the pool is filled and topped up from the municipal water supply.",
          specs: [["Fill volume", "Length \u00d7 width \u00d7 average depth. A 12 \u00d7 4 m pool with 1.5 m average depth holds about 72 m\u00b3"], ["Top-up", "Pools lose water to evaporation and filter backwashing, so plan a permanent water connection to the technical room"], ["Drainage", "Plan how filter backwash, pool emptying and overflow water will be discharged. Confirm the permitted discharge route and any treatment requirements with the local water authority."]]
        },
        {
          id: "well", label: "Own well",
          blurb: "Common in homes outside town. Well water often contains iron and manganese, which can stain surfaces and clog filters.",
          specs: [["Water test", "Have the well water tested before the pool is designed"], ["Capacity", "Check that the well can supply the full fill volume. The first fill can also be done with delivered water"], ["Top-up", "Plan a permanent water connection to the technical room"]]
        },
        {
          id: "natural", label: "Lake or sea water",
          blurb: "Natural water needs more treatment than tap water, and the salt in sea water affects the steel grade. Discuss it with HM Pools early.",
          specs: [["Steel", "Salt water needs a higher steel grade than normal pool water"], ["Treatment", "Expect extra filtration and water treatment"], ["Check first", "Confirm with HM Pools before promising it to the client"]]
        }
      ]
    },
    {
      id: "access", title: "Getting in & out", choices: [
        {
          id: "stairs", label: "Built-in stairs", img: "img/uusimaa.jpg",
          blurb: "Integrated stainless steel stairs provide access to the pool and can be designed to match its form and finish. Their position and dimensions should be considered early, as later changes may require modifications to the pool structure.",
          specs: [["Space", "Stairs take pool area, so include them in the layout"], ["Safety", "Slip-resistant treads and a handrail"]]
        },
        {
          id: "ladder", label: "Ladder", img: "img/ahtari.jpg",
          blurb: "The most compact option. HM Pools makes steel ladders.",
          specs: [["Fixing", "Anchored to the pool edge"]]
        },
        {
          id: "bench", label: "Bench / ledge", img: "img/kirkkonummi.jpg",
          blurb: "An integrated bench or shallow ledge creates a place to sit, rest or enter the water. Its location, dimensions and water depth should be considered as part of the pool layout.",
          specs: [
            ["Layout", "Reserve sufficient space for the bench or ledge without restricting the intended swimming area."],
            ["Design", "Coordinate the dimensions, edges and finish with HM Pools during the design stage."]
          ]
        }
      ]
    },
    {
      id: "covers", title: "Cover", choices: [
        {
          id: "auto", label: "Automatic cover", img: "img/live-cover.jpg",
          blurb: "A slatted cover that rolls out at the push of a button. Saves energy and keeps children and pets out.",
          specs: [["Space", "The roll sits in a pit, under a bench or at the pool end. Decide where early"], ["Power", "Needs an electrical supply"]]
        },
        {
          id: "enclosure", label: "Pool enclosure", img: "img/kankaanpaa.jpg",
          blurb: "A low, see-through enclosure on rails that slides over the pool by hand. It keeps rain, leaves and cold out and extends the outdoor season.",
          specs: [["Rails", "Tracks run along both long sides, so leave deck width for them"], ["Parking", "When open, the segments stack at one end of the pool. Plan space there"], ["Power", "None needed, it is moved by hand"], ["Look", "Visible in the garden all year, so consider it in the landscape design"]]
        },
        {
          id: "walkon", label: "Walk-on cover", img: "img/terrace.jpg",
          blurb: "A load-bearing cover that turns the pool into usable floor or terrace.",
          specs: [["Structure", "Designed to carry people like a floor"]]
        },
        {
          id: "none", label: "No cover", img: "img/hamina.jpg",
          blurb: "Possible, but indoors it means bigger ventilation and higher running costs.",
          specs: [["Later", "A cover can be added afterwards"]]
        }
      ]
    },
    {
      id: "lighting", title: "Lighting", choices: [
        {
          id: "led", label: "Underwater lights", img: "img/indoor-private.jpg",
          blurb: "Steel pools look great lit from within. Light positions are fixed before manufacturing, because the openings are made in the factory.",
          specs: [
            ["Positions", "Plan underwater light locations and cable routes before manufacturing."],
            ["Electrical safety", "Use pool-rated lighting and electrical equipment installed according to applicable electrical safety requirements."],
            ["Coordination", "Coordinate electrical connections, bonding and equipment locations with a qualified electrical designer."]
          ]
        },
        {
          id: "none", label: "No pool lighting", img: "img/villa-isola.jpg",
          blurb: "Adding lights later means making new openings in the steel.",
          specs: [["Tip", "Plan cable routes now, even if lights come later"]]
        }
      ]
    },
    {
      id: "features",
      title: "Extras",
      multiple: true,
      choices: [
        {
          id: "cc",
          label: "Counter-current",
          img: "img/duudson.jpg",
          blurb: "Swim in place against a current. It makes a short pool usable for exercise.",
          specs: [
            ["Opening", "Made in the pool wall at the factory"],
            ["Technical room", "Extra pump: needs space, power and makes some noise"]
          ]
        },
        {
          id: "jets",
          label: "Massage jets",
          img: "img/clarion.jpg",
          blurb: "Water or air jets in seats or walls.",
          specs: [
            ["Positions", "Decided before manufacturing"],
            ["Technical room", "Space for a blower and pump"]
          ]
        },
        {
          id: "heat",
          label: "Heating",
          img: "img/ilola.jpg",
          blurb: "Most pools are heated, usually with a heat pump or the house's own heating.",
          specs: [
            ["Heat pump", "Outdoor unit needs a spot where its noise doesn't bother anyone"]
          ]
        },
        {
          id: "other",
          label: "Other",
          noPhoto: true,
          blurb: "Tell HM Pools about any additional feature or requirement you have in mind.",
          specs: []
        }
      ]
    },
    {
      id: "plant",
      title: "Technical room",
      kind: "info",
      choices: [
        {
          id: "info",
          label: "Technical room",
          img: "img/lehmonkarki.jpg",

          blurb: "Pool water treatment requires space for circulation, filtration, heating, dosing and controls. HM Pools supplies the stainless steel pool, while the water treatment system is planned with a specialist equipment partner. Involve the technical designer early so that space, access and service connections can be coordinated with the building design.",

          specs: [
            ["Equipment", "Allow space for pumps, filters, heating, dosing equipment and controls. Exact requirements depend on pool size, use and treatment system."],

            ["Balance tank", "Overflow and infinity systems may require a separate balance tank. Its size and location must be coordinated with the hydraulic design."],

            ["Location", "Plan a suitable technical space close to the pool where practical, considering pipe routes, access and maintenance."],

            ["Services", "Coordinate electricity, ventilation, water supply and drainage with the building services engineers."],

            ["Maintenance", "Provide sufficient working space and access for equipment replacement and servicing."],

            ["Early decision", "Confirm the approximate technical space requirements with HM Pools and its equipment partner before finalising the floor plan."]
          ]
        }
      ]
    },
    {
      id: "upload", title: "Share your project", kind: "upload",
      blurb: "Send HM Pools your drawings and ideas, so the first consultation starts from your project instead of from zero.",
      formats: "PDF, DWG, IFC, JPG or PNG",
      accept: ".pdf,.dwg,.dxf,.ifc,.jpg,.jpeg,.png",
      helpful: ["Site plan and floor plans", "Sketches or 3D views of the pool area", "Photos of the site or the room", "Reference images of what the client likes"]
    }
  ];

  var order = ['use', 'install', 'type', 'dims', 'upload', 'plant', 'water', 'access', 'covers', 'lighting', 'features'];
  var reminders = {
    use: 'Who will use the pool? Its purpose determines which design requirements need to be considered from the start.',
    install: 'The site affects structural support, access for installation and building services. Start with where the pool will go.',
    type: 'Pool type affects the water level, edge detail and space for water treatment. Compare the options before recording a preference.',
    dims: 'Allow for more than the swimming area: depth, structure and access also affect the space needed. Approximate dimensions are welcome.',
    plant: 'Reserve space beyond the pool itself for water treatment and maintenance. Discuss this before finalising the floor plan.',
    water: 'The water source can affect treatment and material choices. Consider supply and drainage early.',
    access: 'Stairs, ladders and seating affect the usable swimming area. Consider who needs to enter and leave the pool.',
    covers: 'A cover can need storage space, tracks or changes to the pool edge. Consider it while planning the layout.',
    lighting: 'Light positions and cable routes need coordination before manufacturing. Explore the options even if your preference is not settled.',
    features: 'Extra features can require openings, equipment space and service connections. Record any interests or questions for the first discussion.'
  };
  HM.sections.sort(function(a,b) { return order.indexOf(a.id) - order.indexOf(b.id); });
  HM.sections.forEach(function(s) { s.intro = reminders[s.id] || ''; });
  HM.refs = [
    { key: "saana", name: "Saana of Kuopio", tag: "Infinity pool", img: "img/saana.jpg", url: "https://hmpools.fi/en/referenssi/saana-of-kuopio/" },
    { key: "uusimaa", name: "Private swimming pool, Uusimaa", tag: "Private pool", img: "img/uusimaa.jpg", url: "https://hmpools.fi/en/referenssi/private-swimming-pool-uusimaa/" },
    { key: "clarion", name: "Clarion Hotel Helsinki Airport", tag: "Steel hot tub", img: "img/clarion.jpg", url: "https://hmpools.fi/en/referenssi/clarion-hotel-helsinki-airport-en/" },
    { key: "terrace", name: "Swimming pool hidden under the terrace", tag: "Walk-on cover", img: "img/terrace.jpg", url: "https://hmpools.fi/en/referenssi/swimming-pool-hidden-under-the-terrace/" },
    { key: "mustasaari", name: "Mustasaari swimming pool", tag: "Public pool", img: "img/mustasaari.jpg", url: "https://hmpools.fi/en/referenssi/mustasaari-swimming-pool/" },
    { key: "valo", name: "VALO Hotel & Work", tag: "Pool and hot tub", img: "img/valo.jpg", url: "https://hmpools.fi/en/referenssi/valo-hotel-work-en/" },
    { key: "octola", name: "Luxury Action, Octola", tag: "Spa pool", img: "img/octola.jpg", url: "https://hmpools.fi/en/referenssi/luxury-action-octola-en/" },
    { key: "ilola", name: "Ilola Inn", tag: "Infinity pool", img: "img/ilola.jpg", url: "https://hmpools.fi/en/referenssi/ilola-inn-en/" },
    { key: "live", name: "Therapy pool for the Live foundation, Kuopio", tag: "Therapy pool", img: "img/live.jpg", url: "https://hmpools.fi/en/referenssi/therapy-pool-for-the-live-foundation-in-kuopio/" },
    { key: "kirkkonummi", name: "Private pool in Kirkkonummi", tag: "Private pool", img: "img/kirkkonummi.jpg", url: "https://hmpools.fi/en/referenssi/private-pool-in-kirkkonummi/" },
    { key: "duudson", name: "A swimming pool for Duudson", tag: "Cover and counter-current", img: "img/duudson.jpg", url: "https://hmpools.fi/en/referenssi/a-swimming-pool-for-duudson/" },
    { key: "raasepori", name: "A swimming pool for a private customer in Raasepori", tag: "Indoor private pool", img: "img/raasepori.jpg", url: "https://hmpools.fi/en/referenssi/a-swimming-pool-for-a-private-customer-in-raasepori/" },
    { key: "hakunila", name: "Modernization of the Hakunila swimming pool", tag: "Retrofit", img: "img/hakunila.jpg", url: "https://hmpools.fi/en/referenssi/modernization-of-the-hakunila-swimming-pool/" },
    { key: "oulu", name: "A swimming pool for a private customer in Oulu", tag: "Private pool", img: "img/oulu.jpg", url: "https://hmpools.fi/en/referenssi/a-swimming-pool-for-a-private-customer-in-oulu/" },
    { key: "ahtari", name: "Ähtäri swimming pool Loiske", tag: "Public pool", img: "img/ahtari.jpg", url: "https://hmpools.fi/en/referenssi/ahtari-swimming-pool-loiske/" },
    { key: "island-hottub", name: "Jacuzzi on the island", tag: "Private hot tub", img: "img/island-hottub.jpg", url: "https://hmpools.fi/en/referenssi/jacuzzi-on-the-island/" },
    { key: "villa-isola", name: "Swimming pool at Villa Isola", tag: "Private pool", img: "img/villa-isola.jpg", url: "https://hmpools.fi/en/referenssi/swimming-pool-at-villa-isola/" },
    { key: "indoor-private", name: "Kadetti of Munkkiniemi", tag: "Residents' spa pool", img: "img/indoor-private.jpg", url: "https://hmpools.fi/en/referenssi/kadetti-of-munkkiniemi/" },
    { key: "hamina", name: "The outdoor pool of the Linnoitus swimming hall", tag: "Outdoor public pool", img: "img/hamina.jpg", url: "https://hmpools.fi/en/referenssi/the-outdoor-pool-of-the-linnoitus-swimming-hall/" },
    { key: "sysma", name: "Sysmä swimming hall's rehabilitation pool", tag: "Rehab pool", img: "img/sysma.jpg", url: "https://hmpools.fi/en/referenssi/sysma-swimming-halls-rehabilitation-pool/" },
    { key: "kankaanpaa", name: "A swimming pool for a private customer in Kankaanpää", tag: "Private pool", img: "img/kankaanpaa.jpg", url: "https://hmpools.fi/en/referenssi/a-swimming-pool-for-a-private-customer-in-kankaanpaa/" },
    { key: "lehmonkarki", name: "Lehmonkärki Resort", tag: "Resort pool", img: "img/lehmonkarki.jpg", url: "https://hmpools.fi/referenssi/lehmonkarki-resort/" }
  ];

  /* Lets any option photo link to its project page. */
  HM.refByImg = {};
  HM.refs.forEach(function (r) { HM.refByImg[r.img] = r; });
  HM.refByImg["img/raasepori-2.jpg"] = HM.refByImg["img/raasepori.jpg"];
  HM.refByImg["img/live-cover.jpg"] = HM.refByImg["img/live.jpg"];

  HM.stats = {
    skimmer: [["Water level", "Below the edge"], ["Extra tank", "Not needed"], ["Edge precision", "Normal"], ["Relative cost", "€"]],
    overflow: [["Water level", "At the rim"], ["Extra tank", "Balance tank"], ["Edge precision", "High"], ["Relative cost", "€ €"]],
    infinity: [["Water level", "Over the edge"], ["Extra tank", "Catch trough"], ["Edge precision", "Very high"], ["Relative cost", "€ € €"]]
  };
})(window.HM = window.HM || {});
