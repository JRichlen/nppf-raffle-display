import { v4 as uuidv4 } from "uuid";
import { Prize } from "../types/prize";

export class PrizeList extends Array<Prize> {
  get totalPrizes(): number {
    return this.length;
  }

  add(): void {
    this.push({
      id: uuidv4(),
      timestamp: new Date(),
    });
  }

  findPrizeById(id: string): Prize | undefined {
    return this.find((prize) => prize.id === id);
  }
}
