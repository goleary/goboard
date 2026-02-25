export interface Station {
  slug: string;
  name: string;
  northboundStopId: string;
  southboundStopId: string;
}

// 1 Line stops from Lynnwood to Federal Way, ordered north to south
export const stations: Station[] = [
  { slug: "lynnwood", name: "Lynnwood City Center", northboundStopId: "40_N23-T1", southboundStopId: "40_N23-T2" },
  { slug: "mountlake-terrace", name: "Mountlake Terrace", northboundStopId: "40_N19-T1", southboundStopId: "40_N19-T2" },
  { slug: "shoreline-north", name: "Shoreline North/185th", northboundStopId: "40_N17-T1", southboundStopId: "40_N17-T2" },
  { slug: "shoreline-south", name: "Shoreline South/148th", northboundStopId: "40_N15-T1", southboundStopId: "40_N15-T2" },
  { slug: "northgate", name: "Northgate", northboundStopId: "40_990006", southboundStopId: "40_990005" },
  { slug: "roosevelt", name: "Roosevelt", northboundStopId: "40_990004", southboundStopId: "40_990003" },
  { slug: "u-district", name: "U District", northboundStopId: "40_990002", southboundStopId: "40_990001" },
  { slug: "uw", name: "Univ of Washington", northboundStopId: "40_99605", southboundStopId: "40_99604" },
  { slug: "capitol-hill", name: "Capitol Hill", northboundStopId: "40_99603", southboundStopId: "40_99610" },
  { slug: "westlake", name: "Westlake", northboundStopId: "40_1121", southboundStopId: "40_1108" },
  { slug: "symphony", name: "Symphony", northboundStopId: "40_565", southboundStopId: "40_455" },
  { slug: "pioneer-square", name: "Pioneer Square", northboundStopId: "40_532", southboundStopId: "40_501" },
  { slug: "chinatown", name: "Int'l Dist/Chinatown", northboundStopId: "40_621", southboundStopId: "40_623" },
  { slug: "stadium", name: "Stadium", northboundStopId: "40_99260", southboundStopId: "40_99101" },
  { slug: "sodo", name: "SODO", northboundStopId: "40_99256", southboundStopId: "40_99111" },
  { slug: "beacon-hill", name: "Beacon Hill", northboundStopId: "40_99240", southboundStopId: "40_99121" },
  { slug: "mount-baker", name: "Mount Baker", northboundStopId: "40_55860", southboundStopId: "40_55949" },
  { slug: "columbia-city", name: "Columbia City", northboundStopId: "40_55778", southboundStopId: "40_56039" },
  { slug: "othello", name: "Othello", northboundStopId: "40_55656", southboundStopId: "40_56159" },
  { slug: "rainier-beach", name: "Rainier Beach", northboundStopId: "40_55578", southboundStopId: "40_56173" },
  { slug: "tukwila", name: "Tukwila Int'l Blvd", northboundStopId: "40_99905", southboundStopId: "40_99900" },
  { slug: "seatac", name: "SeaTac/Airport", northboundStopId: "40_99903", southboundStopId: "40_99904" },
  { slug: "angle-lake", name: "Angle Lake", northboundStopId: "40_99913", southboundStopId: "40_99914" },
  { slug: "kent-des-moines", name: "Kent Des Moines", northboundStopId: "40_S03-T1", southboundStopId: "40_S03-T2" },
  { slug: "star-lake", name: "Star Lake", northboundStopId: "40_S05-T1", southboundStopId: "40_S05-T2" },
  { slug: "federal-way", name: "Federal Way Downtown", northboundStopId: "40_S07-T1", southboundStopId: "40_S07-T2" },
];

export const DEFAULT_STATION = "columbia-city";

export function getStationBySlug(slug: string): Station | undefined {
  return stations.find((s) => s.slug === slug);
}
