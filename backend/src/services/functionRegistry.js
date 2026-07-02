

// for real data give me the welldefined history data for this function getCrowdHistory() about th jagrnnath temple on puri odisha so ill just copy and pes there













// backend/src/services/functionRegistry.js
// Real data implementation — no simulated data
// getLiveCrowd: reads crowdCache (in-memory) → falls back to calculateCurrentCrowd()
// getCrowdHistory: queries Historical model for current day + time slot
// getTempleSchedule, getFestivalSchedule: static data (no DB collection yet)

import { crowdCache } from "./crowdCache.js";
import { calculateCurrentCrowd } from "./crowdCalculator.js";
import Historical from "../models/historical.model.js";
import Gate from "../models/gate.model.js";
import { GATE_IDS } from "../constants/gates.js";

// ─── Gate name map (avoids a DB call on every chat message) ──────────────────
// Matches the order and IDs in constants/gates.js
const GATE_NAME_MAP = {
  "697ca74562e6a80637b9cedf": "North Gate (Singhadwara)",
  "697ca88262e6a80637b9cee1": "South Gate (Ashwadwara)",
  "697ca9dd62e6a80637b9cee3": "West Gate (Vyaghradwara)",
  "697cacee62e6a80637b9cee5": "East Gate (Hastidwara)",
};

// ─── Helper ───────────────────────────────────────────────────────────────────
function getCurrentTimeSlot() {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );
  const hour = now.getHours();
  if (hour >= 5  && hour < 9)  return "05-09";
  if (hour >= 9  && hour < 13) return "09-13";
  if (hour >= 13 && hour < 17) return "13-17";
  if (hour >= 17 && hour < 22) return "17-22";
  return null;
}

// ─── Data Source Functions ────────────────────────────────────────────────────

async function getLiveCrowd() {
  // For each gate: use crowdCache if warm, else calculate fresh
  const gates = await Promise.all(
    GATE_IDS.map(async (gateId) => {
      const cached = crowdCache[gateId];
      const data = cached ?? await calculateCurrentCrowd(gateId);

      return {
        name:        GATE_NAME_MAP[gateId] ?? gateId,
        crowdLevel:  data.crowdLevel,
        peopleRange: data.peopleRange,
        updatedAt:   data.updatedAt,
      };
    })
  );

  return {
    fetchedAt: new Date().toISOString(),
    gates,
  };
}

async function getCrowdHistory() {
  const day  = new Date().toLocaleString("en-US", { weekday: "long" });
  const slot = getCurrentTimeSlot();

  // Fetch historical records for all gates for today's time slot
  const records = slot
    ? await Historical.find({ dayOfWeek: day, timeSlot: slot })
        .populate("gateId", "name")
        .lean()
    : [];

  // Also fetch weekly peak/low summary per gate (all slots, today)
  const allTodayRecords = await Historical.find({ dayOfWeek: day }).lean();

  const summary = allTodayRecords.reduce((acc, r) => {
    const name = GATE_NAME_MAP[r.gateId?.toString()] ?? r.gateId?.toString();
    if (!acc[name]) acc[name] = [];
    acc[name].push({ slot: r.timeSlot, level: r.crowdLevel });
    return acc;
  }, {});

  return {
    fetchedAt:       new Date().toISOString(),
    today:           day,
    currentTimeSlot: slot ?? "Outside temple hours",
    currentSlotData: records.map((r) => ({
      gate:        GATE_NAME_MAP[r.gateId?._id?.toString() ?? r.gateId?.toString()] ?? "Unknown Gate",
      crowdLevel:  r.crowdLevel,
      peopleRange: r.peopleRange,
    })),
    todayByTimeSlot: summary,
  };
}

function getTempleSchedule() {
  return {
    fetchedAt: new Date().toISOString(),
    source: "Publicly available information",
    lastVerified: "2026-07",
    verificationLevel: "UNOFFICIAL",

    darshanHours: {
      opens: "05:00 AM",
      closes: "10:00 PM",
    },

    majorRituals: [
      { name: "Mangala Alati", time: "05:30 AM" },
      { name: "Mailam", time: "06:00 AM" },
      { name: "Abakasha", time: "06:30 AM" },
      { name: "Gopal Ballav Bhoga", time: "08:30 AM" },
      { name: "Sakala Dhupa", time: "09:00 AM - 10:00 AM" },
      { name: "Madhyahna Dhupa", time: "12:00 PM - 01:00 PM" },
      { name: "Sandhya Alati", time: "06:00 PM" },
      { name: "Sandhya Dhupa", time: "06:30 PM - 08:00 PM" },
      { name: "Badasinghara Besha", time: "09:00 PM - 10:00 PM" },
      { name: "Pahuda", time: "Around 10:00 PM" },
    ],

    disclaimer:
      "Temple rituals and darshan timings may change without prior notice due to festivals, special rituals, or administrative decisions. Visitors should always verify the latest timings through official SJTA announcements before planning their visit.",
  };
}

function getFestivalSchedule() {
  return {
    fetchedAt: new Date().toISOString(),
    source: "Publicly available information",
    lastVerified: "2026-07",
    verificationLevel: "UNOFFICIAL",

    majorFestivals: [
      "Snana Purnima",
      "Anasara",
      "Netrotsava",
      "Rath Yatra",
      "Bahuda Yatra",
      "Suna Besha",
      "Niladri Bije",
      "Chandan Yatra",
      "Dol Yatra",
      "Makar Sankranti",
    ],

    note:
      "Festival dates follow the Hindu lunar calendar and change every year.",

    disclaimer:
      "GateCrowd does not currently maintain an official live festival calendar. Please verify festival dates, darshan arrangements, and special rituals through official SJTA announcements before your visit.",
  };
}

// ─── Registry ─────────────────────────────────────────────────────────────────

const FUNCTION_REGISTRY = {
  LIVE_CROWD:        getLiveCrowd,
  CROWD_HISTORY:     getCrowdHistory,
  TEMPLE_SCHEDULE:   getTempleSchedule,
  FESTIVAL_SCHEDULE: getFestivalSchedule,
};

/**
 * Calls all functions matching the given intents
 * @param {string[]} intents
 * @returns {Promise<Object>} - { LIVE_CROWD: {...}, ... }
 */
export async function callFunctions(intents) {
  const results = {};

  for (const intent of intents) {
    const fn = FUNCTION_REGISTRY[intent];
    if (!fn) continue;

    try {
      results[intent] = await fn();
    } catch (error) {
      console.error(`[functionRegistry] ${intent} failed:`, error.message);
      results[intent] = null; // contextBuilder handles null gracefully
    }
  }

  return results;
}