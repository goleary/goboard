// Secondary current stations from CHS Tide and Current Tables Volume 5, Table 4.
// Predictions are computed by applying time differences and speed percentages
// to the reference station predictions.

export interface SecondaryCurrentStation {
  code: string;
  name: string;
  lat: number;
  lng: number;
  floodDir: number; // degrees true
  referenceStation: string; // code of reference station
  timeDifferences: {
    turnToFlood: number;  // minutes
    maxFlood: number;     // minutes
    turnToEbb: number;    // minutes
    maxEbb: number;       // minutes
  };
  // Speed is either a percentage of reference station rate,
  // or an absolute max rate in knots (if percentRate is false).
  speed: {
    flood: number;
    ebb: number;
    percentRate: boolean; // true = percentage of reference, false = absolute knots
  };
}

// Reference station codes for lookup:
// 07100 = Juan de Fuca - East
// 07090 = Race Passage
// 07527 = Active Pass
// 07487 = Dodd Narrows
// 07845 = Sechelt Rapids
// 07795 = Point Atkinson (tide reference, used for Malibu Rapids)

export const SECONDARY_CURRENT_STATIONS: SecondaryCurrentStation[] = [
  // on Juan de Fuca - East
  {
    code: "07015",
    name: "River Jordan",
    lat: 48.319,
    lng: -124.05,
    floodDir: 110,
    referenceStation: "07100",
    timeDifferences: { turnToFlood: -50, maxFlood: -30, turnToEbb: -15, maxEbb: -25 },
    speed: { flood: 70, ebb: 70, percentRate: true },
  },

  // on Race Passage
  {
    code: "07251",
    name: "Baynes Channel",
    lat: 48.433,
    lng: -123.267,
    floodDir: 40,
    referenceStation: "07090",
    timeDifferences: { turnToFlood: -15, maxFlood: -15, turnToEbb: -15, maxEbb: -15 },
    speed: { flood: 75, ebb: 75, percentRate: true },
  },
  {
    code: "07245",
    name: "Haro Strait (Hamley Pt.)",
    lat: 48.583,
    lng: -123.233,
    floodDir: 350,
    referenceStation: "07090",
    timeDifferences: { turnToFlood: 85, maxFlood: 95, turnToEbb: 150, maxEbb: 100 },
    speed: { flood: 45, ebb: 45, percentRate: true },
  },
  {
    code: "07257",
    name: "Sidney Channel",
    lat: 48.617,
    lng: -123.333,
    floodDir: 330,
    referenceStation: "07090",
    timeDifferences: { turnToFlood: 60, maxFlood: 90, turnToEbb: 90, maxEbb: 40 },
    speed: { flood: 35, ebb: 30, percentRate: true },
  },
  {
    code: "07335",
    name: "Swanson Channel",
    lat: 48.783,
    lng: -123.333,
    floodDir: 330,
    referenceStation: "07090",
    timeDifferences: { turnToFlood: 100, maxFlood: 85, turnToEbb: 85, maxEbb: 95 },
    speed: { flood: 25, ebb: 20, percentRate: true },
  },
  {
    code: "07343",
    name: "Boundary Passage",
    lat: 48.75,
    lng: -123.083,
    floodDir: 70,
    referenceStation: "07090",
    timeDifferences: { turnToFlood: 60, maxFlood: 70, turnToEbb: 60, maxEbb: 70 },
    speed: { flood: 50, ebb: 40, percentRate: true },
  },
  {
    code: "07422",
    name: "Trincomali Channel",
    lat: 48.883,
    lng: -123.45,
    floodDir: 320,
    referenceStation: "07090",
    timeDifferences: { turnToFlood: 35, maxFlood: 50, turnToEbb: 50, maxEbb: 45 },
    speed: { flood: 15, ebb: 15, percentRate: true },
  },

  // on Active Pass
  {
    code: "07520",
    name: "Georgeson Passage",
    lat: 48.833,
    lng: -123.233,
    floodDir: 315,
    referenceStation: "07527",
    timeDifferences: { turnToFlood: -15, maxFlood: -40, turnToEbb: -45, maxEbb: -30 },
    speed: { flood: 50, ebb: 55, percentRate: true },
  },
  {
    code: "07513",
    name: "Boat Passage",
    lat: 48.817,
    lng: -123.183,
    floodDir: 55,
    referenceStation: "07527",
    timeDifferences: { turnToFlood: -15, maxFlood: -40, turnToEbb: -45, maxEbb: -30 },
    speed: { flood: 100, ebb: 100, percentRate: true },
  },
  {
    code: "07312",
    name: "Sansum Narrows",
    lat: 48.783,
    lng: -123.55,
    floodDir: 0,
    referenceStation: "07527",
    timeDifferences: { turnToFlood: 25, maxFlood: 0, turnToEbb: -35, maxEbb: 0 },
    speed: { flood: 3.0, ebb: 3.0, percentRate: false },
  },

  // on Dodd Narrows
  {
    code: "07488",
    name: "False Narrows",
    lat: 49.133,
    lng: -123.783,
    floodDir: 295,
    referenceStation: "07487",
    timeDifferences: { turnToFlood: 10, maxFlood: 25, turnToEbb: 25, maxEbb: -35 },
    speed: { flood: 50, ebb: 55, percentRate: true },
  },

  // on Sechelt Rapids
  {
    code: "07849",
    name: "Tzoonie Narrows",
    lat: 49.717,
    lng: -123.767,
    floodDir: 50,
    referenceStation: "07845",
    timeDifferences: { turnToFlood: 10, maxFlood: 10, turnToEbb: 10, maxEbb: 10 },
    speed: { flood: 20, ebb: 20, percentRate: true },
  },
];
