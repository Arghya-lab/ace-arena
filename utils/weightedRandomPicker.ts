export default function weightedRandomPicker(weights: number[]): number {
  const totalWeights = weights.reduce((acc, weight) => (acc += weight), 0);

  const weightsPercents = weights.map((weight) =>
    Math.round((weight * 100) / totalWeights)
  );

  const numberDistribution = weightsPercents.map(
    (percent, id) =>
      percent +
      weightsPercents.slice(0, id).reduce((acc, weight) => acc + weight, 0)
  );

  for (let i = 0; i < numberDistribution.length; i++) {
    const num = numberDistribution[i];

    if (num > Math.floor(Math.random() * 100) + 1) {
      return i + 1;
    }
  }

  return weights.length;
}
