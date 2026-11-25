// Shared limits keep manual flight, autopilot, sound, and instruments consistent.
export const FLIGHT = Object.freeze({
  acceleration: 170,
  cruiseSpeed: 210,
  boostAcceleration: 340,
  boostSpeed: 320,
  drag: 0.42,
  lateralDrag: 8,
  brakeDrag: 7,
});
