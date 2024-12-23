export const NONE = { text: "(none)", value: "NONE" };

export const POPULATIONS = [
  { text: "African", value: "AFRICAN" },
  { text: "Native American", value: "AMERICAN" },
  { text: "East Asian", value: "EAST_ASIAN" },
  { text: "European", value: "EUROPEAN" },
  { text: "South Asian", value: "SOUTH_ASIAN" },
];

export const SUBPOPULATIONS: Map<string, { text: string; value: string }[]> = new Map([
  [
    "AFRICAN",
    [
      NONE,
      { text: "Gambian", value: "GAMBIAN" },
      { text: "Mende", value: "MENDE" },
      { text: "Easn", value: "ESAN" },
      { text: "African American", value: "AFRICAN_AMERICAN" },
      { text: "African Caribbean", value: "AFRICAN_CARIBBEAN" },
    ],
  ],
  [
    "AMERICAN",
    [
      NONE,
      { text: "Mexican", value: "MEXICAN" },
      { text: "Puerto Rican", value: "PUERTO_RICAN" },
      { text: "Colombian", value: "COLOMBIAN" },
      { text: "Peruvian", value: "PERUVIAN" },
      { text: "Southern Han Chinese", value: "SOUTHERN_HAN_CHINESE" },
    ],
  ],
  [
    "EAST_ASIAN",
    [
      NONE,
      { text: "Han Chinese from Beijing", value: "HAN_CHINESE_BEIJING" },
      { text: "Japanese", value: "JAPANESE" },
      { text: "Dai", value: "DAI" },
      { text: "Kinh", value: "KINH" },
      { text: "Southern Han Chinese", value: "SOUTHERN_HAN_CHINESE" },
    ],
  ],
  [
    "EUROPEAN",
    [
      NONE,
      { text: "Iberian", value: "IBERIAN" },
      { text: "British", value: "BRITISH" },
      { text: "Finnish", value: "FINNISH" },
      { text: "Toscani", value: "TOSCANI" },
      {
        text: "Utah resident northwest European",
        value: "UTAH_RESIDENT_NW_EUROPEAN",
      },
    ],
  ],
  [
    "SOUTH_ASIAN",
    [
      NONE,
      { text: "Gujarati", value: "GUJARATI" },
      { text: "Punjabi", value: "PUNJABI" },
      { text: "Bengali", value: "BENGALI" },
      { text: "Sri Lankan Tamil", value: "SRI_LANKAN_TAMIL" },
      { text: "Indian Telugu", value: "INDIAN_TELUGU" },
    ],
  ],
]);
