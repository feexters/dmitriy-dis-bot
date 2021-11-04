import { Command, Player } from "interfaces";
import { inject, injectable } from "inversify";
import { TYPES } from "lib/inversify";
import { CommandRunOptions } from "types";

@injectable()
export class SkipCommand implements Command {
  public readonly name = "skip";
  public readonly description = "Пропустить трек";

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

    guildQueue.skip();
  }
}