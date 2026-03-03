import type { BookingProviderConfig } from "@/data/saunas/saunas";
import type { AppointmentTypeAvailability } from "../types";

import { fetchAcuityAvailability } from "./acuity";
import { fetchWixAvailability } from "./wix";
import { fetchGlofoxAvailability } from "./glofox";
import { fetchPeriodeAvailability } from "./periode";
import { fetchMarianaTekAvailability } from "./mariana-tek";
import { fetchFareHarborAvailability } from "./fareharbor";
import { fetchZenotiAvailability } from "./zenoti";
import { fetchBookerAvailability } from "./booker";
import { fetchSimplyBookAvailability } from "./simplybook";
import { fetchZettlorAvailability } from "./zettlor";
import { fetchTrybeAvailability } from "./trybe";
import {
  fetchVagaroAvailability,
  fetchVagaroClassAvailability,
} from "./vagaro";
import { fetchCheckfrontAvailability } from "./checkfront";
import { fetchPeekAvailability } from "./peek";
import { fetchSquareAvailability } from "./square";
import { fetchMindbodyAvailability } from "./mindbody";
import { fetchClinicSenseAvailability } from "./clinicsense";
import { fetchMangomintAvailability } from "./mangomint";
import { fetchRollerAvailability } from "./roller";
import { fetchBoulevardAvailability } from "./boulevard";
import { fetchSojoAvailability } from "./sojo";

export async function fetchForProvider(
  provider: BookingProviderConfig,
  startDate: string
): Promise<AppointmentTypeAvailability[]> {
  switch (provider.type) {
    case "acuity":
      return fetchAcuityAvailability(provider, startDate);
    case "wix":
      return fetchWixAvailability(provider, startDate);
    case "glofox":
      return fetchGlofoxAvailability(provider, startDate);
    case "periode":
      return fetchPeriodeAvailability(provider, startDate);
    case "mariana-tek":
      return fetchMarianaTekAvailability(provider, startDate);
    case "fareharbor":
      return fetchFareHarborAvailability(provider, startDate);
    case "zenoti":
      return fetchZenotiAvailability(provider, startDate);
    case "booker":
      return fetchBookerAvailability(provider, startDate);
    case "simplybook":
      return fetchSimplyBookAvailability(provider, startDate);
    case "zettlor":
      return fetchZettlorAvailability(provider, startDate);
    case "trybe":
      return fetchTrybeAvailability(provider, startDate);
    case "vagaro":
      return provider.isClassBased
        ? fetchVagaroClassAvailability(provider, startDate)
        : fetchVagaroAvailability(provider, startDate);
    case "checkfront":
      return fetchCheckfrontAvailability(provider, startDate);
    case "peek":
      return fetchPeekAvailability(provider, startDate);
    case "square":
      return fetchSquareAvailability(provider, startDate);
    case "mindbody":
      return fetchMindbodyAvailability(provider, startDate);
    case "clinicsense":
      return fetchClinicSenseAvailability(provider, startDate);
    case "mangomint":
      return fetchMangomintAvailability(provider, startDate);
    case "roller":
      return fetchRollerAvailability(provider, startDate);
    case "boulevard":
      return fetchBoulevardAvailability(provider, startDate);
    case "sojo":
      return fetchSojoAvailability(provider, startDate);
  }
}
