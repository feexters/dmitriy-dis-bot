import { Command, Player } from "interfaces";
import { inject, injectable } from "inversify";
import { TYPES } from "lib/inversify";
import { CommandRunOptions } from "types";

enum VolumeStepsType {
  BB ='bb',
  NORMAL = 'normal',
}
@injectable()
export class VolumeCommand implements Command {
  public readonly name = "volume";
  public readonly description = "Установить громкость бота";
  private readonly volumeSteps = {
    [VolumeStepsType.NORMAL]: 100,
    [VolumeStepsType.BB]: 10000,
  }

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

    const volume = args?.length ? args[0] : 100;

    const guildQueue = this.playerController.player.getQueue(message.guild.id);

    if (!guildQueue) {
      throw new Error();
    }

    if (volume === VolumeStepsType.BB) {
      return await guildQueue.setVolume(this.volumeSteps.bb);
    }

    if (volume === VolumeStepsType.NORMAL) {
      return await guildQueue.setVolume(this.volumeSteps.normal);
    }

    const numberVolume = Number(volume)

    if (isNaN(numberVolume)) {
      throw new Error("Даун! Число пиши!");
    }

    await guildQueue.setVolume(numberVolume);
  }
}
