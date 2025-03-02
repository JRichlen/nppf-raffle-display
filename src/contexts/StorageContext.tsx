import { createContext } from "react";

interface StorageContextType {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
}

export const StorageContext = createContext<StorageContextType | undefined>(undefined);