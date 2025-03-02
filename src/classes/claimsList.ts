import { v4 as uuidv4 } from "uuid";
import { Claim, ClaimSource } from "../types/claim";

export class ClaimList extends Array<Claim> {
  addClaim(prizeIds: string[], source: ClaimSource): void {
    this.push( {
      id: uuidv4(),
      timestamp: new Date(),
      prizeIds,
      source,
    });
  }
}

