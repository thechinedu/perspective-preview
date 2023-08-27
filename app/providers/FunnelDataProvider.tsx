"use client";

import {
  createContext,
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";

type FunnelBlockBase = {
  id: string;
  type: "text" | "image" | "list" | "button";
};

export type FunnelBlockText = FunnelBlockBase & {
  text: string;
  color: string;
  align: string;
};

export type FunnelBlockImage = FunnelBlockBase & {
  src: string;
};

type FunnelBlockListItem = {
  title: string;
  description: string;
  src: string;
};

export type FunnelBlockList = FunnelBlockBase & {
  items: FunnelBlockListItem[];
};

export type FunnelBlockButton = FunnelBlockBase & {
  text: string;
  color: string;
  bgColor: string;
};

export type FunnelBlock =
  | FunnelBlockText
  | FunnelBlockImage
  | FunnelBlockList
  | FunnelBlockButton;

type FunnelPage = {
  id: string;
  blocks: FunnelBlock[];
};

export type FunnelData = {
  name: string;
  bgColor: string;
  pages: FunnelPage[];
};

type FunnelDataContextProps = {
  funnelData: FunnelData | null;
  setFunnelData: Dispatch<SetStateAction<FunnelData | null>>;
};

const FunnelDataContext = createContext<FunnelDataContextProps | null>(null);

export const FunnelDataProvider: FC<PropsWithChildren> = ({ children }) => {
  const [funnelData, setFunnelData] = useState<FunnelData | null>(null);

  return (
    <FunnelDataContext.Provider value={{ funnelData, setFunnelData }}>
      {children}
    </FunnelDataContext.Provider>
  );
};

export const useFunnelData = () => {
  const context = useContext(FunnelDataContext);

  if (!context) {
    throw new Error("useFunnelData must be used within a FunnelDataProvider");
  }

  return context;
};
