import { Command, Player } from "interfaces";
import { inject, injectable } from "inversify";
import { TYPES } from "lib/inversify";
import { CommandRunOptions } from "types";

@injectable()
export class SeekCommand implements Command {
  readonly name = "seek";
  readonly description = "Выбрать время на треке";
  readonly args = "time?";
  readonly defaultValue = 0;

  constructor(
    @inject(TYPES.Player) private readonly playerController: Player
  ) {}

  async run({ args, message }: CommandRunOptions) {
    if (!message.member || !message.guild?.id) {
      throw new Error();
    }

    const voiceChannel = message.member?.voice.channel;

    if (!voiceChannel) {
      throw new Error("Зайди в хату! Не будь крысой!");
    }

    const time = args?.length ? Number(args[0]) : this.defaultValue;

    if (isNaN(time)) {
      throw new Error("Даун! Число пиши!");
    }

    const guildQueue = this.playerController.player.getQueue(message.guild.id);

    if (!guildQueue) {
      throw new Error();
    }

    await guildQueue.seek(time * 1000);
  }
}
