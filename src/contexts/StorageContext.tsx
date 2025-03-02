import { createContext } from "react";

interface StorageContextType {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

export const StorageContext = createContext<StorageContextType | undefined>(undefined);