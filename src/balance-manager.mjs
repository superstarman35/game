export const DEFAULT_ENDING_BALANCE_TARGETS = Object.freeze({
  minimumRuns: 100,
  minimumUniqueEndings: 5,
  maximumDominantShare: 0.51
});

export function summarizeEndingDistribution(endingIds = []) {
  const counts = endingIds.reduce((result, id) => {
    if (typeof id === "string" && id) result[id] = (result[id] ?? 0) + 1;
    return result;
  }, {});
  const ranked = Object.entries(counts).sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]));
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
  const [dominantId = null, dominantCount = 0] = ranked[0] ?? [];
  return {
    total,
    uniqueEndings: ranked.length,
    counts,
    dominant: {
      id: dominantId,
      count: dominantCount,
      share: total ? dominantCount / total : 0
    }
  };
}

export function evaluateEndingBalance(endingIds, targets = DEFAULT_ENDING_BALANCE_TARGETS) {
  const summary = summarizeEndingDistribution(endingIds);
  return {
    ...summary,
    balanced: summary.total >= targets.minimumRuns
      && summary.uniqueEndings >= targets.minimumUniqueEndings
      && summary.dominant.share <= targets.maximumDominantShare
  };
}
