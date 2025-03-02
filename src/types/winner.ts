import { ClaimList } from '../classes/claimsList';
import { PrizeList } from '../classes/prizesList';

export interface Winner {
  id: string;
  name: string;
  prizes: PrizeList;
  claims: ClaimList;
}
