import { useContext } from 'react';
import { StorageContext } from '../contexts/StorageContext';

export const useStorageContext = () => {
  const context = useContext(StorageContext);
  
  /* istanbul ignore if */
  if (context === undefined) {
    throw new Error('useStorageContext must be used within a StorageContextProvider');
  }
  
  return context;
};