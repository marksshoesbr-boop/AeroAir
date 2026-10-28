import test from "node:test";
import assert from "node:assert/strict";
import { rankOffers } from "../src/search.js";

const query = {
  origin: "VCP", destination: "SDU", budgetCents: 80000,
  departureWindow: { start: "2026-10-30T18:00:00-03:00", end: "2026-10-30T22:00:00-03:00" },
  returnWindow: { start: "2026-11-01T18:00:00-03:00", end: "2026-11-02T05:00:00-03:00" },
  latestArrival: "2026-11-02T07:00:00-03:00",
  preferredDeparture: "2026-10-30T19:00:00-03:00",
  preferredArrival: "2026-11-01T23:00:00-03:00",
};
const base = {
  id: "ideal", origin: "VCP", destination: "SDU", currency: "BRL", totalCents: 70000,
  departure: "2026-10-30T19:00:00-03:00", arrival: "2026-10-30T20:00:00-03:00",
  returnDeparture: "2026-11-01T22:00:00-03:00", returnArrival: "2026-11-01T23:00:00-03:00",
};
test("limites obrigatórios prevalecem sobre preço baixo", () => {
  assert.equal(rankOffers([{...base, totalCents:100, departure:"2026-10-30T17:59:00-03:00"}], query).length, 0);
  assert.equal(rankOffers([{...base, returnArrival:"2026-11-02T07:01:00-03:00"}], query).length, 0);
  assert.equal(rankOffers([{...base, returnDeparture:"2026-11-01T17:59:00-03:00"}], query).length, 0);
});
test("limites inclusivos e chegada na segunda-feira", () => {
  const result = rankOffers([{...base, totalCents:80000, departure:query.departureWindow.start,
    returnDeparture:query.returnWindow.end, returnArrival:query.latestArrival}], query);
  assert.equal(result.length, 1);
  assert.equal(result[0].destinationHours, 57);
});
test("ordena por preço, tempo ou equilíbrio sem alterar entrada", () => {
  const cheaper = {...base, id:"barato", totalCents:65000, departure:"2026-10-30T21:00:00-03:00", arrival:"2026-10-30T22:00:00-03:00"};
  const input = [cheaper, base];
  const copy = structuredClone(input);
  assert.equal(rankOffers(input, query, "price")[0].id, "barato");
  assert.equal(rankOffers(input, query, "time")[0].id, "ideal");
  assert.equal(rankOffers(input, query, "balance")[0].id, "ideal");
  assert.deepEqual(input, copy);
});
test("compara instantes equivalentes em fusos diferentes", () => {
  const result = rankOffers([{...base, departure:"2026-10-30T22:00:00Z"}], query);
  assert.equal(result[0].deviationHours, 0);
});
test("rejeita oferta inválida e mantém as demais", () => {
  for (const bad of [
    {totalCents:80001}, {totalCents:-1}, {totalCents:1.5}, {currency:"USD"},
    {origin:"GRU"}, {destination:"REC"}, {departure:"2026-10-30T19:00:00"},
    {arrival:base.departure}, {returnDeparture:base.arrival},
    {returnArrival:base.returnDeparture}, {arrival:"2026-02-30T20:00:00-03:00"},
  ]) assert.deepEqual(rankOffers([{...base,...bad}, base], query).map(x=>x.id), ["ideal"]);
});
test("consulta inválida falha explicitamente; oferta vazia não é inventada", () => {
  assert.deepEqual(rankOffers([], query), []);
  assert.throws(()=>rankOffers([], {...query,budgetCents:-1}));
  assert.throws(()=>rankOffers([], {...query,departureWindow:{start:query.departureWindow.end,end:query.departureWindow.start}}));
  assert.throws(()=>rankOffers([], {...query,preferredDeparture:"2026-10-30T17:00:00-03:00"}));
  assert.throws(()=>rankOffers([], query, "unknown"));
});
