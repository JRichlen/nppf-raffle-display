import { Winner } from "../types/winner";
import { Prize } from "../types/prize";
import { Claim, ClaimSource } from "../types/claim";

// Cache for getUnclaimedPrizes results
const unclaimedPrizesCache = new Map<string, Array<Prize>>();

function clearUnclaimedPrizesCacheForWinner(winner: Winner): void {
  const cacheKeys = Array.from(unclaimedPrizesCache.keys());
  const previousCacheKey = cacheKeys.find(key => key.startsWith(winner.id));

  if (previousCacheKey) {
    unclaimedPrizesCache.delete(previousCacheKey);
  }
}

export function getUnclaimedPrizes(winner: Winner): Array<Prize> {
  // Create a cache key based on winner data
  const cacheKey = `${winner.id}-${winner.claims.length}-${winner.prizes.length}`;
  
  if (unclaimedPrizesCache.has(cacheKey)) {
    return unclaimedPrizesCache.get(cacheKey)!;
  } else {
    clearUnclaimedPrizesCacheForWinner(winner);
  }

  const claimedPrizes = winner.claims.flatMap(claim => claim.prizeIds);
  const unclaimedPrizes = winner.prizes.filter(prize => !claimedPrizes.includes(prize.id));
  
  unclaimedPrizesCache.set(cacheKey, unclaimedPrizes);
  return unclaimedPrizes;
}

export function getWinnersWithUnclaimedPrizes(winners: Array<Winner>): Array<Winner> {
  return winners.filter(winner => getUnclaimedPrizes(winner).length);
}

export function getTotalPrizes(winners: Array<Winner>): number {
  return winners.reduce((total, winner) => total + winner.prizes.length, 0);
}

export function getTotalClaims(winners: Array<Winner>): number {
  return winners.reduce((total, winner) => 
    total + winner.claims.reduce((claimTotal, claim) => claimTotal + claim.prizeIds.length, 0), 
  0);
}

export function getTotalUnclaimed(winners: Array<Winner>): number {
  return winners.reduce((total, winner) => 
    total + getUnclaimedPrizes(winner).length, 
  0);
}

export function getUniqueWinnersCount(winners: Array<Winner>): number {
  return winners.length;
}

interface TimeSeriesDataPoint {
  timestamp: Date;
  prizes: number;
  claims: number;
}

export function getTimeSeriesData(winners: Array<Winner>): TimeSeriesDataPoint[] {
  // Collect all prizes and claims with timestamps
  const allPrizes = winners.flatMap(w => w.prizes.map(p => ({ timestamp: p.timestamp, type: 'prize' as const })));
  const allClaims = winners.flatMap(w => 
    w.claims.flatMap(c => Array(c.prizeIds.length).fill({ timestamp: c.timestamp, type: 'claim' as const }))
  );

  if (allPrizes.length === 0) return [];

  // Find time range
  const timestamps = [...allPrizes, ...allClaims].map(x => x.timestamp);
  const minTime = new Date(Math.min(...timestamps.map(t => t.getTime())));
  const maxTime = new Date(Math.max(...timestamps.map(t => t.getTime())));

  // Create 5-minute intervals
  const intervalMs = 5 * 60 * 1000; // 5 minutes in milliseconds
  const intervals: TimeSeriesDataPoint[] = [];
  
  for (let time = minTime.getTime(); time <= maxTime.getTime(); time += intervalMs) {
    const intervalEnd = new Date(time + intervalMs);
    const prizesInInterval = allPrizes.filter(p => 
      p.timestamp.getTime() <= intervalEnd.getTime() &&
      p.timestamp.getTime() > time
    ).length;
    const claimsInInterval = allClaims.filter(c => 
      c.timestamp.getTime() <= intervalEnd.getTime() &&
      c.timestamp.getTime() > time
    ).length;

    intervals.push({
      timestamp: new Date(time),
      prizes: prizesInInterval,
      claims: claimsInInterval
    });
  }

  return intervals;
}

export function getCumulativeTimeSeriesData(winners: Array<Winner>): TimeSeriesDataPoint[] {
  const timeSeriesData = getTimeSeriesData(winners);
  let cumulativePrizes = 0;
  let cumulativeClaims = 0;

  return timeSeriesData.map(point => {
    cumulativePrizes += point.prizes;
    cumulativeClaims += point.claims;
    return {
      timestamp: point.timestamp,
      prizes: cumulativePrizes,
      claims: cumulativeClaims
    };
  });
}

/**
 * Returns the average time (in minutes) between winning a prize and claiming it
 */
export function getAverageTimeToClaim(winners: Array<Winner>): number {
  const claimTimes: number[] = [];
  
  winners.forEach(winner => {
    winner.claims.forEach(claim => {
      claim.prizeIds.forEach(prizeId => {
        const prize = winner.prizes.find(p => p.id === prizeId);
        if (prize) {
          const prizeTime = new Date(prize.timestamp).getTime();
          const claimTime = new Date(claim.timestamp).getTime();
          const timeDiffMinutes = (claimTime - prizeTime) / (1000 * 60);
          claimTimes.push(timeDiffMinutes);
        }
      });
    });
  });
  
  if (claimTimes.length === 0) return 0;
  
  return claimTimes.reduce((sum, time) => sum + time, 0) / claimTimes.length;
}

/**
 * Returns the median time (in minutes) between winning a prize and claiming it
 */
export function getMedianTimeToClaim(winners: Array<Winner>): number {
  const claimTimes: number[] = [];
  
  winners.forEach(winner => {
    winner.claims.forEach(claim => {
      claim.prizeIds.forEach(prizeId => {
        const prize = winner.prizes.find(p => p.id === prizeId);
        if (prize) {
          const prizeTime = new Date(prize.timestamp).getTime();
          const claimTime = new Date(claim.timestamp).getTime();
          const timeDiffMinutes = (claimTime - prizeTime) / (1000 * 60);
          claimTimes.push(timeDiffMinutes);
        }
      });
    });
  });
  
  if (claimTimes.length === 0) return 0;
  
  const sortedTimes = [...claimTimes].sort((a, b) => a - b);
  const middle = Math.floor(sortedTimes.length / 2);
  
  if (sortedTimes.length % 2 === 0) {
    return (sortedTimes[middle - 1] + sortedTimes[middle]) / 2;
  } else {
    return sortedTimes[middle];
  }
}

/**
 * Returns the claim rate as a percentage (0-100) of prizes that have been claimed
 */
export function getClaimRate(winners: Array<Winner>): number {
  const totalPrizes = getTotalPrizes(winners);
  if (totalPrizes === 0) return 0;
  
  const totalClaims = getTotalClaims(winners);
  return (totalClaims / totalPrizes) * 100;
}

/**
 * Returns counts of claims by source (DISPLAY vs ADMIN)
 */
export function getClaimsBySource(winners: Array<Winner>): Record<ClaimSource, number> {
  const result: Record<ClaimSource, number> = {
    [ClaimSource.DISPLAY]: 0,
    [ClaimSource.ADMIN]: 0
  };
  
  winners.forEach(winner => {
    winner.claims.forEach(claim => {
      result[claim.source] += claim.prizeIds.length;
    });
  });
  
  return result;
}

/**
 * Returns the fastest claim time in minutes
 */
export function getFastestClaimTime(winners: Array<Winner>): number | null {
  let fastestTime: number | null = null;
  
  winners.forEach(winner => {
    winner.claims.forEach(claim => {
      claim.prizeIds.forEach(prizeId => {
        const prize = winner.prizes.find(p => p.id === prizeId);
        if (prize) {
          const prizeTime = new Date(prize.timestamp).getTime();
          const claimTime = new Date(claim.timestamp).getTime();
          const timeDiffMinutes = (claimTime - prizeTime) / (1000 * 60);
          
          if (fastestTime === null || timeDiffMinutes < fastestTime) {
            fastestTime = timeDiffMinutes;
          }
        }
      });
    });
  });
  
  return fastestTime;
}

/**
 * Returns the slowest claim time in minutes
 */
export function getSlowestClaimTime(winners: Array<Winner>): number | null {
  let slowestTime: number | null = null;
  
  winners.forEach(winner => {
    winner.claims.forEach(claim => {
      claim.prizeIds.forEach(prizeId => {
        const prize = winner.prizes.find(p => p.id === prizeId);
        if (prize) {
          const prizeTime = new Date(prize.timestamp).getTime();
          const claimTime = new Date(claim.timestamp).getTime();
          const timeDiffMinutes = (claimTime - prizeTime) / (1000 * 60);
          
          if (slowestTime === null || timeDiffMinutes > slowestTime) {
            slowestTime = timeDiffMinutes;
          }
        }
      });
    });
  });
  
  return slowestTime;
}
