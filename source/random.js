// ——————————————————————————————————————————————————
// Random
// ——————————————————————————————————————————————————

const mask = 0x7FFFFFFF;

const isNumber = (value) =>
  typeof value === 'number' && !isNaN(value);

const Random = () =>
  (Random.seed = (Random.seed * 16807) % mask) / mask + 2.33e-10;

Random.seed = 1;

Random.mutate = () =>
  Random.seed = Math.random() * mask;

Random.float = (min, max) => {
  if (!isNumber(min)) min = 0;
  else if (!isNumber(max)) max = min, min = 0;
  return min + Random() * (max - min);
};

Random.float = (min, max) => {
  if (!isNumber(min)) min = 0;
  else if (!isNumber(max)) max = min, min = 0;
  return min + Random() * (max - min);
};

Random.int = (min, max) =>
  Math.round(Random.float(min, max));

Random.sign = (chance) =>
  Random() >= (isNumber(chance) ? chance : 0.5) ? -1 : 1;

Random.bool = (chance) =>
  Boolean(Random() < (isNumber(chance) ? chance : 0.5));

Random.bit = (chance) =>
  Number(Random() < (isNumber(chance) ? chance : 0.5));

Random.item = (list) =>
  list[~~((Random()) * list.length)];

Random.mutate();

// ——————————————————————————————————————————————————
// Exports
// ——————————————————————————————————————————————————

export default Random;