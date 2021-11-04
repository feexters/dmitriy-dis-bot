import { Player as PlayerDiscord } from "discord-music-player";

export interface Player {
  player: PlayerDiscord;
  init(): void;
}