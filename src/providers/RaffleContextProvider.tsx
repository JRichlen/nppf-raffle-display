import React, { useState, ReactNode, useEffect } from "react";
import { WinnersList } from "../classes/winnersList";
import { RaffleContext } from "../contexts/RaffleContext";
import { ClaimSource } from "../types/claim";
import { logger } from "../utilities/logger";
import { useStorageContext } from "../hooks/useStorageContext";

interface RaffleContextProviderProps {
  children: ReactNode;
  winnersList: WinnersList;
}

export const RaffleContextProvider: React.FC<RaffleContextProviderProps> = ({
  children,
}) => {
  const { getItem, setItem } = useStorageContext();
  const [winners, setWinners] = useState<WinnersList>(() => {
    const savedWinners = getItem("raffleWinners");

    if (savedWinners) {
      logger.info('Found saved winners in localStorage');
      logger.info(savedWinners);
      try {
        // Deserialize the JSON string back into objects
        const parsedData = JSON.parse(savedWinners);
        return new WinnersList(parsedData);

      /* istanbul ignore next */
      } catch (e: unknown) {
        /* istanbul ignore if */  
        if (e instanceof Error) {
          logger.error(e.message);
        }
        logger.error('Failed to parse winners from localStorage');
        return new WinnersList();
      }
    }
    return new WinnersList();
  });

  useEffect(() => {
    setItem("raffleWinners", JSON.stringify(winners));
  }, [winners, setItem]);

  const updateWinners = () => {
    setWinners(new WinnersList(winners));
  };

  const recordWinner = (name: string) => {
    winners.recordPrizeForWinner(name);
    updateWinners();
  };

  const recordClaim = (winnerId: string, source: ClaimSource) => {
    winners.recordClaimForWinner(winnerId, source);
    updateWinners();
  };

  const recordSingleClaim = (
    winnerId: string,
    prizeId: string,
    source: ClaimSource
  ) => {
    winners.recordSingleClaimForWinner(winnerId, prizeId, source);
    updateWinners();
  };

  const clearWinners = () => {
    setWinners(new WinnersList());
    setItem('raffleWinners', '[]');
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
