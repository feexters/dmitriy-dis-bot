import { inject, injectable } from "inversify";
import { Client } from "discord.js";
import { TYPES } from "lib/inversify";
import { Player } from "interfaces";
import { Player as PlayerDiscord } from "discord-player";

@injectable()
export class PlayerController implements Player {
  player: PlayerDiscord;

  constructor(@inject(TYPES.Client) private readonly client: Client) {
    this.init();
  }

  init() {
    this.player = new PlayerDiscord(this.client, {
      connectionTimeout: 180000,
    });
  }
}
