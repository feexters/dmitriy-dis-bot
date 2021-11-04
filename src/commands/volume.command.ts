import { Command, Player } from "interfaces";
import { inject, injectable } from "inversify";
import { TYPES } from "lib/inversify";
import { CommandRunOptions } from "types";

@injectable()
export class VolumeCommand implements Command {
  public readonly name = "volume";
  public readonly description = "Установить громкость бота";

  constructor(
    @inject(TYPES.Player) private readonly playerController: Player
  ) {}

  async run({ message, args }: CommandRunOptions) {
    if (!message.member || !message.guild?.id) {
      throw new Error();
    }

    const voiceChannel = message.member?.voice.channel;

    if (!voiceChannel) {
      throw new Error("Зайди в хату! Не будь крысой!");
    }

    const volume = args?.length ? Number(args[0]) : 0

    if (isNaN(volume)) {
      throw new Error("Даун! Число пиши!");
    }

    const guildQueue = this.playerController.player.getQueue(message.guild.id);

    if (!guildQueue) {
      throw new Error();
    }

    await guildQueue.setVolume(volume);
  }
}