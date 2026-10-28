const HOUR = 3_600_000;

function instant(value) {
  if (typeof value !== "string" ||
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.test(value)) {
    throw new TypeError("Use data e hora ISO com fuso explícito.");
  }
  const result = Date.parse(value);
  const day = value.slice(0, 10);
  const [year, month, date] = day.split("-").map(Number);
  const calendar = new Date(Date.UTC(year, month - 1, date));
  if (!Number.isFinite(result) || calendar.toISOString().slice(0, 10) !== day) {
    throw new TypeError("Data inválida.");
  }
  return result;
}

function money(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function windowBounds(value) {
  const start = instant(value?.start);
  const end = instant(value?.end);
  if (start > end) throw new RangeError("Janela invertida.");
  return [start, end];
}

function inside(value, [start, end]) {
  return value >= start && value <= end;
}

/**
 * Rank complete round-trip offers for the same passenger group.
 * Provider adapters are responsible for comparable all-in prices.
 * Returns copies; never mutates provider data.
 */
export function rankOffers(offers, query, mode = "balance") {
  if (!Array.isArray(offers)) throw new TypeError("Ofertas devem ser uma lista.");
  if (!["price", "time", "balance"].includes(mode)) throw new TypeError("Ordenação inválida.");
  if (!query || !/^[A-Z]{3}$/.test(query.origin) || !/^[A-Z]{3}$/.test(query.destination) ||
      query.origin === query.destination || !money(query.budgetCents)) {
    throw new TypeError("Rota ou orçamento inválido.");
  }
  const departureWindow = windowBounds(query.departureWindow);
  const returnWindow = windowBounds(query.returnWindow);
  const latestArrival = instant(query.latestArrival);
  const preferredDeparture = instant(query.preferredDeparture);
  const preferredArrival = instant(query.preferredArrival);
  const penalty = query.penaltyCentsPerHour ?? 3000;
  if (!money(penalty) || !inside(preferredDeparture, departureWindow) ||
      returnWindow[0] >= latestArrival || departureWindow[0] >= returnWindow[1] ||
      preferredArrival <= returnWindow[0] || preferredArrival > latestArrival) {
    throw new RangeError("Preferências incompatíveis com os limites.");
  }
  const results = [];
  for (const offer of offers) {
    try {
      if (!offer || typeof offer.id !== "string" || !offer.id.trim() ||
          offer.origin !== query.origin || offer.destination !== query.destination ||
          offer.currency !== "BRL" || !money(offer.totalCents) || offer.totalCents > query.budgetCents) continue;
      const departure = instant(offer.departure);
      const arrival = instant(offer.arrival);
      const returnDeparture = instant(offer.returnDeparture);
      const returnArrival = instant(offer.returnArrival);
      if (!(departure < arrival && arrival < returnDeparture && returnDeparture < returnArrival) ||
          !inside(departure, departureWindow) || !inside(returnDeparture, returnWindow) ||
          returnArrival > latestArrival) continue;
      const destinationHours = (returnDeparture - arrival) / HOUR;
      const deviationHours = (Math.abs(departure - preferredDeparture) +
        Math.abs(returnArrival - preferredArrival)) / HOUR;
      const balanceScore = offer.totalCents + deviationHours * penalty;
      if (!Number.isFinite(balanceScore)) continue;
      results.push({ ...offer, destinationHours, deviationHours, balanceScore });
    } catch {
      // An invalid provider offer must not prevent valid offers from appearing.
    }
  }
  const compare = {
    price: (a, b) => a.totalCents - b.totalCents || b.destinationHours - a.destinationHours,
    time: (a, b) => b.destinationHours - a.destinationHours || a.totalCents - b.totalCents,
    balance: (a, b) => a.balanceScore - b.balanceScore || a.totalCents - b.totalCents,
  }[mode];
  return results.sort((a, b) => compare(a, b) || a.id.localeCompare(b.id));
}
