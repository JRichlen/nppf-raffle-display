export enum ClaimSource {
   DISPLAY = "DISPLAY",
   ADMIN = "ADMIN",
}

export interface Claim {
    id: string;
    timestamp: Date;
    prizeIds: string[];
    source: ClaimSource;
  }
  