import { Command, Player } from "interfaces";
import { inject, injectable } from "inversify";
import { TYPES } from "lib/inversify";
import { CommandRunOptions } from "types";

@injectable()
export class StopCommand implements Command {
  readonly name = "stop";
  readonly description = "Остановить бота";

  constructor(
    @inject(TYPES.Player) private readonly playerController: Player
  ) {}

  async run({ message }: CommandRunOptions) {
    if (!message.member || !message.guild?.id) {
      throw new Error();
    }

    const voiceChannel = message.member?.voice.channel;

    if (!voiceChannel) {
      throw new Error("Зайди в хату! Не будь крысой!");
    }

    const guildQueue = this.playerController.player.getQueue(message.guild.id);

    if (!guildQueue) {
      throw new Error();
    }

    guildQueue.stop();
  }
}
