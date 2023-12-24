const RESOURCES = Object.freeze({
  minerals: [
    {
      name: "Quartz",
      categories: ["crystal"],
      description:
        "A crystalline mineral composed of silicon and oxygen atoms.",
      harvest_time: 8,
      yield: 2,
      hardness: 7,
      colors: ["#ffffff"],
    },
    {
      name: "Feldspar",
      categories: ["natural-rock"],
      description:
        "The most abundant mineral group, often found in igneous rocks.",
      harvest_time: 10,
      yield: 3,
      hardness: 6,
      colors: ["#ff7f7f", "#ffffff", "#999999", "#4b2400", "#0058d6"],
    },
    {
      name: "Hematite",
      categories: ["crystal"],
      description:
        "An iron ore known for its metallic luster and dark coloration.",
      harvest_time: 12,
      yield: 4,
      hardness: 5.5,
      colors: ["#eeeeee", "#ffaaaa", "#4b2400"],
    },
    {
      name: "Calcite",
      categories: ["bedrock"],
      description:
        "A carbonate mineral with a wide range of colors and crystal forms.",
      harvest_time: 15,
      yield: 2,
      hardness: 3,
      colors: ["#ffffff", "#eeeeff"],
    },
  ],
});
