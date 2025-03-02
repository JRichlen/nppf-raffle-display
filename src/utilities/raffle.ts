import { Winner } from "../types/winner";
import { Prize } from "../types/prize";

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
