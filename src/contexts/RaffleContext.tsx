import { createContext } from 'react';
import { WinnersList } from '../classes/winnersList';
import { ClaimSource } from '../types/claim';

interface RaffleContextType {
  winners: WinnersList;
  recordWinner: (name: string) => void;
  recordClaim: (winnerId: string, source: ClaimSource) => void;
  recordSingleClaim: (winnerId: string, prizeId: string, source: ClaimSource) => void;
  setWinners: (winners: WinnersList) => void;
  clearWinners: () => void;
}

export const RaffleContext = createContext<RaffleContextType | undefined>(undefined);
