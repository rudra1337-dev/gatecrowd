import { http } from './httpClient';

const CACHE_KEY = 'gatecrowd_gate_cache_v2';
const CACHE_TTL_MS = 1000 * 60 * 2;

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1584531001915-0b13f5d7499b?auto=format&fit=crop&w=1200&q=80';

const metadataByName = {
  singhadwara: {
    direction: 'North',
    busyHours: '7:00 AM - 11:00 AM',
    importance: 'Primary ritual gateway with highest symbolic prominence.'
  },
  ashwadwara: {
    direction: 'South',
    busyHours: '11:30 AM - 2:30 PM',
    importance: 'Named after the horse motif and connected with temple movement logistics.'
  },
  vyaghradwara: {
    direction: 'West',
    busyHours: '5:00 PM - 8:30 PM',
    importance: 'Traditionally used for controlled flow and alternative access.'
  },
  hastidwara: {
    direction: 'East',
    busyHours: '6:00 AM - 9:30 AM',
    importance: 'Associated with elephant iconography and ceremonial transitions.'
  }
};

const crowdRangeToValue = {
  '0-30': 15,
  '31-60': 45,
  '61-90': 75,
  '91-120': 105,
  '120+': 130
};

async function fetchJson(path) {
  const response = await http.get(path);
  return response.data;
}


function getMetadata(gateName = '') {
  const normalized = gateName.toLowerCase();

  if (normalized.includes('singha')) {
    return metadataByName.singhadwara;
  }
  if (normalized.includes('ashwa')) {
    return metadataByName.ashwadwara;
  }
  if (normalized.includes('vyagh')) {
    return metadataByName.vyaghradwara;
  }
  if (normalized.includes('hasti')) {
    return metadataByName.hastidwara;
  }

  return {
    direction: 'N/A',
    busyHours: 'Varies by ritual schedule',
    importance: 'Historic temple access point for devotees.'
  };
}

function normalizeGate(gate, crowdData) {
  const metadata = getMetadata(gate?.name);
  const peopleRange = crowdData?.peopleRange || '31-60';

  return {
    id: gate._id,
    name: gate.name || 'Unknown Gate',
    description: gate.description || 'Gate information will be updated shortly.',
    detail: gate.description || 'Live gate detail feed connected from backend data source.',
    direction: metadata.direction,
    busyHours: metadata.busyHours,
    importance: metadata.importance,
    image: gate.photoUrl || DEFAULT_IMAGE,
    crowdLevel: crowdRangeToValue[peopleRange] || 45,
    crowdLabel: crowdData?.crowdLevel || 'MODERATE',
    peopleRange
  };
}

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > CACHE_TTL_MS) {
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
}

function saveCache(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data
      })
    );
  } catch {
    // Ignore cache write failures.
  }
}

export async function getGateCrowd(gateId) {
  const crowdData = await fetchJson(`/crowd/${gateId}`);
  return {
    crowdLevel: crowdRangeToValue[crowdData?.peopleRange] || 45,
    crowdLabel: crowdData?.crowdLevel || 'MODERATE',
    peopleRange: crowdData?.peopleRange || '31-60'
  };
}

export async function getGates(forceRefresh = false) {
  if (!forceRefresh) {
    const cached = loadCache();
    if (cached) {
      return cached;
    }
  }

  const gates = await fetchJson('/gates');

  const normalizedGates = await Promise.all(
    gates.map(async (gate) => {
      try {
        const crowdData = await fetchJson(`/crowd/${gate._id}`);
        return normalizeGate(gate, crowdData);
      } catch {
        return normalizeGate(gate, { crowdLevel: 'MODERATE', peopleRange: '31-60' });
      }
    })
  );

  saveCache(normalizedGates);
  return normalizedGates;
}
