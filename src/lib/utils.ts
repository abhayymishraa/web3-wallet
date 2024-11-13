import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const walletTypes = ["Ethereum", "Solana"];

export const solanaApiUrl = import.meta.env.VITE_REACT_APP_API_URL_SOLANA;
export const ethApiUrl = import.meta.env.VITE_REACT_APP_API_URL_ETH;
