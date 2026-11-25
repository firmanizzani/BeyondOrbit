export function journalPlanets(planets, discovered, system = 'all', status = 'all') {
  return planets.filter(
    (p) =>
      (system === 'all' || p.system === system) &&
      (status === 'all' ||
        (status === 'discovered' ? discovered.has(p.id) : !discovered.has(p.id))),
  );
}
export function discoveryProgress(planets, discovered) {
  const found = planets.filter((p) => discovered.has(p.id)).length;
  return {
    found,
    total: planets.length,
    percent: Math.round((found / planets.length) * 100),
  };
}
