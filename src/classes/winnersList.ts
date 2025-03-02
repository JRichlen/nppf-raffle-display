import { v4 as uuidv4 } from "uuid";
import { getUnclaimedPrizes } from "../utilities/raffle";
import { Winner } from "../types/winner";
import { PrizeList } from "./prizesList";
import { ClaimList } from "./claimsList";
import { ClaimSource } from "../types/claim";
import { logger } from "../utilities/logger";

export class WinnersList extends Array<Winner> {
  constructor(winners: Winner[] | WinnersList = []) {
    super();
    if (winners && Array.isArray(winners)) {
      winners.forEach(winner => {
        this.push({
          ...winner,
          prizes: new PrizeList(...winner.prizes),
          claims: new ClaimList(...winner.claims)
        });
      });
    }
  }

  addWinner(name: string): Winner {
    logger.info(`Adding new winner: ${name}`);
    const winner = {
      id: uuidv4(),
      name,
      prizes: new PrizeList(),
      claims: new ClaimList(),
    };
    this.push(winner);
    logger.debug(`Winner added with ID: ${winner.id}`);
    return winner;
  }

  findWinnerByName(name: string): Winner | undefined {
    logger.debug(`Searching for winner by name: ${name}`);
    const winner = this.find(
      (winner) => winner.name.toLowerCase() === name.toLowerCase()
    );
    logger.debug(`Winner found: ${winner ? 'Yes' : 'No'}`);
    return winner;
  }

  findWinnerById(id: string): Winner | undefined {
    logger.debug(`Searching for winner by ID: ${id}`);
    const winner = this.find((winner) => winner.id === id);
    logger.debug(`Winner found: ${winner ? 'Yes' : 'No'}`);
    return winner;
  }

  matchPartialName(partialName: string): Array<Winner> {
    logger.debug(`Searching for winners with partial name: ${partialName}`);
    const matches = this.filter((winner) =>
      winner.name.toLowerCase().includes(partialName.toLowerCase())
    );
    logger.debug(`Found ${matches.length} matching winners`);
    return matches;
  }

  recordPrizeForWinner(name: string): void {
    logger.info(`Recording prize for winner: ${name}`);
    const winner = this.findWinnerByName(name) || this.addWinner(name);
    winner.prizes.add();
    logger.debug(`Prize recorded for ${winner.name}, total prizes: ${winner.prizes.length}`);
  }

  recordClaimForWinner(winnerId: string, source = ClaimSource.DISPLAY): void {
    logger.info(`Recording claim for winner ID: ${winnerId}, source: ${source}`);
    const winner = this.findWinnerById(winnerId);

    if (!winner) {
      logger.error(`Error: Winner with ID ${winnerId} not found.`);
      throw new Error(`Winner with ID ${winnerId} not found.`);
    }

    const unclaimedPrizes = getUnclaimedPrizes(winner);
    logger.debug(`Unclaimed prizes count: ${unclaimedPrizes.length}`);

    if (unclaimedPrizes.length === 0) {
      logger.error(`Error: Winner ${winner.name} has no unclaimed prizes.`);
      throw new Error(`Winner with ID ${winnerId} has no unclaimed prizes.`);
    }

    const prizeIds = unclaimedPrizes.map((prize) => prize.id);
    logger.debug(`Claiming prizes with IDs: ${prizeIds.join(', ')}`);
    winner.claims.addClaim(prizeIds, source);
    logger.info(`Claim recorded successfully for ${winner.name}`);
  }

  recordSingleClaimForWinner(winnerId: string, prizeId: string, source: ClaimSource): void {
    logger.info(`Recording single claim for winner ID: ${winnerId}, prize ID: ${prizeId}`);
    const winner = this.findWinnerById(winnerId);

    if (!winner) {
      logger.error(`Error: Winner with ID ${winnerId} not found.`);
      throw new Error(`Winner with ID ${winnerId} not found.`);
    }

    const prize = winner.prizes.findPrizeById(prizeId);

    if (!prize) {
      logger.error(`Error: Prize with ID ${prizeId} not found.`);
      throw new Error(`Prize with ID ${prizeId} not found.`);
    }

    const isClaimed = winner.claims.some((claim) =>
      claim.prizeIds.includes(prizeId)
    );
    
    if (isClaimed) {
      logger.error(`Error: Prize with ID ${prizeId} has already been claimed.`);
      throw new Error(`Prize with ID ${prizeId} has already been claimed.`);
    }

    logger.debug(`Claiming single prize ID: ${prizeId}`);
    winner.claims.addClaim([prizeId], source);
    logger.info(`Single claim recorded successfully for ${winner.name}`);
  }
}
