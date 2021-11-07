import { inject, injectable } from "inversify";
import { Client } from "discord.js";
import { TYPES } from "lib/inversify";
import { Player } from "interfaces";
import { Player as PlayerDiscord } from "discord-player";
import { LEAVE_TIMEOUT_MS } from "constant";

@injectable()
export class PlayerController implements Player {
  player: PlayerDiscord;
  timeoutStopOnEndId?: NodeJS.Timeout;

  constructor(@inject(TYPES.Client) private readonly client: Client) {
    this.init();
  }

  init() {
    this.player = new PlayerDiscord(this.client);

    this.player.on("queueEnd", (queue) => {
      this.timeoutStopOnEndId = setTimeout(
        () => queue.stop(),
        LEAVE_TIMEOUT_MS
      );
    });
  }

  onActive() {
    if (this.timeoutStopOnEndId) {
      clearTimeout(this.timeoutStopOnEndId);
    }
  }
}
