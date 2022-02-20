import { shuffle } from "./shuffle";

export function takeRandom<T>(arr: T[]): T;
export function takeRandom<T>(arr: T[], amount: number): T[];
export function takeRandom<T>(arr: T[], amount?: number): T | T[] {
  if (!arr.length) {
    throw new Error("have no items");
  }

  if (amount) {
    return takeRandomMany(arr, amount);
  }

  return arr[Math.floor(Math.random() * arr.length)];
}

function takeRandomMany<T>(arr: T[], amount: number): T[] {
  return shuffle([...arr]).slice(-amount);
}
