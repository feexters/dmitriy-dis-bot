import { Player as PlayerDiscord } from "discord-player";

export interface Player {
  player: PlayerDiscord;
  init(): void;
  onActive(): void;
}