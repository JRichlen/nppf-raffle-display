import React, { useState } from 'react';
import { StorageContext } from '../contexts/StorageContext';

export const StorageContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storage, setStorage] = useState<Storage>(localStorage);

  const getItem = (key: string): string | null => {
    return storage.getItem(key);
  };

  const setItem = (key: string, value: string): void => {
    storage.setItem(key, value);
    // Trigger re-render
    setStorage(localStorage);
  };

  return (
    <StorageContext.Provider value={{ getItem, setItem }}>
      {children}
    </StorageContext.Provider>
  );
};

