import React, { useState, ReactNode } from "react";
import { WinnersList } from "../classes/winnersList";
import { RaffleContext } from "../contexts/RaffleContext";
import { ClaimSource } from "../types/claim";

interface RaffleContextProviderProps {
  children: ReactNode;
  winnersList: WinnersList;
}

export const RaffleContextProvider: React.FC<RaffleContextProviderProps> = ({
  children,
  winnersList,
}) => {
  const [winners, setWinners] = useState<WinnersList>(winnersList);

  const updateWinners = () => {
    setWinners(new WinnersList(winnersList));
  };

  const recordWinner = (name: string) => {
    winnersList.recordPrizeForWinner(name);
    updateWinners();
  };

  const recordClaim = (winnerId: string, source: ClaimSource) => {
    winnersList.recordClaimForWinner(winnerId, source);
    updateWinners();
  };

  const recordSingleClaim = (winnerId: string, prizeId: string, source: ClaimSource) => {
    winnersList.recordSingleClaimForWinner(winnerId, prizeId, source);
    updateWinners();
  };

  const clearWinners = () => {
    setWinners(new WinnersList());
  };

  return (
    <RaffleContext.Provider
      value={{
        winners,
        recordWinner,
        recordClaim,
        recordSingleClaim,
        setWinners,
        clearWinners,
      }}
    >
      {children}
    </RaffleContext.Provider>
  );
};
