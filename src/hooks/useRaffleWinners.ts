import { useContext } from 'react';
import { RaffleContext } from '../contexts/RaffleContext';

export const useRaffleWinners = () => {
  const context = useContext(RaffleContext);
  
  if (context === undefined) {
    throw new Error('useRaffleWinners must be used within a RaffleContextProvider');
  }
  
  return context;
};