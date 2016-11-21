// ——————————————————————————————————————————————————
// Random
// ——————————————————————————————————————————————————

const mask = 0x7FFFFFFF;

const Random = () =>
  (Random.seed = (Random.seed * 16807) % mask) / mask + 2.33e-10;

Random.seed = 1;

Random.mutate = () => Random.seed = Math.random() * mask;

Random.float = (min, max) => {
  if (max == null) max = min, min = 0;
  return min + Random() * (max - min);
};

Random.int = (min, max) => Math.round(Random.float(min, max));

Random.sign = (chance = 0.5) => Random() >= chance ? -1 : 1;

Random.bool = (chance = 0.5) => Random() < chance;

Random.bit = (chance = 0.5) => Random() < chance ? 0 : 1;

Random.item = (list) => list[~~((Random()) * list.length)];

Random.mutate();

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Random;